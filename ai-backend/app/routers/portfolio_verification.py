from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.database import get_db, mongo_db
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel
import requests
import re
import pandas as pd
from urllib.parse import urlparse

router = APIRouter()

class GitHubVerificationRequest(BaseModel):
    github_url: str

class CertificationVerificationRequest(BaseModel):
    certification_url: str
    title: str

class PortfolioItem(BaseModel):
    user_id: str
    item_type: str  # 'certification', 'project', 'course'
    title: str
    url: str
    description: str = ""
    skills: List[str] = []
    completion_date: str = ""

class VerificationRequest(BaseModel):
    user_id: str
    items: List[PortfolioItem]

@router.post("/verify-github")
async def verify_github_repository(request: GitHubVerificationRequest):
    """Verify a GitHub repository URL"""
    
    try:
        # Validate GitHub URL format
        github_regex = r'^https?://(www\.)?github\.com/[\w-]+/[\w.-]+/?$'
        if not re.match(github_regex, request.github_url):
            raise HTTPException(status_code=400, detail="Invalid GitHub repository URL format")
        
        # Verify the GitHub project
        result = await verify_github_project(request.github_url)
        
        if result.get('verified'):
            return JSONResponse(content={
                "success": True,
                "message": f"GitHub project verified successfully! Confidence: {int(result['confidence_score'] * 100)}%",
                "verified": True,
                "confidence_score": result['confidence_score'],
                "metadata": result.get('metadata', {})
            })
        else:
            issues = ", ".join(result.get('issues', ['Unknown error']))
            raise HTTPException(status_code=400, detail=f"Verification failed: {issues}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GitHub verification failed: {str(e)}")

@router.post("/verify-certification")
async def verify_certification_link(request: CertificationVerificationRequest):
    """Verify a certification URL"""
    
    try:
        # Validate URL format
        url_regex = r'^https?://.+\..+'
        if not re.match(url_regex, request.certification_url):
            raise HTTPException(status_code=400, detail="Invalid certification URL format")
        
        # Determine verification method based on URL
        parsed_url = urlparse(request.certification_url)
        domain = parsed_url.netloc.lower()
        
        if "coursera.org" in domain or "edx.org" in domain or "udemy.com" in domain:
            result = await verify_course_certificate(request.certification_url)
        elif "linkedin.com" in domain:
            result = await verify_linkedin_certificate(request.certification_url)
        elif "credly.com" in domain or "badgr.com" in domain:
            result = await verify_digital_badge(request.certification_url)
        else:
            result = await verify_generic_url(request.certification_url)
        
        if result.get('verified'):
            platform = result.get('metadata', {}).get('platform', 'Unknown')
            confidence = int(result['confidence_score'] * 100)
            return JSONResponse(content={
                "success": True,
                "message": f"Certification verified successfully on {platform}! Confidence: {confidence}%",
                "verified": True,
                "confidence_score": result['confidence_score'],
                "metadata": result.get('metadata', {}),
                "title": request.title
            })
        else:
            issues = ", ".join(result.get('issues', ['Unknown error']))
            raise HTTPException(status_code=400, detail=f"Verification failed: {issues}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Certification verification failed: {str(e)}")

@router.post("/verify")
async def verify_portfolio_items(
    request: VerificationRequest,
    db: Session = Depends(get_db)
):
    """Verify portfolio items (certifications, projects, courses)"""
    
    try:
        verification_results = []
        
        for item in request.items:
            result = await verify_single_item(item)
            verification_results.append(result)
        
        # Save verification results to MongoDB
        await save_verification_results(request.user_id, verification_results)
        
        # Calculate overall verification score
        verified_count = sum(1 for r in verification_results if r['verified'])
        verification_score = (verified_count / len(verification_results)) * 100 if verification_results else 0
        
        return JSONResponse(content={
            "success": True,
            "verification_score": round(verification_score, 1),
            "total_items": len(verification_results),
            "verified_items": verified_count,
            "results": verification_results
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@router.post("/verify-single")
async def verify_single_portfolio_item(
    item: PortfolioItem,
    db: Session = Depends(get_db)
):
    """Verify a single portfolio item"""
    
    try:
        result = await verify_single_item(item)
        
        return JSONResponse(content={
            "success": True,
            "result": result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Single item verification failed: {str(e)}")

@router.get("/portfolio/{user_id}")
async def get_user_portfolio(user_id: str):
    """Get user's verified portfolio"""
    
    try:
        portfolio = await mongo_db.user_portfolios.find_one({"userId": user_id})
        
        if not portfolio:
            return JSONResponse(content={
                "success": True,
                "portfolio": {
                    "items": [],
                    "verification_score": 0,
                    "total_items": 0
                }
            })
        
        portfolio.pop('_id', None)
        
        return JSONResponse(content={
            "success": True,
            "portfolio": portfolio
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch portfolio: {str(e)}")

@router.post("/add-achievement")
async def add_achievement(
    achievement: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Add a new achievement to user's portfolio"""
    
    try:
        user_id = achievement.get('user_id')
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        
        # Verify the achievement if URL is provided
        if achievement.get('url'):
            item = PortfolioItem(
                user_id=user_id,
                item_type=achievement.get('type', 'achievement'),
                title=achievement.get('title', ''),
                url=achievement['url'],
                description=achievement.get('description', ''),
                skills=achievement.get('skills', [])
            )
            verification_result = await verify_single_item(item)
            achievement['verified'] = verification_result['verified']
            achievement['verification_details'] = verification_result
        else:
            achievement['verified'] = False
        
        # Add timestamp
        achievement['added_at'] = {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
        
        # Update user's portfolio
        await mongo_db.user_portfolios.update_one(
            {"userId": user_id},
            {
                "$push": {"items": achievement},
                "$set": {"updatedAt": achievement['added_at']}
            },
            upsert=True
        )
        
        return JSONResponse(content={
            "success": True,
            "message": "Achievement added successfully",
            "verified": achievement['verified']
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add achievement: {str(e)}")

@router.delete("/remove-item")
async def remove_portfolio_item(
    request: Dict[str, str],
    db: Session = Depends(get_db)
):
    """Remove an item from user's portfolio"""
    
    try:
        user_id = request.get('user_id')
        item_id = request.get('item_id')
        
        if not user_id or not item_id:
            raise HTTPException(status_code=400, detail="User ID and Item ID are required")
        
        # Remove item from portfolio
        result = await mongo_db.user_portfolios.update_one(
            {"userId": user_id},
            {"$pull": {"items": {"id": item_id}}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return JSONResponse(content={
            "success": True,
            "message": "Item removed successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove item: {str(e)}")

async def verify_single_item(item: PortfolioItem) -> Dict[str, Any]:
    """Verify a single portfolio item"""
    
    verification_result = {
        "item_id": f"{item.user_id}_{hash(item.url)}",
        "title": item.title,
        "url": item.url,
        "type": item.item_type,
        "verified": False,
        "verification_method": "",
        "confidence_score": 0.0,
        "issues": [],
        "metadata": {}
    }
    
    try:
        # Parse URL
        parsed_url = urlparse(item.url)
        domain = parsed_url.netloc.lower()
        
        # Different verification strategies based on domain
        if "github.com" in domain:
            result = await verify_github_project(item.url)
        elif "coursera.org" in domain or "edx.org" in domain or "udemy.com" in domain:
            result = await verify_course_certificate(item.url)
        elif "linkedin.com" in domain and "learning" in item.url:
            result = await verify_linkedin_certificate(item.url)
        elif "credly.com" in domain or "badgr.com" in domain:
            result = await verify_digital_badge(item.url)
        else:
            result = await verify_generic_url(item.url)
        
        verification_result.update(result)
        
    except Exception as e:
        verification_result["issues"].append(f"Verification error: {str(e)}")
        verification_result["confidence_score"] = 0.0
    
    return verification_result

async def verify_github_project(url: str) -> Dict[str, Any]:
    """Verify GitHub project"""
    
    try:
        # Extract owner and repo from URL
        match = re.search(r'github\.com/([^/]+)/([^/]+)', url)
        if not match:
            return {"verified": False, "issues": ["Invalid GitHub URL format"]}
        
        owner, repo = match.groups()
        
        # GitHub API call
        api_url = f"https://api.github.com/repos/{owner}/{repo}"
        headers = {"Accept": "application/vnd.github.v3+json"}
        
        # Add GitHub token if available
        from app.core.config import settings
        if settings.GITHUB_TOKEN:
            headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"
        
        response = requests.get(api_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            repo_data = response.json()
            
            # Check if repo is public and has content
            if not repo_data.get('private', True):  # Public repo
                # Get additional metrics
                commits_url = f"https://api.github.com/repos/{owner}/{repo}/commits"
                commits_response = requests.get(commits_url, headers=headers, timeout=10)
                
                commit_count = len(commits_response.json()) if commits_response.status_code == 200 else 0
                
                confidence_score = min(0.9, 0.5 + (commit_count * 0.01))  # Base 0.5 + commits bonus
                
                return {
                    "verified": True,
                    "verification_method": "GitHub API",
                    "confidence_score": confidence_score,
                    "metadata": {
                        "stars": repo_data.get('stargazers_count', 0),
                        "forks": repo_data.get('forks_count', 0),
                        "language": repo_data.get('language'),
                        "description": repo_data.get('description'),
                        "commits": commit_count,
                        "created_at": repo_data.get('created_at'),
                        "updated_at": repo_data.get('updated_at')
                    }
                }
            else:
                return {
                    "verified": False,
                    "issues": ["Repository is private or inaccessible"],
                    "confidence_score": 0.0
                }
        
        elif response.status_code == 404:
            return {
                "verified": False,
                "issues": ["Repository not found"],
                "confidence_score": 0.0
            }
        else:
            return {
                "verified": False,
                "issues": [f"GitHub API error: {response.status_code}"],
                "confidence_score": 0.0
            }
            
    except Exception as e:
        return {
            "verified": False,
            "issues": [f"GitHub verification failed: {str(e)}"],
            "confidence_score": 0.0
        }

async def verify_course_certificate(url: str) -> Dict[str, Any]:
    """Verify course certificate from major platforms"""
    
    try:
        response = requests.head(url, timeout=10, allow_redirects=True)
        
        if response.status_code == 200:
            # Check if it's a valid certificate URL pattern
            certificate_patterns = [
                r'coursera\.org/account/accomplishments',
                r'edx\.org/certificates',
                r'udemy\.com/certificate',
                r'verify\.edx\.org'
            ]
            
            if any(re.search(pattern, url) for pattern in certificate_patterns):
                return {
                    "verified": True,
                    "verification_method": "URL pattern matching + HTTP check",
                    "confidence_score": 0.8,
                    "metadata": {
                        "platform": extract_platform_name(url),
                        "accessible": True
                    }
                }
            else:
                return {
                    "verified": True,
                    "verification_method": "HTTP accessibility check",
                    "confidence_score": 0.6,
                    "metadata": {"accessible": True}
                }
        else:
            return {
                "verified": False,
                "issues": [f"Certificate URL not accessible (HTTP {response.status_code})"],
                "confidence_score": 0.0
            }
            
    except Exception as e:
        return {
            "verified": False,
            "issues": [f"Certificate verification failed: {str(e)}"],
            "confidence_score": 0.0
        }

async def verify_linkedin_certificate(url: str) -> Dict[str, Any]:
    """Verify LinkedIn Learning certificate"""
    
    try:
        # LinkedIn certificates often require authentication, so we do basic URL validation
        if "linkedin.com/learning/certificates" in url:
            response = requests.head(url, timeout=10)
            
            return {
                "verified": response.status_code in [200, 302],  # 302 for redirect to login
                "verification_method": "LinkedIn URL pattern + HTTP check",
                "confidence_score": 0.7 if response.status_code in [200, 302] else 0.0,
                "metadata": {
                    "platform": "LinkedIn Learning",
                    "requires_authentication": True
                }
            }
        else:
            return {
                "verified": False,
                "issues": ["Invalid LinkedIn certificate URL format"],
                "confidence_score": 0.0
            }
            
    except Exception as e:
        return {
            "verified": False,
            "issues": [f"LinkedIn verification failed: {str(e)}"],
            "confidence_score": 0.0
        }

async def verify_digital_badge(url: str) -> Dict[str, Any]:
    """Verify digital badges from Credly, Badgr, etc."""
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            # Look for badge verification indicators in the HTML
            content = response.text.lower()
            
            badge_indicators = [
                "digital badge", "verified badge", "credly", "badgr",
                "open badge", "badge verification"
            ]
            
            if any(indicator in content for indicator in badge_indicators):
                return {
                    "verified": True,
                    "verification_method": "Digital badge platform verification",
                    "confidence_score": 0.85,
                    "metadata": {
                        "platform": extract_platform_name(url),
                        "badge_verified": True
                    }
                }
            else:
                return {
                    "verified": False,
                    "issues": ["No badge verification indicators found"],
                    "confidence_score": 0.0
                }
        else:
            return {
                "verified": False,
                "issues": [f"Badge URL not accessible (HTTP {response.status_code})"],
                "confidence_score": 0.0
            }
            
    except Exception as e:
        return {
            "verified": False,
            "issues": [f"Badge verification failed: {str(e)}"],
            "confidence_score": 0.0
        }

async def verify_generic_url(url: str) -> Dict[str, Any]:
    """Generic URL verification"""
    
    try:
        response = requests.head(url, timeout=10, allow_redirects=True)
        
        if response.status_code == 200:
            return {
                "verified": True,
                "verification_method": "HTTP accessibility check",
                "confidence_score": 0.5,
                "metadata": {
                    "accessible": True,
                    "content_type": response.headers.get('content-type', 'unknown')
                }
            }
        else:
            return {
                "verified": False,
                "issues": [f"URL not accessible (HTTP {response.status_code})"],
                "confidence_score": 0.0
            }
            
    except Exception as e:
        return {
            "verified": False,
            "issues": [f"URL verification failed: {str(e)}"],
            "confidence_score": 0.0
        }

def extract_platform_name(url: str) -> str:
    """Extract platform name from URL"""
    
    domain = urlparse(url).netloc.lower()
    
    platform_mapping = {
        "coursera.org": "Coursera",
        "edx.org": "edX",
        "udemy.com": "Udemy",
        "linkedin.com": "LinkedIn Learning",
        "credly.com": "Credly",
        "badgr.com": "Badgr",
        "github.com": "GitHub"
    }
    
    for domain_key, platform_name in platform_mapping.items():
        if domain_key in domain:
            return platform_name
    
    return domain

async def save_verification_results(user_id: str, results: List[Dict[str, Any]]):
    """Save verification results to MongoDB"""
    
    try:
        # Update user's portfolio with verification results
        portfolio_doc = {
            "userId": user_id,
            "items": results,
            "verification_date": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}},
            "total_items": len(results),
            "verified_items": sum(1 for r in results if r['verified']),
            "verification_score": (sum(1 for r in results if r['verified']) / len(results)) * 100 if results else 0
        }
        
        await mongo_db.user_portfolios.update_one(
            {"userId": user_id},
            {"$set": portfolio_doc},
            upsert=True
        )
        
    except Exception as e:
        print(f"Error saving verification results: {str(e)}")
        # Don't raise exception to avoid breaking main flow
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.database import get_db, mongo_db
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel
import pandas as pd

router = APIRouter()

class UserProfile(BaseModel):
    user_id: str
    personal_info: Dict[str, Any] = {}
    academic_info: Dict[str, Any] = {}
    skills: List[str] = []
    interests: List[str] = []
    career_goals: List[str] = []
    experience_level: str = "beginner"

class ProfileUpdateRequest(BaseModel):
    user_id: str
    updates: Dict[str, Any]

@router.post("/create")
async def create_user_profile(
    profile: UserProfile,
    db: Session = Depends(get_db)
):
    """Create comprehensive user profile for AI recommendations"""
    
    try:
        # Create profile document
        profile_doc = {
            "userId": profile.user_id,
            "personalInfo": profile.personal_info,
            "academicInfo": profile.academic_info,
            "skills": profile.skills,
            "interests": profile.interests,
            "careerGoals": profile.career_goals,
            "experienceLevel": profile.experience_level,
            "createdAt": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}},
            "updatedAt": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}},
            "profileCompleteness": calculate_profile_completeness(profile.dict())
        }
        
        # Check if profile already exists
        existing_profile = await mongo_db.user_profiles.find_one({"userId": profile.user_id})
        
        if existing_profile:
            # Update existing profile
            await mongo_db.user_profiles.update_one(
                {"userId": profile.user_id},
                {"$set": profile_doc}
            )
            message = "Profile updated successfully"
        else:
            # Create new profile
            await mongo_db.user_profiles.insert_one(profile_doc)
            message = "Profile created successfully"
        
        return JSONResponse(content={
            "success": True,
            "message": message,
            "profile_completeness": profile_doc["profileCompleteness"]
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile creation failed: {str(e)}")

@router.get("/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile by ID"""
    
    try:
        profile = await mongo_db.user_profiles.find_one({"userId": user_id})
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Remove MongoDB _id field
        profile.pop('_id', None)
        
        return JSONResponse(content={
            "success": True,
            "profile": profile
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")

@router.put("/update")
async def update_user_profile(
    request: ProfileUpdateRequest,
    db: Session = Depends(get_db)
):
    """Update specific fields in user profile"""
    
    try:
        # Add timestamp to updates
        updates = request.updates.copy()
        updates["updatedAt"] = {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
        
        # Update profile
        result = await mongo_db.user_profiles.update_one(
            {"userId": request.user_id},
            {"$set": updates}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Get updated profile to calculate completeness
        updated_profile = await mongo_db.user_profiles.find_one({"userId": request.user_id})
        completeness = calculate_profile_completeness(updated_profile)
        
        # Update completeness
        await mongo_db.user_profiles.update_one(
            {"userId": request.user_id},
            {"$set": {"profileCompleteness": completeness}}
        )
        
        return JSONResponse(content={
            "success": True,
            "message": "Profile updated successfully",
            "profile_completeness": completeness
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile update failed: {str(e)}")

@router.post("/analyze-skills")
async def analyze_user_skills(
    request: Dict[str, Any]
):
    """Analyze user skills and suggest improvements"""
    
    try:
        user_id = request.get('user_id')
        skills = request.get('skills', [])
        
        if not user_id or not skills:
            raise HTTPException(status_code=400, detail="User ID and skills are required")
        
        # Skill analysis logic
        skill_analysis = {
            "total_skills": len(skills),
            "skill_categories": categorize_skills(skills),
            "skill_gaps": identify_skill_gaps(skills),
            "recommended_skills": suggest_complementary_skills(skills),
            "skill_level_assessment": assess_skill_levels(skills)
        }
        
        # Save analysis to MongoDB
        analysis_doc = {
            "userId": user_id,
            "analysis": skill_analysis,
            "timestamp": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
        }
        
        await mongo_db.skill_analyses.insert_one(analysis_doc)
        
        return JSONResponse(content={
            "success": True,
            "analysis": skill_analysis
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill analysis failed: {str(e)}")

@router.get("/completeness/{user_id}")
async def get_profile_completeness(user_id: str):
    """Get profile completeness score and suggestions"""
    
    try:
        profile = await mongo_db.user_profiles.find_one({"userId": user_id})
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        completeness = calculate_profile_completeness(profile)
        suggestions = generate_completion_suggestions(profile)
        
        return JSONResponse(content={
            "success": True,
            "completeness_score": completeness,
            "suggestions": suggestions,
            "missing_fields": identify_missing_fields(profile)
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate completeness: {str(e)}")

def calculate_profile_completeness(profile: Dict[str, Any]) -> float:
    """Calculate profile completeness percentage"""
    
    required_fields = [
        'personalInfo', 'academicInfo', 'skills', 'interests', 
        'careerGoals', 'experienceLevel'
    ]
    
    score = 0.0
    total_weight = 0.0
    
    # Weight different sections
    field_weights = {
        'personalInfo': 0.15,
        'academicInfo': 0.25,
        'skills': 0.25,
        'interests': 0.15,
        'careerGoals': 0.15,
        'experienceLevel': 0.05
    }
    
    for field in required_fields:
        weight = field_weights.get(field, 0.1)
        total_weight += weight
        
        if field in profile and profile[field]:
            if isinstance(profile[field], (list, dict)):
                if len(profile[field]) > 0:
                    score += weight
            else:
                if profile[field]:
                    score += weight
    
    return round((score / total_weight) * 100, 1) if total_weight > 0 else 0.0

def categorize_skills(skills: List[str]) -> Dict[str, List[str]]:
    """Categorize skills into different domains"""
    
    categories = {
        "Programming": [],
        "Web Development": [],
        "Data Science": [],
        "Mobile Development": [],
        "DevOps": [],
        "Design": [],
        "Other": []
    }
    
    skill_mappings = {
        "Programming": ["python", "java", "c++", "javascript", "c#", "go", "rust"],
        "Web Development": ["html", "css", "react", "angular", "vue", "node.js", "express"],
        "Data Science": ["machine learning", "data analysis", "pandas", "numpy", "tensorflow", "pytorch"],
        "Mobile Development": ["android", "ios", "react native", "flutter", "swift", "kotlin"],
        "DevOps": ["docker", "kubernetes", "aws", "azure", "jenkins", "git"],
        "Design": ["ui/ux", "figma", "photoshop", "illustrator", "sketch"]
    }
    
    for skill in skills:
        skill_lower = skill.lower()
        categorized = False
        
        for category, keywords in skill_mappings.items():
            if any(keyword in skill_lower for keyword in keywords):
                categories[category].append(skill)
                categorized = True
                break
        
        if not categorized:
            categories["Other"].append(skill)
    
    # Remove empty categories
    return {k: v for k, v in categories.items() if v}

def identify_skill_gaps(skills: List[str]) -> List[str]:
    """Identify potential skill gaps based on current skills"""
    
    skill_lower = [s.lower() for s in skills]
    gaps = []
    
    # Programming gaps
    if any("python" in s for s in skill_lower):
        if not any("data" in s or "pandas" in s for s in skill_lower):
            gaps.append("Data analysis with Python")
    
    # Web development gaps
    if any("javascript" in s for s in skill_lower):
        if not any("react" in s or "vue" in s or "angular" in s for s in skill_lower):
            gaps.append("Modern JavaScript framework")
    
    # General gaps
    if not any("git" in s for s in skill_lower):
        gaps.append("Version control (Git)")
    
    if not any("database" in s or "sql" in s for s in skill_lower):
        gaps.append("Database management")
    
    return gaps[:5]  # Return top 5 gaps

def suggest_complementary_skills(skills: List[str]) -> List[str]:
    """Suggest complementary skills based on current skills"""
    
    skill_lower = [s.lower() for s in skills]
    suggestions = []
    
    # If they have programming skills, suggest related tools
    if any("python" in s for s in skill_lower):
        suggestions.extend(["Django", "Flask", "FastAPI", "Pandas", "NumPy"])
    
    if any("javascript" in s for s in skill_lower):
        suggestions.extend(["TypeScript", "Node.js", "Express.js", "MongoDB"])
    
    # If they have web dev skills, suggest deployment
    if any(web in s for s in skill_lower for web in ["html", "css", "javascript", "react"]):
        suggestions.extend(["AWS", "Docker", "Nginx"])
    
    # Remove duplicates and limit
    suggestions = list(set(suggestions))
    return suggestions[:8]

def assess_skill_levels(skills: List[str]) -> Dict[str, str]:
    """Assess skill levels based on skill combinations"""
    
    assessment = {}
    
    for skill in skills:
        # Simple heuristic - in real implementation, this would be more sophisticated
        if any(advanced in skill.lower() for advanced in ["advanced", "expert", "senior"]):
            assessment[skill] = "Advanced"
        elif any(intermediate in skill.lower() for intermediate in ["intermediate", "proficient"]):
            assessment[skill] = "Intermediate"
        else:
            assessment[skill] = "Beginner"
    
    return assessment

def generate_completion_suggestions(profile: Dict[str, Any]) -> List[str]:
    """Generate suggestions to improve profile completeness"""
    
    suggestions = []
    
    if not profile.get('personalInfo') or not profile['personalInfo']:
        suggestions.append("Add personal information (name, location, contact)")
    
    if not profile.get('academicInfo') or not profile['academicInfo']:
        suggestions.append("Add academic background (degree, institution, GPA)")
    
    if not profile.get('skills') or len(profile['skills']) < 3:
        suggestions.append("Add more skills (aim for at least 5-8 skills)")
    
    if not profile.get('interests'):
        suggestions.append("Add your interests and areas of curiosity")
    
    if not profile.get('careerGoals'):
        suggestions.append("Define your career goals and aspirations")
    
    return suggestions

def identify_missing_fields(profile: Dict[str, Any]) -> List[str]:
    """Identify missing or incomplete profile fields"""
    
    missing = []
    
    required_fields = {
        'personalInfo': 'Personal Information',
        'academicInfo': 'Academic Background',
        'skills': 'Skills',
        'interests': 'Interests',
        'careerGoals': 'Career Goals',
        'experienceLevel': 'Experience Level'
    }
    
    for field, display_name in required_fields.items():
        if not profile.get(field) or (isinstance(profile[field], (list, dict)) and len(profile[field]) == 0):
            missing.append(display_name)
    
    return missing
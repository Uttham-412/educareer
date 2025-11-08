from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.services.recommendation_engine import RecommendationEngine
from app.database import get_db, mongo_db
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

router = APIRouter()
recommendation_engine = RecommendationEngine()

class RecommendationRequest(BaseModel):
    user_id: str
    courses: List[str]
    user_profile: Dict[str, Any] = {}

class FeedbackRequest(BaseModel):
    user_id: str
    item_id: str
    feedback: str  # 'positive', 'negative', 'completed'

@router.post("/certifications")
async def get_certification_recommendations(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """Get AI-powered certification recommendations based on user's courses"""
    
    try:
        if not request.courses:
            raise HTTPException(status_code=400, detail="No courses provided")
        
        # Get recommendations from AI engine
        recommendations = recommendation_engine.find_similar_certifications(
            request.courses, 
            request.user_profile
        )
        
        # Format response
        formatted_recommendations = []
        for rec in recommendations:
            cert = rec['certification']
            formatted_rec = {
                'id': cert['id'],
                'name': cert['name'],
                'provider': cert['provider'],
                'description': cert['description'],
                'skills': cert['skills'],
                'difficulty': cert['difficulty'],
                'duration_hours': cert['duration_hours'],
                'cost': cert['cost'],
                'url': cert['url'],
                'prerequisites': cert['prerequisites'],
                'similarity_score': round(rec['similarity_score'], 3),
                'graph_score': round(rec['graph_score'], 3),
                'ranking_score': round(rec.get('ranking_score', 0), 3),
                'match_reasons': generate_match_reasons(cert, request.courses)
            }
            formatted_recommendations.append(formatted_rec)
        
        # Save recommendations to MongoDB for tracking
        await save_recommendations(request.user_id, 'certifications', formatted_recommendations)
        
        return JSONResponse(content={
            "success": True,
            "total_recommendations": len(formatted_recommendations),
            "recommendations": formatted_recommendations,
            "user_courses": request.courses
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")

@router.post("/projects")
async def get_project_recommendations(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """Get AI-powered project recommendations based on user's courses"""
    
    try:
        if not request.courses:
            raise HTTPException(status_code=400, detail="No courses provided")
        
        # Get recommendations from AI engine
        recommendations = recommendation_engine.find_project_recommendations(
            request.courses, 
            request.user_profile
        )
        
        # Format response
        formatted_recommendations = []
        for rec in recommendations:
            project = rec['project']
            formatted_rec = {
                'id': project['id'],
                'name': project['name'],
                'description': project['description'],
                'skills': project['skills'],
                'difficulty': project['difficulty'],
                'estimated_hours': project['estimated_hours'],
                'technologies': project['technologies'],
                'github_template': project['github_template'],
                'similarity_score': round(rec['similarity_score'], 3),
                'skill_overlap': round(rec['skill_overlap'], 3),
                'graph_score': round(rec['graph_score'], 3),
                'match_reasons': generate_match_reasons(project, request.courses)
            }
            formatted_recommendations.append(formatted_rec)
        
        # Save recommendations to MongoDB for tracking
        await save_recommendations(request.user_id, 'projects', formatted_recommendations)
        
        return JSONResponse(content={
            "success": True,
            "total_recommendations": len(formatted_recommendations),
            "recommendations": formatted_recommendations,
            "user_courses": request.courses
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Project recommendation generation failed: {str(e)}")

@router.post("/combined")
async def get_combined_recommendations(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """Get both certification and project recommendations in one call"""
    
    try:
        if not request.courses:
            raise HTTPException(status_code=400, detail="No courses provided")
        
        # Get both types of recommendations
        cert_recommendations = recommendation_engine.find_similar_certifications(
            request.courses, 
            request.user_profile
        )
        
        project_recommendations = recommendation_engine.find_project_recommendations(
            request.courses, 
            request.user_profile
        )
        
        # Format certifications
        formatted_certs = []
        for rec in cert_recommendations[:5]:  # Top 5 certifications
            cert = rec['certification']
            formatted_certs.append({
                'id': cert['id'],
                'name': cert['name'],
                'provider': cert['provider'],
                'description': cert['description'],
                'skills': cert['skills'],
                'difficulty': cert['difficulty'],
                'duration_hours': cert['duration_hours'],
                'cost': cert['cost'],
                'url': cert['url'],
                'similarity_score': round(rec['similarity_score'], 3),
                'type': 'certification'
            })
        
        # Format projects
        formatted_projects = []
        for rec in project_recommendations[:3]:  # Top 3 projects
            project = rec['project']
            formatted_projects.append({
                'id': project['id'],
                'name': project['name'],
                'description': project['description'],
                'skills': project['skills'],
                'difficulty': project['difficulty'],
                'estimated_hours': project['estimated_hours'],
                'technologies': project['technologies'],
                'similarity_score': round(rec['similarity_score'], 3),
                'type': 'project'
            })
        
        return JSONResponse(content={
            "success": True,
            "certifications": formatted_certs,
            "projects": formatted_projects,
            "user_courses": request.courses,
            "total_items": len(formatted_certs) + len(formatted_projects)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Combined recommendation generation failed: {str(e)}")

@router.post("/feedback")
async def submit_recommendation_feedback(
    request: FeedbackRequest,
    db: Session = Depends(get_db)
):
    """Submit user feedback on recommendations for model improvement"""
    
    try:
        # Update recommendation engine with feedback
        recommendation_engine.update_user_feedback(
            request.user_id,
            request.item_id,
            request.feedback
        )
        
        # Save feedback to MongoDB
        feedback_doc = {
            "userId": request.user_id,
            "itemId": request.item_id,
            "feedback": request.feedback,
            "timestamp": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
        }
        
        await mongo_db.recommendation_feedback.insert_one(feedback_doc)
        
        return JSONResponse(content={
            "success": True,
            "message": "Feedback recorded successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback submission failed: {str(e)}")

@router.get("/user-history/{user_id}")
async def get_user_recommendation_history(
    user_id: str,
    limit: int = 50
):
    """Get user's recommendation history"""
    
    try:
        # Fetch from MongoDB
        history = await mongo_db.user_recommendations.find(
            {"userId": user_id}
        ).sort("timestamp", -1).limit(limit).to_list(length=limit)
        
        return JSONResponse(content={
            "success": True,
            "history": history,
            "total_items": len(history)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recommendation history: {str(e)}")

def generate_match_reasons(item: Dict[str, Any], courses: List[str]) -> List[str]:
    """Generate human-readable reasons for why an item was recommended"""
    reasons = []
    
    item_skills = set(skill.lower() for skill in item.get('skills', []))
    course_keywords = set()
    
    for course in courses:
        course_keywords.update(course.lower().split())
    
    # Check for direct skill matches
    skill_matches = []
    for skill in item_skills:
        if any(keyword in skill for keyword in course_keywords):
            skill_matches.append(skill)
    
    if skill_matches:
        reasons.append(f"Matches your skills in: {', '.join(skill_matches[:3])}")
    
    # Check difficulty appropriateness
    difficulty = item.get('difficulty', 'intermediate')
    if difficulty == 'beginner':
        reasons.append("Great for building foundational knowledge")
    elif difficulty == 'intermediate':
        reasons.append("Perfect for expanding your current skills")
    elif difficulty == 'advanced':
        reasons.append("Excellent for advanced skill development")
    
    # Check for popular/recommended items
    if item.get('cost') == 'free':
        reasons.append("Free certification - great value!")
    
    return reasons[:3]  # Return top 3 reasons

async def save_recommendations(user_id: str, recommendation_type: str, recommendations: List[Dict]):
    """Save recommendations to MongoDB for tracking and analytics"""
    try:
        doc = {
            "userId": user_id,
            "type": recommendation_type,
            "recommendations": recommendations,
            "timestamp": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}},
            "viewed": False
        }
        
        await mongo_db.user_recommendations.insert_one(doc)
        
    except Exception as e:
        print(f"Error saving recommendations: {str(e)}")
        # Don't raise exception to avoid breaking main flow
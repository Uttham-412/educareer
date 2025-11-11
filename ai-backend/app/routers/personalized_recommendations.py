from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.services.opportunity_scraper import opportunity_scraper
from typing import Dict, Any, List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class RecommendationRequest(BaseModel):
    user_id: str
    include_courses: bool = True
    include_jobs: bool = True
    limit: int = 10

@router.post("/personalized")
async def get_personalized_recommendations(request: RecommendationRequest):
    """
    Get personalized course and job recommendations based on:
    - User profile (skills, experience, occupation)
    - Uploaded timetable courses
    - AI-powered matching
    """
    
    try:
        # For now, use default profile (can be enhanced with MongoDB later)
        user_profile = {
            'skills': ['Python', 'JavaScript', 'React'],
            'experienceLevel': 'intermediate',
            'occupation': 'Student',
            'location': 'United States'
        }
        
        # Default timetable courses
        timetable_courses = ['Data Structures', 'Web Development', 'Machine Learning']
        
        # Get personalized recommendations
        recommendations = opportunity_scraper.get_personalized_recommendations(
            user_profile=user_profile,
            timetable_courses=timetable_courses
        )
        
        # Filter based on request
        result = {}
        if request.include_courses:
            result['courses'] = recommendations['courses'][:request.limit]
        if request.include_jobs:
            result['jobs'] = recommendations['jobs'][:request.limit]
        
        result['user_keywords'] = opportunity_scraper._extract_keywords(user_profile, timetable_courses)
        result['total_recommendations'] = len(result.get('courses', [])) + len(result.get('jobs', []))
        
        return JSONResponse(content={
            "success": True,
            "data": result,
            "message": f"Found {result['total_recommendations']} personalized recommendations"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

@router.get("/trending")
async def get_trending_opportunities():
    """Get trending courses and jobs (no personalization)"""
    
    try:
        # Get popular courses from all platforms
        coursera = opportunity_scraper.get_coursera_courses(['programming', 'data science'])
        udemy = opportunity_scraper.get_udemy_courses(['web development'])
        jobs = opportunity_scraper.get_linkedin_jobs(['software engineer', 'data scientist'])
        
        return JSONResponse(content={
            "success": True,
            "data": {
                "courses": (coursera + udemy)[:10],
                "jobs": jobs[:10]
            }
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending opportunities: {str(e)}")

@router.get("/by-skill/{skill}")
async def get_recommendations_by_skill(skill: str):
    """Get recommendations for a specific skill"""
    
    try:
        courses = opportunity_scraper.get_coursera_courses([skill])
        courses.extend(opportunity_scraper.get_udemy_courses([skill]))
        jobs = opportunity_scraper.get_linkedin_jobs([skill])
        
        return JSONResponse(content={
            "success": True,
            "data": {
                "skill": skill,
                "courses": courses[:10],
                "jobs": jobs[:5]
            }
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

@router.post("/feedback")
async def submit_recommendation_feedback(feedback_data: Dict[str, Any]):
    """Track user interaction with recommendations"""
    
    try:
        # For now, just log the feedback
        print(f"Feedback received: {feedback_data}")
        
        return JSONResponse(content={
            "success": True,
            "message": "Feedback recorded"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record feedback: {str(e)}")

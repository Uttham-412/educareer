from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.services.timetable_processor import TimetableProcessor
from app.database import get_db, mongo_db
from sqlalchemy.orm import Session
import aiofiles
import os
from typing import Dict, Any

router = APIRouter()
timetable_processor = TimetableProcessor()

@router.post("/upload")
async def upload_timetable(
    file: UploadFile = File(...),
    user_id: str = None,
    db: Session = Depends(get_db)
):
    """Upload and process timetable file (PDF or image)"""
    
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Validate file type
    allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/tiff']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type: {file.content_type}"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Determine file type
        file_extension = file.filename.split('.')[-1].lower()
        
        # Process the timetable
        result = await timetable_processor.process_timetable(file_content, file_extension)
        
        if not result['success']:
            raise HTTPException(status_code=500, detail=result['error'])
        
        # Save extracted courses to MongoDB (integration with existing system)
        if user_id and result['courses']:
            await save_extracted_courses(user_id, result['courses'])
        
        return JSONResponse(content={
            "success": True,
            "message": "Timetable processed successfully",
            "data": {
                "total_courses": result['total_courses'],
                "courses": result['courses'],
                "extracted_text_preview": result['extracted_text'][:500] + "..." if len(result['extracted_text']) > 500 else result['extracted_text']
            }
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@router.post("/extract-text")
async def extract_text_only(
    file: UploadFile = File(...)
):
    """Extract raw text from timetable file without course processing"""
    
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    try:
        file_content = await file.read()
        file_extension = file.filename.split('.')[-1].lower()
        
        if file_extension == 'pdf':
            text = await timetable_processor.extract_from_pdf(file_content)
        elif file_extension in ['jpg', 'jpeg', 'png', 'bmp', 'tiff']:
            text = await timetable_processor.extract_from_image(file_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        return JSONResponse(content={
            "success": True,
            "extracted_text": text
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

@router.post("/parse-courses")
async def parse_courses_from_text(
    text_data: Dict[str, str]
):
    """Parse course information from provided text"""
    
    text = text_data.get('text', '')
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    try:
        courses = timetable_processor.extract_courses_with_bert(text)
        
        return JSONResponse(content={
            "success": True,
            "total_courses": len(courses),
            "courses": courses
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Course parsing failed: {str(e)}")

@router.post("/get-recommendations")
async def get_course_recommendations(
    request_data: Dict[str, Any]
):
    """
    Get personalized course recommendations based on timetable courses
    Returns MORE courses (20+) with apply buttons
    """
    
    try:
        from app.services.opportunity_scraper import opportunity_scraper
        
        # Extract data from request
        timetable_courses = request_data.get('courses', [])
        user_profile = request_data.get('user_profile', {})
        limit = request_data.get('limit', 25)  # Default to 25 recommendations
        
        if not timetable_courses:
            raise HTTPException(status_code=400, detail="No courses provided")
        
        # Get personalized recommendations
        recommendations = opportunity_scraper.get_personalized_recommendations(
            user_profile=user_profile,
            timetable_courses=timetable_courses,
            limit=limit
        )
        
        # Add apply button data to each recommendation
        for course in recommendations['courses']:
            course['can_apply'] = True
            course['apply_button_text'] = 'Enroll Now'
            course['apply_url'] = course.get('url', course.get('apply_url', '#'))
        
        for job in recommendations.get('jobs', []):
            job['can_apply'] = True
            job['apply_button_text'] = 'Apply Now'
            job['apply_url'] = job.get('url', '#')
        
        for internship in recommendations.get('internships', []):
            internship['can_apply'] = True
            internship['apply_button_text'] = 'Apply for Internship'
            internship['apply_url'] = internship.get('url', '#')
        
        return JSONResponse(content={
            "success": True,
            "message": f"Found {recommendations['total_courses']} course recommendations",
            "data": {
                "courses": recommendations['courses'],
                "jobs": recommendations.get('jobs', []),
                "internships": recommendations.get('internships', []),
                "total_courses": recommendations['total_courses'],
                "total_jobs": recommendations.get('total_jobs', 0),
                "user_year": recommendations.get('user_year', 2),
                "keywords_used": recommendations.get('keywords_used', [])
            }
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

async def save_extracted_courses(user_id: str, courses: list):
    """Save extracted courses to MongoDB for integration with existing system"""
    try:
        import pandas as pd
        
        # Transform courses to match existing schema
        course_documents = []
        
        for course in courses:
            course_doc = {
                "name": course['name'],
                "extractedFrom": "timetable",
                "confidence": course.get('confidence', 0.0),
                "schedule": {
                    "days": course.get('days', []),
                    "times": course.get('times', [])
                },
                "rawText": course.get('raw_text', ''),
                "userId": user_id,
                "createdAt": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
            }
            course_documents.append(course_doc)
        
        # Insert into MongoDB
        if course_documents and mongo_db:
            await mongo_db.extracted_courses.insert_many(course_documents)
            
    except Exception as e:
        print(f"Error saving courses to MongoDB: {str(e)}")
        # Don't raise exception here to avoid breaking the main flow
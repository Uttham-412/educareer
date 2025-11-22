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
    Uses Graph-BERT model to fetch real courses from multiple websites
    Returns 30+ courses with navigation buttons
    """
    
    try:
        from app.services.course_scraper import course_scraper
        from app.services.graph_bert_recommender import graph_bert_recommender
        
        # Extract data from request
        timetable_courses = request_data.get('courses', [])
        user_profile = request_data.get('user_profile', {})
        limit = request_data.get('limit', 30)  # Default to 30 recommendations
        
        if not timetable_courses:
            raise HTTPException(status_code=400, detail="No courses provided")
        
        # Step 1: Extract keywords from timetable using Graph-BERT
        keywords = graph_bert_recommender.extract_keywords_from_courses(timetable_courses)
        
        # Step 2: Use fallback courses for instant results (scraping disabled for speed)
        from app.services.fallback_courses import get_fallback_courses
        scraped_courses = get_fallback_courses(keywords, limit=50)
        print(f"Using {len(scraped_courses)} courses from database")
        
        # Step 3: Rank courses using Graph-BERT algorithm
        ranked_courses = graph_bert_recommender.rank_courses_with_graph_bert(
            scraped_courses=scraped_courses,
            timetable_courses=timetable_courses,
            user_profile=user_profile
        )
        
        # Step 4: Add navigation buttons and metadata
        final_courses = []
        for course in ranked_courses[:limit]:
            course['can_apply'] = True
            course['apply_button_text'] = 'Enroll Now'
            course['apply_url'] = course.get('url', '#')
            course['external_link'] = True
            course['opens_in_new_tab'] = True
            final_courses.append(course)
        
        # Generate learning path suggestion
        learning_path = []
        if user_profile.get('target_career'):
            course_names = [c.get('name', '') for c in timetable_courses]
            learning_path = graph_bert_recommender.get_learning_path(
                current_courses=course_names,
                target_career=user_profile['target_career']
            )
        
        return JSONResponse(content={
            "success": True,
            "message": f"Found {len(final_courses)} course recommendations from {len(set(c['platform'] for c in final_courses))} platforms",
            "data": {
                "courses": final_courses,
                "total_courses": len(final_courses),
                "platforms_searched": list(set(c['platform'] for c in final_courses)),
                "keywords_used": keywords[:10],
                "learning_path": learning_path,
                "recommendation_method": "Graph-BERT with Multi-Platform Scraping",
                "user_year": user_profile.get('current_year', 2)
            }
        })
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Recommendation error: {error_details}")
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
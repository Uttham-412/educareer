from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse, JSONResponse
from app.services.resume_generator import ResumeGenerator
from app.database import get_db, mongo_db
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel
import os
import tempfile

router = APIRouter()
resume_generator = ResumeGenerator()

class ResumeRequest(BaseModel):
    user_id: str
    template: str = "modern"
    sections: List[str] = ["personal", "education", "experience", "skills", "projects", "certifications"]
    custom_data: Dict[str, Any] = {}

class ResumeUpdateRequest(BaseModel):
    user_id: str
    section: str
    data: Dict[str, Any]

@router.post("/generate")
async def generate_resume(
    request: ResumeRequest,
    db: Session = Depends(get_db)
):
    """Generate AI-powered resume from user profile and portfolio"""
    
    try:
        # Get user profile and portfolio data
        user_data = await collect_user_data(request.user_id)
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Merge custom data
        user_data.update(request.custom_data)
        
        # Generate resume
        resume_path = await resume_generator.generate_resume(
            user_data=user_data,
            template=request.template,
            sections=request.sections,
            user_id=request.user_id
        )
        
        # Save resume metadata to MongoDB
        await save_resume_metadata(request.user_id, request.template, resume_path)
        
        return FileResponse(
            path=resume_path,
            filename=f"resume_{request.user_id}_{request.template}.pdf",
            media_type="application/pdf"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume generation failed: {str(e)}")

@router.post("/preview")
async def preview_resume(
    request: ResumeRequest,
    db: Session = Depends(get_db)
):
    """Generate resume preview (HTML) without creating PDF"""
    
    try:
        # Get user data
        user_data = await collect_user_data(request.user_id)
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Merge custom data
        user_data.update(request.custom_data)
        
        # Generate HTML preview
        html_content = await resume_generator.generate_html_preview(
            user_data=user_data,
            template=request.template,
            sections=request.sections
        )
        
        return JSONResponse(content={
            "success": True,
            "html_content": html_content,
            "template": request.template
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume preview failed: {str(e)}")

@router.get("/templates")
async def get_resume_templates():
    """Get available resume templates"""
    
    templates = resume_generator.get_available_templates()
    
    return JSONResponse(content={
        "success": True,
        "templates": templates
    })

@router.post("/optimize")
async def optimize_resume_content(
    request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """AI-powered resume content optimization"""
    
    try:
        user_id = request.get('user_id')
        job_description = request.get('job_description', '')
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        
        # Get user data
        user_data = await collect_user_data(user_id)
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Optimize resume content
        optimized_content = await resume_generator.optimize_for_job(
            user_data=user_data,
            job_description=job_description
        )
        
        return JSONResponse(content={
            "success": True,
            "optimized_content": optimized_content,
            "optimization_tips": optimized_content.get('tips', [])
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume optimization failed: {str(e)}")

@router.get("/history/{user_id}")
async def get_resume_history(user_id: str):
    """Get user's resume generation history"""
    
    try:
        history = await mongo_db.resume_history.find(
            {"userId": user_id}
        ).sort("createdAt", -1).limit(20).to_list(length=20)
        
        # Remove MongoDB _id fields
        for item in history:
            item.pop('_id', None)
        
        return JSONResponse(content={
            "success": True,
            "history": history,
            "total_resumes": len(history)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch resume history: {str(e)}")

@router.post("/analyze")
async def analyze_resume_content(
    request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Analyze resume content and provide improvement suggestions"""
    
    try:
        user_id = request.get('user_id')
        resume_text = request.get('resume_text', '')
        
        if not user_id or not resume_text:
            raise HTTPException(status_code=400, detail="User ID and resume text are required")
        
        # Analyze resume
        analysis = await resume_generator.analyze_resume(resume_text)
        
        # Save analysis to MongoDB
        analysis_doc = {
            "userId": user_id,
            "analysis": analysis,
            "resumeText": resume_text[:1000],  # Store first 1000 chars for reference
            "createdAt": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
        }
        
        await mongo_db.resume_analyses.insert_one(analysis_doc)
        
        return JSONResponse(content={
            "success": True,
            "analysis": analysis
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

@router.post("/update-section")
async def update_resume_section(
    request: ResumeUpdateRequest,
    db: Session = Depends(get_db)
):
    """Update specific section of user's resume data"""
    
    try:
        # Update user profile with new section data
        update_path = f"resumeData.{request.section}"
        
        await mongo_db.user_profiles.update_one(
            {"userId": request.user_id},
            {
                "$set": {
                    update_path: request.data,
                    "updatedAt": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}}
                }
            }
        )
        
        return JSONResponse(content={
            "success": True,
            "message": f"Resume section '{request.section}' updated successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update resume section: {str(e)}")

@router.delete("/delete/{user_id}/{resume_id}")
async def delete_resume(user_id: str, resume_id: str):
    """Delete a specific resume from history"""
    
    try:
        # Remove from database
        result = await mongo_db.resume_history.delete_one({
            "userId": user_id,
            "resumeId": resume_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Try to delete physical file
        try:
            resume_doc = await mongo_db.resume_history.find_one({
                "userId": user_id,
                "resumeId": resume_id
            })
            
            if resume_doc and resume_doc.get('filePath'):
                if os.path.exists(resume_doc['filePath']):
                    os.remove(resume_doc['filePath'])
        except:
            pass  # Don't fail if file deletion fails
        
        return JSONResponse(content={
            "success": True,
            "message": "Resume deleted successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete resume: {str(e)}")

async def collect_user_data(user_id: str) -> Dict[str, Any]:
    """Collect all user data needed for resume generation"""
    
    try:
        # Get user profile
        profile = await mongo_db.user_profiles.find_one({"userId": user_id})
        
        if not profile:
            return None
        
        # Get portfolio
        portfolio = await mongo_db.user_portfolios.find_one({"userId": user_id})
        
        # Get extracted courses
        courses = await mongo_db.extracted_courses.find(
            {"userId": user_id}
        ).to_list(length=100)
        
        # Combine all data
        user_data = {
            "profile": profile,
            "portfolio": portfolio.get('items', []) if portfolio else [],
            "courses": courses,
            "personal_info": profile.get('personalInfo', {}),
            "academic_info": profile.get('academicInfo', {}),
            "skills": profile.get('skills', []),
            "experience_level": profile.get('experienceLevel', 'beginner'),
            "career_goals": profile.get('careerGoals', [])
        }
        
        return user_data
        
    except Exception as e:
        print(f"Error collecting user data: {str(e)}")
        return None

async def save_resume_metadata(user_id: str, template: str, file_path: str):
    """Save resume generation metadata to MongoDB"""
    
    try:
        import uuid
        resume_id = str(uuid.uuid4())
        
        metadata = {
            "userId": user_id,
            "resumeId": resume_id,
            "template": template,
            "filePath": file_path,
            "fileName": os.path.basename(file_path),
            "createdAt": {"$date": {"$numberLong": str(int(pd.Timestamp.now().timestamp() * 1000))}},
            "fileSize": os.path.getsize(file_path) if os.path.exists(file_path) else 0
        }
        
        await mongo_db.resume_history.insert_one(metadata)
        
    except Exception as e:
        print(f"Error saving resume metadata: {str(e)}")
        # Don't raise exception to avoid breaking main flow
"""
Job Opportunities Service
Manages job listings with filtering and search capabilities
"""

from typing import List, Dict, Optional
from datetime import datetime, timedelta
import random

class JobOpportunitiesService:
    """Service for managing job opportunities with filtering"""
    
    def __init__(self):
        self.jobs_database = self._initialize_jobs_database()
    
    def _initialize_jobs_database(self) -> List[Dict]:
        """Initialize with sample job opportunities"""
        return [
            # Software Engineering Jobs
            {
                "id": "job_001",
                "title": "Full Stack Developer",
                "company": "TechCorp Solutions",
                "location": "Bangalore, India",
                "type": "Full-time",
                "experience_level": "Entry Level",
                "salary_min": 600000,
                "salary_max": 900000,
                "salary_currency": "INR",
                "description": "Join our dynamic team to build scalable web applications using React, Node.js, and MongoDB.",
                "requirements": ["React", "Node.js", "MongoDB", "JavaScript", "REST APIs"],
                "posted_date": (datetime.now() - timedelta(days=2)).isoformat(),
                "deadline": (datetime.now() + timedelta(days=28)).isoformat(),
                "remote": False,
                "category": "Software Engineering",
                "logo": "https://ui-avatars.com/api/?name=TechCorp&background=4F46E5&color=fff"
            },
            {
                "id": "job_002",
                "title": "Frontend Developer",
                "company": "Digital Innovations",
                "location": "Mumbai, India",
                "type": "Full-time",
                "experience_level": "Mid Level",
                "salary_min": 800000,
                "salary_max": 1200000,
                "salary_currency": "INR",
                "description": "Create stunning user interfaces with React, TypeScript, and modern CSS frameworks.",
                "requirements": ["React", "TypeScript", "CSS", "HTML", "Responsive Design"],
                "posted_date": (datetime.now() - timedelta(days=5)).isoformat(),
                "deadline": (datetime.now() + timedelta(days=25)).isoformat(),
                "remote": True,
                "category": "Software Engineering",
                "logo": "https://ui-avatars.com/api/?name=Digital+Innovations&background=10B981&color=fff"
            },
            {
                "id": "job_003",
                "title": "Backend Developer",
                "company": "CloudTech Systems",
                "location": "Hyderabad, India",
                "type": "Full-time",
                "experience_level": "Entry Level",
                "salary_min": 700000,
                "salary_max": 1000000,
                "salary_currency": "INR",
                "description": "Build robust backend systems using Python, FastAPI, and PostgreSQL.",
                "requirements": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
                "posted_date": (datetime.now() - timedelta(days=1)).isoformat(),
                "deadline": (datetime.now() + timedelta(days=29)).isoformat(),
                "remote": False,
                "category": "Software Engineering",
                "logo": "https://ui-avatars.com/api/?name=CloudTech&background=F59E0B&color=fff"
            },
            
            # Data Science Jobs
            {
                "id": "job_004",
                "title": "Data Scientist",
                "company": "Analytics Pro",
                "location": "Pune, India",
                "type": "Full-time",
                "experience_level": "Mid Level",
                "salary_min": 1000000,
                "salary_max": 1500000,
                "salary_currency": "INR",
                "description": "Analyze complex datasets and build ML models to drive business insights.",
                "requirements": ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"],
                "posted_date": (datetime.now() - timedelta(days=3)).isoformat(),
                "deadline": (datetime.now() + timedelta(days=27)).isoformat(),
                "remote": True,
                "category": "Data Science",
                "logo": "https://ui-avatars.com/api/?name=Analytics+Pro&background=8B5CF6&color=fff"
            },
            {
                "id": "job_005",
                "title": "Machine Learning Engineer",
                "company": "AI Innovations",
                "location": "Bangalore, India",
                "type": "Full-time",
                "experience_level": "Senior Level",
                "salary_min": 1500000,
                "salary_max": 2500000,
                "salary_currency": "INR",
                "description": "Design and deploy ML models at scale using cutting-edge technologies.",
                "requirements": ["Python", "PyTorch", "Kubernetes", "MLOps", "Deep Learning"],
                "posted_date": (datetime.now() - timedelta(days=4)).isoformat(),
                "deadline": (datetime.now() + timedelta(days=26)).isoformat(),
                "remote": False,
                "category": "Data Science",
                "logo": "https://ui-avatars.com/api/?name=AI+Innovations&background=EC4899&color=fff"
            },
            
            # Internships
            {
                "id": "job_006",
                "title": "Software Development Intern",
                "company": "StartupHub",
                "location": "Remote",
                "type": "Internship",
                "experience_level": "Internship",
                "salary_min": 15000,
                "salary_max": 25000,
                "salary_currency": "INR",
                "description": "6-month internship program for aspiring developers. Learn and build real products.",
                "requirements": ["JavaScript", "React", "Git", "Problem Solving"],
                "posted_date": (datetime.now() - timedelta(days=7)).isoformat(),
                "deadline": (datetime.now() + timedelta(days=23)).isoformat(),
                "remote": True,
                "category": "Software Engineering",
                "logo": "https://ui-avatars.com/api/?name=StartupHub&background=06B6D4&color=fff"
            },
            {
                "id": "job_007",
                "title": "Data Analytics Intern",
                "company": "DataViz Corp",
                "location": "Delhi, India",
                "type": "Internship",
                "experience_level": "Internship",
                "salary_min": 12000,
                "salary_max": 20000,
                "salary_currency": "INR",
                "description": "Work with real datasets and create insightful visualizations.",
                "requirements": ["Python", "Pandas", "Excel", "SQL", "Tableau"],
                "posted_date": (datetime.now() - timedelta(days=6)).isoformat(),
                "deadline": (datetime.now() + timedelta(days=24)).isoformat(),
                "remote": False,
                "category": "Data Science",
                "logo": "https://ui-avatars.com/api/?name=DataViz&background=14B8A6&color=fff"
            },
        ]
    
    def get_all_jobs(
        self,
        location: Optional[str] = None,
        salary_min: Optional[int] = None,
        salary_max: Optional[int] = None,
        company: Optional[str] = None,
        job_type: Optional[str] = None,
        experience_level: Optional[str] = None,
        category: Optional[str] = None,
        remote: Optional[bool] = None,
        search: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Dict:
        """Get all jobs with optional filtering"""
        
        filtered_jobs = self.jobs_database.copy()
        
        # Apply filters
        if location:
            filtered_jobs = [
                job for job in filtered_jobs 
                if location.lower() in job["location"].lower()
            ]
        
        if salary_min is not None:
            filtered_jobs = [
                job for job in filtered_jobs 
                if job["salary_max"] >= salary_min
            ]
        
        if salary_max is not None:
            filtered_jobs = [
                job for job in filtered_jobs 
                if job["salary_min"] <= salary_max
            ]
        
        if company:
            filtered_jobs = [
                job for job in filtered_jobs 
                if company.lower() in job["company"].lower()
            ]
        
        if job_type:
            filtered_jobs = [
                job for job in filtered_jobs 
                if job["type"].lower() == job_type.lower()
            ]
        
        if experience_level:
            filtered_jobs = [
                job for job in filtered_jobs 
                if job["experience_level"].lower() == experience_level.lower()
            ]
        
        if category:
            filtered_jobs = [
                job for job in filtered_jobs 
                if job["category"].lower() == category.lower()
            ]
        
        if remote is not None:
            filtered_jobs = [
                job for job in filtered_jobs 
                if job["remote"] == remote
            ]
        
        if search:
            search_lower = search.lower()
            filtered_jobs = [
                job for job in filtered_jobs 
                if (search_lower in job["title"].lower() or
                    search_lower in job["company"].lower() or
                    search_lower in job["description"].lower() or
                    any(search_lower in req.lower() for req in job["requirements"]))
            ]
        
        # Sort by posted date (newest first)
        filtered_jobs.sort(key=lambda x: x["posted_date"], reverse=True)
        
        # Pagination
        total = len(filtered_jobs)
        paginated_jobs = filtered_jobs[offset:offset + limit]
        
        return {
            "jobs": paginated_jobs,
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": (offset + limit) < total
        }
    
    def get_job_by_id(self, job_id: str) -> Optional[Dict]:
        """Get a specific job by ID"""
        for job in self.jobs_database:
            if job["id"] == job_id:
                return job
        return None
    
    def get_filter_options(self) -> Dict:
        """Get all available filter options"""
        locations = list(set(job["location"] for job in self.jobs_database))
        companies = list(set(job["company"] for job in self.jobs_database))
        job_types = list(set(job["type"] for job in self.jobs_database))
        experience_levels = list(set(job["experience_level"] for job in self.jobs_database))
        categories = list(set(job["category"] for job in self.jobs_database))
        
        # Get salary range
        salaries = [job["salary_min"] for job in self.jobs_database] + [job["salary_max"] for job in self.jobs_database]
        
        return {
            "locations": sorted(locations),
            "companies": sorted(companies),
            "job_types": sorted(job_types),
            "experience_levels": sorted(experience_levels),
            "categories": sorted(categories),
            "salary_range": {
                "min": min(salaries),
                "max": max(salaries)
            }
        }
    
    def apply_to_job(self, job_id: str, user_id: str, application_data: Dict) -> Dict:
        """Submit a job application"""
        job = self.get_job_by_id(job_id)
        
        if not job:
            return {
                "success": False,
                "message": "Job not found"
            }
        
        # In a real system, this would save to database
        application = {
            "application_id": f"app_{random.randint(10000, 99999)}",
            "job_id": job_id,
            "user_id": user_id,
            "job_title": job["title"],
            "company": job["company"],
            "applied_date": datetime.now().isoformat(),
            "status": "submitted",
            **application_data
        }
        
        return {
            "success": True,
            "message": f"Successfully applied to {job['title']} at {job['company']}",
            "application": application
        }

# Global instance
job_service = JobOpportunitiesService()

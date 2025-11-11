from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Import routers
from app.routers import personalized_recommendations

# Load environment variables
load_dotenv()

app = FastAPI(
    title="EduCareer AI Backend",
    description="AI-powered education and career recommendation system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    personalized_recommendations.router,
    prefix="/api/v1/recommendations",
    tags=["Personalized Recommendations"]
)

@app.get("/")
async def root():
    return {
        "message": "EduCareer AI Backend is running!",
        "status": "healthy",
        "version": "1.0.0",
        "features": [
            "Personalized Recommendations",
            "Web Scraping",
            "AI Matching"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Basic test endpoint
@app.get("/test")
async def test_endpoint():
    return {
        "message": "Test endpoint working",
        "mongodb_uri": os.getenv("MONGODB_URI", "Not configured"),
        "environment": "development"
    }

if __name__ == "__main__":
    print("🚀 Starting EduCareer AI Backend...")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔗 Health Check: http://localhost:8000/health")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
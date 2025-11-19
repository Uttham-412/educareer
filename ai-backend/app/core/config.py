from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/educareer_ai")
    
    # MongoDB (for integration with existing system)
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/edu-career-ai")
    
    # AI Models
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"
    BERT_MODEL: str = "distilbert-base-uncased"
    
    # File Storage
    UPLOAD_DIR: str = "uploads"
    RESUME_OUTPUT_DIR: str = "resumes"
    
    # Notifications
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    EMAIL_USER: str = os.getenv("EMAIL_USER", "")
    EMAIL_PASSWORD: str = os.getenv("EMAIL_PASSWORD", "")
    
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")
    TWILIO_WHATSAPP_NUMBER: str = os.getenv("TWILIO_WHATSAPP_NUMBER", "")
    
    # Redis for Celery
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # API Keys
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    
    class Config:
        env_file = ".env"

settings = Settings()
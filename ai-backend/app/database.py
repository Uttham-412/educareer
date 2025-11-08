from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# PostgreSQL Database (optional)
try:
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    print(f"PostgreSQL connection failed: {e}")
    engine = None
    SessionLocal = None
    Base = None

def get_db():
    if SessionLocal:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    else:
        yield None

# MongoDB connection (primary database)
import motor.motor_asyncio

try:
    mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
    mongo_db = mongo_client.get_database("edu-career-ai")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    mongo_client = None
    mongo_db = None
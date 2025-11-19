# 🐍 Python Code Overview - EduCareer AI Backend

## 📁 Project Structure

```
educareer/
├── ai-backend/                    # AI/ML Backend (FastAPI)
│   ├── main.py                   # Main application entry point
│   ├── celery_worker.py          # Background task worker
│   ├── setup.py                  # Package setup
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py           # MongoDB connection
│   │   ├── core/
│   │   │   └── config.py         # Configuration settings
│   │   ├── data/
│   │   │   └── real_opportunities.py  # Sample data
│   │   ├── routers/              # API endpoints
│   │   │   ├── notifications.py
│   │   │   ├── personalized_recommendations.py
│   │   │   ├── portfolio_verification.py
│   │   │   ├── recommendations.py
│   │   │   ├── resume_builder.py
│   │   │   ├── timetable_extraction.py
│   │   │   └── user_profiling.py
│   │   └── services/             # Business logic
│   │       ├── notification_service.py
│   │       ├── opportunity_scraper.py
│   │       ├── recommendation_engine.py
│   │       ├── resume_generator.py
│   │       └── timetable_processor.py
├── test-twilio.py                # Twilio SMS/WhatsApp testing
└── test-sms.py                   # SMS testing script
```

---

## 🚀 Main Application Files

### 1. **main.py** - Application Entry Point
**Location**: `ai-backend/main.py`

**Purpose**: Main FastAPI application that starts the AI backend server

**What it does**:
- Creates FastAPI app instance
- Sets up CORS middleware for frontend communication
- Registers all API routers (endpoints)
- Starts Uvicorn server on port 8000
- Provides health check endpoint

**Key Features**:
- API Documentation at `/docs`
- Health check at `/health`
- Runs on `http://localhost:8000`

**Routes Included**:
- `/api/v1/recommendations` - Personalized recommendations
- `/api/v1/timetable` - Timetable processing
- `/api/v1/notifications` - Notification system

---

### 2. **celery_worker.py** - Background Task Worker
**Location**: `ai-backend/celery_worker.py`

**Purpose**: Handles asynchronous background tasks

**What it does**:
- Processes long-running tasks in background
- Handles email/SMS sending
- Processes large file uploads
- Generates recommendations asynchronously

**Use Cases**:
- Sending bulk notifications
- Processing timetable images with OCR
- Generating AI recommendations
- Web scraping for job opportunities

---

### 3. **setup.py** - Package Configuration
**Location**: `ai-backend/setup.py`

**Purpose**: Python package setup and installation configuration

**What it does**:
- Defines package metadata
- Lists dependencies
- Configures installation

---

## 🔧 Core Configuration

### 4. **app/core/config.py** - Settings & Configuration
**Location**: `ai-backend/app/core/config.py`

**Purpose**: Centralized configuration management

**What it does**:
- Loads environment variables from `.env`
- Defines database connection strings
- Stores API keys (Twilio, GitHub, etc.)
- Configures AI model settings
- Sets up file storage paths

**Key Settings**:
```python
- MONGODB_URI: Database connection
- SMTP settings: Email configuration
- TWILIO credentials: SMS/WhatsApp
- AI model names: BERT, Sentence Transformers
- File paths: Upload and resume directories
```

---

### 5. **app/database.py** - Database Connection
**Location**: `ai-backend/app/database.py`

**Purpose**: MongoDB connection and session management

**What it does**:
- Connects to MongoDB
- Provides database session
- Handles connection pooling
- Manages database operations

---

## 📊 Data Files

### 6. **app/data/real_opportunities.py** - Sample Data
**Location**: `ai-backend/app/data/real_opportunities.py`

**Purpose**: Contains real-world course and job opportunity data

**What it does**:
- Stores sample courses (Udemy, Coursera, etc.)
- Contains job listings
- Provides internship opportunities
- Used for recommendations when no user data exists

**Data Includes**:
- Course titles, providers, URLs
- Job titles, companies, locations
- Internship opportunities
- Certification programs

---

## 🛣️ API Routers (Endpoints)

### 7. **app/routers/personalized_recommendations.py**
**Purpose**: AI-powered personalized recommendations

**What it does**:
- Analyzes user profile and timetable
- Generates course recommendations
- Suggests job opportunities
- Matches based on skills and interests

**Endpoints**:
- `POST /api/v1/recommendations/personalized` - Get recommendations
- `POST /api/v1/recommendations/feedback` - Track user interactions

---

### 8. **app/routers/timetable_extraction.py**
**Purpose**: Extract courses from timetable files

**What it does**:
- Accepts PDF, CSV, or image uploads
- Uses OCR to extract text from images
- Uses NLP to identify course names
- Extracts professor names, rooms, times
- Returns structured timetable data

**Endpoints**:
- `POST /api/v1/timetable/upload` - Upload timetable file
- `POST /api/v1/timetable/extract-text` - Extract raw text
- `POST /api/v1/timetable/parse-courses` - Parse course info

**Technologies**:
- Tesseract OCR for images
- PyMuPDF for PDFs
- BERT for NLP
- Pattern matching for data extraction

---

### 9. **app/routers/notifications.py**
**Purpose**: Send notifications via multiple channels

**What it does**:
- Sends email notifications
- Sends SMS via Twilio
- Sends WhatsApp messages
- Supports multi-channel delivery

**Endpoints**:
- `POST /api/v1/notifications/send-multi` - Send to multiple channels
- `POST /api/v1/notifications/email` - Send email only
- `POST /api/v1/notifications/sms` - Send SMS only

---

### 10. **app/routers/resume_builder.py**
**Purpose**: Generate professional resumes

**What it does**:
- Creates resume from user profile
- Generates PDF resumes
- Supports multiple templates
- Includes skills, projects, certifications

**Endpoints**:
- `POST /api/v1/resume/generate` - Generate resume
- `GET /api/v1/resume/templates` - List templates

---

### 11. **app/routers/recommendations.py**
**Purpose**: General recommendation engine

**What it does**:
- Provides course recommendations
- Suggests certifications
- Recommends learning paths
- Based on user's current courses

---

### 12. **app/routers/portfolio_verification.py**
**Purpose**: Verify GitHub portfolios

**What it does**:
- Connects to GitHub API
- Analyzes user repositories
- Verifies project authenticity
- Extracts skills from code

---

### 13. **app/routers/user_profiling.py**
**Purpose**: Build and analyze user profiles

**What it does**:
- Creates user skill profiles
- Analyzes learning patterns
- Tracks progress
- Generates insights

---

## 🔨 Services (Business Logic)

### 14. **app/services/timetable_processor.py**
**Purpose**: Core timetable processing logic

**What it does**:
- **OCR Processing**: Extracts text from images using Tesseract
- **PDF Parsing**: Reads text from PDF files using PyMuPDF
- **NLP Analysis**: Uses BERT to identify course names
- **Pattern Matching**: Extracts professors, rooms, times
- **Data Structuring**: Converts raw text to structured data

**Key Functions**:
```python
- extract_from_pdf(): Extract text from PDF
- extract_from_image(): OCR on images
- extract_courses_with_bert(): NLP course extraction
- process_timetable(): Main processing function
```

**Technologies Used**:
- Tesseract OCR
- OpenCV (image preprocessing)
- PyMuPDF (PDF reading)
- Transformers (BERT model)
- Regular expressions (pattern matching)

---

### 15. **app/services/notification_service.py**
**Purpose**: Handle all notification delivery

**What it does**:
- **Email**: Sends via SMTP (Gmail, etc.)
- **SMS**: Sends via Twilio
- **WhatsApp**: Sends via Twilio WhatsApp API
- **Multi-channel**: Sends to multiple channels at once

**Key Functions**:
```python
- send_email_notification(): SMTP email
- send_sms_notification(): Twilio SMS
- send_whatsapp_notification(): WhatsApp
- send_multi_channel_notification(): All channels
```

**Features**:
- HTML email support
- Template formatting
- Error handling
- Delivery tracking

---

### 16. **app/services/opportunity_scraper.py**
**Purpose**: Scrape and collect job/course opportunities

**What it does**:
- Scrapes job boards (LinkedIn, Indeed, etc.)
- Collects course data (Udemy, Coursera)
- Finds internship opportunities
- Updates opportunity database

**Key Functions**:
```python
- scrape_jobs(): Collect job listings
- scrape_courses(): Collect courses
- get_personalized_recommendations(): Match to user
```

**Data Sources**:
- Job boards
- Course platforms
- Company career pages
- Internship portals

---

### 17. **app/services/recommendation_engine.py**
**Purpose**: AI-powered recommendation algorithm

**What it does**:
- **Content-Based Filtering**: Match based on course content
- **Collaborative Filtering**: Learn from similar users
- **Skill Matching**: Match jobs to user skills
- **Career Path Prediction**: Suggest next steps

**Key Functions**:
```python
- generate_recommendations(): Main algorithm
- calculate_similarity(): Match scoring
- rank_opportunities(): Sort by relevance
```

**AI Techniques**:
- Sentence embeddings
- Cosine similarity
- TF-IDF vectorization
- Neural networks

---

### 18. **app/services/resume_generator.py**
**Purpose**: Generate professional PDF resumes

**What it does**:
- Creates PDF resumes from user data
- Supports multiple templates
- Formats sections (education, experience, skills)
- Exports to PDF

**Key Functions**:
```python
- generate_resume(): Create resume
- format_section(): Format resume sections
- export_pdf(): Save as PDF
```

**Libraries Used**:
- ReportLab (PDF generation)
- Jinja2 (templating)

---

## 🧪 Testing Scripts

### 19. **test-twilio.py** - Twilio Testing
**Location**: `educareer/test-twilio.py`

**Purpose**: Test Twilio SMS and WhatsApp functionality

**What it does**:
- Verifies Twilio credentials
- Tests SMS sending
- Tests WhatsApp messaging
- Checks account balance
- Lists phone numbers

**How to use**:
```bash
cd educareer
python test-twilio.py
```

**Tests**:
1. Account verification
2. Phone number check
3. Balance check
4. Send test SMS
5. Send test WhatsApp

---

### 20. **test-sms.py** - SMS Testing
**Location**: `educareer/test-sms.py`

**Purpose**: Simple SMS testing script

**What it does**:
- Quick SMS test
- Validates phone numbers
- Tests Twilio connection

---

## 📦 Dependencies

### Main Libraries Used:

**Web Framework**:
- FastAPI - Modern web framework
- Uvicorn - ASGI server
- Pydantic - Data validation

**AI/ML**:
- Transformers - BERT models
- Sentence-Transformers - Text embeddings
- Scikit-learn - ML algorithms
- PyTorch - Deep learning

**OCR & Document Processing**:
- Tesseract - OCR engine
- OpenCV - Image processing
- PyMuPDF - PDF reading
- PDFMiner - PDF text extraction
- Pillow - Image manipulation

**Database**:
- Motor - Async MongoDB driver
- PyMongo - MongoDB client

**Notifications**:
- Twilio - SMS/WhatsApp
- SMTP - Email sending

**Utilities**:
- Python-dotenv - Environment variables
- Requests - HTTP client
- BeautifulSoup4 - Web scraping
- Pandas - Data manipulation

---

## 🎯 Key Features Powered by Python

### 1. **AI-Powered Recommendations**
- Analyzes user timetable
- Matches courses to interests
- Suggests career paths
- Personalized learning recommendations

### 2. **Timetable Processing**
- Upload PDF/Image/CSV
- OCR text extraction
- NLP course identification
- Automatic scheduling

### 3. **Notification System**
- Email notifications
- SMS alerts
- WhatsApp messages
- Multi-channel delivery

### 4. **Resume Generation**
- Professional PDF resumes
- Multiple templates
- Auto-formatting
- Export functionality

### 5. **Opportunity Matching**
- Job recommendations
- Course suggestions
- Internship matching
- Certification paths

---

## 🚀 How to Run Python Backend

### Start the AI Backend:
```bash
cd educareer/ai-backend
python main.py
```

**Runs on**: http://localhost:8000
**API Docs**: http://localhost:8000/docs

### Test Twilio:
```bash
cd educareer
python test-twilio.py
```

---

## 🔑 Environment Variables Required

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/educareer

# Email (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# AI Models
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2
BERT_MODEL=distilbert-base-uncased
```

---

## 📊 Summary

**Total Python Files**: 20+ files
**Main Purpose**: AI-powered backend for career recommendations
**Key Technologies**: FastAPI, BERT, OCR, Twilio, MongoDB

**Core Capabilities**:
1. ✅ Timetable extraction (PDF/Image/CSV)
2. ✅ AI recommendations (courses/jobs)
3. ✅ Notifications (Email/SMS/WhatsApp)
4. ✅ Resume generation (PDF)
5. ✅ Opportunity matching
6. ✅ User profiling

**All Python code works together to provide intelligent career guidance and automation for students!** 🎓

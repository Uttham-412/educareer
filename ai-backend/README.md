# EduCareer AI Backend

A comprehensive AI-powered backend system for education and career recommendations, built with FastAPI and modern AI/ML technologies.

## 🚀 Features

### 1. **Timetable Processing & Course Extraction**
- **PDF & Image Processing**: Extract text from PDFs using PyMuPDF and images using Tesseract OCR
- **AI-Powered Course Detection**: Use BERT/DistilBERT for intelligent course name and subject extraction
- **Structured Data Output**: Convert raw timetable text into structured course data with confidence scores

### 2. **AI Recommendation Engine**
- **Semantic Similarity**: Sentence Transformers for matching courses to certifications
- **Graph-Based Mapping**: NetworkX for linking courses, skills, and certifications
- **ML Ranking**: XGBoost for refining and re-ranking suggestions
- **Personalized Results**: Tailored recommendations based on user profile and experience level

### 3. **Portfolio Verification & Management**
- **Multi-Platform Verification**: GitHub, Coursera, edX, LinkedIn Learning, Credly, Badgr
- **Automated Link Validation**: HTTP status checks and API integrations
- **Confidence Scoring**: AI-powered verification confidence assessment
- **Digital Portfolio**: Automatically build and maintain user portfolios

### 4. **AI Resume Builder**
- **Template System**: Multiple professional resume templates
- **Content Optimization**: AI-powered content summarization using BART
- **Job Matching**: Optimize resumes for specific job descriptions
- **PDF Generation**: WeasyPrint for high-quality PDF output
- **Auto-Update**: Resumes automatically update with new achievements

### 5. **Smart Notification System**
- **Multi-Channel**: Email (SMTP), SMS, and WhatsApp (Twilio)
- **Personalized Messages**: AI-generated personalized notifications
- **Scheduling**: Background task scheduling with Celery + Redis
- **Digest System**: Daily/weekly learning digests

### 6. **User Profiling & Analytics**
- **Comprehensive Profiles**: Academic info, skills, interests, career goals
- **Skill Analysis**: AI-powered skill gap analysis and recommendations
- **Progress Tracking**: Monitor learning journey and achievements
- **Completeness Scoring**: Profile completeness with improvement suggestions

## 🛠 Technology Stack

### Core Framework
- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.8+**: Latest Python features and performance
- **Uvicorn**: ASGI server for production deployment

### AI & Machine Learning
- **🤗 Transformers**: BERT, DistilBERT for NLP tasks
- **Sentence Transformers**: Semantic similarity and embeddings
- **spaCy**: Advanced NLP processing
- **scikit-learn**: Traditional ML algorithms
- **XGBoost**: Gradient boosting for ranking
- **PyTorch**: Deep learning framework

### Document Processing
- **Tesseract OCR**: Optical character recognition
- **OpenCV**: Computer vision and image processing
- **PyMuPDF**: PDF text extraction
- **PDFMiner**: Alternative PDF processing
- **Pillow**: Image manipulation

### Database & Storage
- **MongoDB**: Primary database (async with Motor)
- **PostgreSQL**: Optional relational database
- **SQLAlchemy**: ORM for relational data
- **Redis**: Caching and task queue

### Resume Generation
- **Jinja2**: Template engine for HTML generation
- **WeasyPrint**: HTML to PDF conversion
- **ReportLab**: Alternative PDF generation

### Notifications
- **SMTP**: Email notifications
- **Twilio**: SMS and WhatsApp messaging
- **Celery**: Background task processing

## 📦 Installation

### Quick Setup

1. **Clone and navigate to the AI backend directory**:
```bash
cd edu-career-ai/edu-career-ai/ai-backend
```

2. **Run the setup script**:
```bash
python setup.py
```

3. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the server**:
```bash
# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Start the server
python main.py
```

### Manual Installation

1. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Download spaCy model**:
```bash
python -m spacy download en_core_web_sm
```

4. **Install Tesseract OCR**:
   - **Windows**: Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)
   - **Linux**: `sudo apt-get install tesseract-ocr`
   - **Mac**: `brew install tesseract`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/educareer_ai
MONGODB_URI=mongodb://localhost:27017/edu-career-ai

# Email Configuration (Gmail example)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio Configuration (for SMS and WhatsApp)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token

# Redis Configuration (for Celery)
REDIS_URL=redis://localhost:6379

# GitHub Token (for portfolio verification)
GITHUB_TOKEN=your-github-token
```

### Service Setup

1. **MongoDB**: Ensure MongoDB is running on localhost:27017
2. **Email**: Configure Gmail App Password or SMTP server
3. **Twilio** (Optional): Set up for SMS/WhatsApp notifications
4. **Redis** (Optional): For background task processing

## 🔌 API Endpoints

### Timetable Processing
- `POST /api/v1/timetable/upload` - Upload and process timetable
- `POST /api/v1/timetable/extract-text` - Extract raw text only
- `POST /api/v1/timetable/parse-courses` - Parse courses from text

### AI Recommendations
- `POST /api/v1/recommendations/certifications` - Get certification recommendations
- `POST /api/v1/recommendations/projects` - Get project recommendations
- `POST /api/v1/recommendations/combined` - Get both types
- `POST /api/v1/recommendations/feedback` - Submit user feedback

### Portfolio Management
- `POST /api/v1/portfolio/verify` - Verify portfolio items
- `GET /api/v1/portfolio/{user_id}` - Get user portfolio
- `POST /api/v1/portfolio/add-achievement` - Add new achievement

### Resume Builder
- `POST /api/v1/resume/generate` - Generate PDF resume
- `POST /api/v1/resume/preview` - Generate HTML preview
- `POST /api/v1/resume/optimize` - Optimize for job description
- `GET /api/v1/resume/templates` - Get available templates

### User Profiling
- `POST /api/v1/users/create` - Create user profile
- `GET /api/v1/users/{user_id}` - Get user profile
- `PUT /api/v1/users/update` - Update profile
- `POST /api/v1/users/analyze-skills` - Analyze user skills

### Notifications
- `POST /api/v1/notifications/send` - Send notification
- `POST /api/v1/notifications/send-bulk` - Send bulk notifications
- `POST /api/v1/notifications/preferences` - Update preferences
- `GET /api/v1/notifications/history/{user_id}` - Get notification history

## 📚 API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## 🧪 Testing

### Test Timetable Processing
```bash
curl -X POST "http://localhost:8000/api/v1/timetable/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your-timetable.pdf" \
  -F "user_id=test-user"
```

### Test Recommendations
```bash
curl -X POST "http://localhost:8000/api/v1/recommendations/certifications" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "courses": ["Computer Science", "Data Structures"],
    "user_profile": {"experience_level": "intermediate"}
  }'
```

### Test Notifications
```bash
curl -X POST "http://localhost:8000/api/v1/notifications/test" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "recipient": "your-email@example.com"
  }'
```

## 🔄 Integration with Existing System

This AI backend is designed to work alongside your existing Node.js/MongoDB system:

1. **Shared MongoDB**: Both systems use the same MongoDB database
2. **User Integration**: User IDs are shared between systems
3. **Data Sync**: AI results are stored in MongoDB for frontend access
4. **API Gateway**: Can be accessed directly or through your existing API

### Frontend Integration Example
```javascript
// Get AI recommendations
const recommendations = await fetch('http://localhost:8000/api/v1/recommendations/combined', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: currentUser.id,
    courses: userCourses,
    user_profile: userProfile
  })
});
```

## 🚀 Production Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database URLs
- Set up proper SMTP/Twilio credentials
- Enable HTTPS with reverse proxy (Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review the logs for error details
3. Ensure all dependencies are properly installed
4. Verify environment configuration

## 🔮 Future Enhancements

- **Advanced NLP**: Fine-tuned models for better course extraction
- **Real-time Recommendations**: WebSocket support for live updates
- **Multi-language Support**: Support for non-English timetables
- **Advanced Analytics**: Learning path optimization
- **Mobile SDK**: Direct mobile app integration
- **Blockchain Verification**: Immutable credential verification
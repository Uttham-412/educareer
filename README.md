# 🎓 EduCareer AI - Intelligent Education & Career Platform

A comprehensive AI-powered platform that helps students bridge the gap between education and career opportunities through personalized recommendations, automated portfolio management, intelligent resume building, and real-time SMS notifications.

## 🌟 Features

### 🤖 AI-Powered Recommendations

- **Smart Course Analysis**: Extract courses from timetables using OCR and NLP
- **Personalized Certifications**: AI recommendations based on your academic profile
- **Web Scraping**: Real-time course data from Coursera, Udemy, LinkedIn Learning
- **Career Path Mapping**: Connect your studies to career opportunities
- **Match Scoring**: Get percentage match scores for each recommendation

### 📄 Intelligent Resume Builder

- **Auto-Generated Resumes**: AI creates professional resumes from your profile
- **4 Professional Templates**: Modern, Classic, Creative, and Minimalist designs
- **Dynamic Data**: Resumes use real user data (no hardcoded values)
- **Job Optimization**: Tailor resumes for specific job descriptions
- **PDF Export**: Download professional PDFs instantly

### 🔍 Portfolio Verification

- **Multi-Platform Integration**: Verify GitHub, Coursera, edX, LinkedIn certificates
- **Automated Validation**: AI checks and scores your achievements
- **Digital Portfolio**: Centralized showcase of all your accomplishments
- **Credibility Scoring**: Build trust with verified credentials

### 📱 Smart Notifications (NEW!)

- **SMS Alerts via Twilio**: Instant notifications on your phone
- **Multi-Channel**: Email, SMS, and WhatsApp support
- **Login Alerts**: Security notifications when you log in
- **Profile Reminders**: Get notified to complete your profile
- **Timetable Confirmations**: SMS when timetable is processed
- **Recommendation Alerts**: Instant alerts for new opportunities
- **Real Database**: All notifications stored and retrieved from MongoDB

### 💾 Data Persistence

- **Timetable Storage**: Uploaded timetables saved to database
- **Course Tracking**: Extracted courses stored in user profile
- **Notification History**: Complete history of all notifications
- **Profile Persistence**: Data persists across sessions

## 🏗 Architecture

### Frontend (React + TypeScript)

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Tailwind CSS + Shadcn/ui**: Beautiful, responsive UI components
- **State Management**: Context API for global state

### Backend (Node.js + Express)

- **RESTful API**: Clean and documented API endpoints
- **JWT Authentication**: Secure token-based authentication
- **MongoDB + Mongoose**: Flexible NoSQL database
- **File Upload**: Multer for handling file uploads
- **Notification Service**: Integrated SMS/Email notifications

### AI Backend (Python + FastAPI)

- **FastAPI**: Modern, fast web framework
- **Machine Learning**: BERT, DistilBERT, Sentence Transformers
- **OCR**: Tesseract for text extraction from images
- **NLP**: spaCy for natural language processing
- **Web Scraping**: BeautifulSoup for real-time course data
- **PDF Processing**: PyMuPDF for timetable extraction

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link                                  |
| -------- | ------- | ---------------------------------------------- |
| Node.js  | 16+     | https://nodejs.org/                            |
| Python   | 3.8+    | https://www.python.org/                        |
| MongoDB  | Latest  | https://www.mongodb.com/try/download/community |
| Git      | Latest  | https://git-scm.com/                           |

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/edu-career-ai.git
cd edu-career-ai/edu-career-ai
```

#### 2. Setup MongoDB

```bash
# Windows
mongod --dbpath "C:\data\db"

# Linux/Mac
mongod --dbpath /data/db
```

Keep this terminal open. MongoDB must be running for the application to work.

#### 3. Setup Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on**: http://localhost:8080

#### 4. Setup Node.js Backend

```bash
# Open new terminal
cd server

# Install dependencies
npm install

# Create environment file (if not exists)
# The .env file should contain:
# MONGODB_URI=mongodb://localhost:27017/edu-career-ai
# JWT_SECRET=your-secret-key-here
# PORT=5000

# Start the server
npm run dev
```

**Backend will run on**: http://localhost:5000

#### 5. Setup AI Backend

```bash
# Open new terminal
cd ai-backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables in .env:
# MONGODB_URI=mongodb://localhost:27017/edu-career-ai
# TWILIO_ACCOUNT_SID=your_twilio_sid
# TWILIO_AUTH_TOKEN=your_twilio_token
# TWILIO_PHONE_NUMBER=+1234567890
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password

# Start the AI server
python main.py
```

**AI Backend will run on**: http://localhost:8000  
**API Documentation**: http://localhost:8000/docs

### 6. Access the Application

Open your browser and navigate to:

- **Main App**: http://localhost:8080
- **API Health**: http://localhost:5000/api/health
- **AI API Docs**: http://localhost:8000/docs

### Quick Test

1. Register a new account
2. Complete your profile (add phone number for SMS)
3. Upload a timetable (PDF or image)
4. Check notifications page
5. View personalized recommendations

## 📊 Technology Stack

### Frontend Technologies

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### Backend Technologies

- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing and security

### AI/ML Technologies

- **Python 3.8+**: Core programming language
- **FastAPI**: Modern, fast web framework for APIs
- **🤗 Transformers**: State-of-the-art NLP models
- **Sentence Transformers**: Semantic similarity and embeddings
- **scikit-learn**: Machine learning algorithms
- **XGBoost**: Gradient boosting for recommendations
- **spaCy**: Advanced natural language processing
- **Tesseract OCR**: Optical character recognition
- **OpenCV**: Computer vision and image processing

### Document Processing

- **PyMuPDF**: PDF text extraction
- **PDFMiner**: Alternative PDF processing
- **Pillow**: Image manipulation and processing
- **Jinja2**: Template engine for resume generation
- **WeasyPrint**: HTML to PDF conversion

### Communication & Notifications

- **Twilio**: SMS and WhatsApp messaging
- **SMTP**: Email notifications
- **Celery**: Background task processing
- **Redis**: Caching and task queue

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_API_URL=http://localhost:8000/api/v1
```

#### Node.js Backend (server/.env)

```env
MONGODB_URI=mongodb://localhost:27017/edu-career-ai
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

#### AI Backend (ai-backend/.env)

```env
MONGODB_URI=mongodb://localhost:27017/edu-career-ai
DATABASE_URL=postgresql://user:password@localhost/educareer_ai
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
GITHUB_TOKEN=your-github-token
```

## 📚 API Documentation

### Node.js API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/courses` - Get user courses
- `POST /api/courses` - Add new course

### AI API Endpoints

- `POST /api/v1/timetable/upload` - Upload and process timetable
- `POST /api/v1/recommendations/certifications` - Get certification recommendations
- `POST /api/v1/recommendations/projects` - Get project recommendations
- `POST /api/v1/portfolio/verify` - Verify portfolio items
- `POST /api/v1/resume/generate` - Generate PDF resume
- `POST /api/v1/notifications/send` - Send notifications

## 🧪 Testing

### Frontend Testing

```bash
npm run test
```

### Backend Testing

```bash
# Node.js backend
cd server
npm test

# AI backend
cd ai-backend
python -m pytest
```

### API Testing

Use the interactive API documentation at:

- Node.js API: http://localhost:5000/api-docs
- AI API: http://localhost:8000/docs

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Railway/Render)

```bash
# Node.js backend
cd server
npm run build
npm start

# AI backend
cd ai-backend
pip install -r requirements.txt
python main.py
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices for frontend
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation for API changes
- Follow semantic versioning for releases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running on localhost:27017
2. **Python Dependencies**: Use Python 3.8+ and install all requirements
3. **Port Conflicts**: Check if ports 3000, 5000, 8000 are available
4. **Environment Variables**: Verify all .env files are properly configured

### Getting Help

- 📖 Check the [Documentation](docs/)
- 🐛 Report bugs in [Issues](https://github.com/yourusername/edu-career-ai/issues)
- 💬 Join our [Discord Community](https://discord.gg/educareer-ai)
- 📧 Email support: support@educareer-ai.com

## 🔮 Roadmap

### Phase 1 (Current)

- ✅ Basic user authentication and profiles
- ✅ Timetable processing and course extraction
- ✅ AI-powered recommendations
- ✅ Resume builder with templates
- ✅ Portfolio verification system

### Phase 2 (Next)

- 🔄 Real-time notifications and alerts
- 🔄 Advanced analytics and insights
- 🔄 Mobile app development
- 🔄 Integration with job boards
- 🔄 Peer learning communities

### Phase 3 (Future)

- 📋 AI-powered interview preparation
- 📋 Skill assessment and certification
- 📋 Mentorship matching system
- 📋 Corporate partnerships
- 📋 Blockchain credential verification

## 🙏 Acknowledgments

- **OpenAI** for inspiring AI-powered education
- **Hugging Face** for providing excellent NLP models
- **MongoDB** for flexible data storage solutions
- **FastAPI** for the amazing Python web framework
- **React Team** for the incredible frontend library

## 📊 Project Stats

- **Languages**: TypeScript, Python, JavaScript
- **Frameworks**: React, FastAPI, Express.js
- **Database**: MongoDB
- **AI Models**: BERT, Sentence Transformers, XGBoost
- **Lines of Code**: 10,000+
- **API Endpoints**: 25+
- **Components**: 50+

---

**Built with ❤️ by the EduCareer AI Team**

_Empowering students to bridge the gap between education and career success through intelligent technology._

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_AI_API_URL=http://localhost:8000
```

#### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/edu-career-ai

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:8080
```

#### AI Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/edu-career-ai

# Twilio (SMS Notifications)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# GitHub (Portfolio Verification)
GITHUB_TOKEN=your_github_token

# Redis (Optional - for Celery)
REDIS_URL=redis://localhost:6379

# AI Models
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2
BERT_MODEL=distilbert-base-uncased
```

### Twilio Setup (for SMS Notifications)

1. **Sign up**: https://www.twilio.com/try-twilio
2. **Get credentials**:
   - Account SID
   - Auth Token
   - Phone Number
3. **Add to `.env`** in ai-backend folder
4. **Add phone number** to your profile (with country code: +1234567890)

### Gmail Setup (for Email Notifications)

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"
3. **Add to `.env`** in ai-backend folder

---

## 🎯 Key Features Explained

### 1. Timetable Processing with AI

- Upload PDF or image of your timetable
- OCR extracts text using Tesseract
- NLP identifies courses using BERT
- Courses saved to your profile
- Automatic course recommendations triggered

### 2. Real-Time Notifications

- **Login Alert**: SMS when you log in (security)
- **Welcome Message**: SMS/Email when you register
- **Profile Reminder**: SMS if profile is incomplete
- **Timetable Confirmation**: SMS when timetable is processed
- **New Recommendations**: SMS when new courses match your profile
- **Job Alerts**: SMS for matching job opportunities

### 3. Personalized Recommendations

- Web scraping from Coursera, Udemy, LinkedIn
- AI matching based on your skills and courses
- Match percentage scoring (0-100%)
- Real-time updates
- Saved to database

### 4. Dynamic Resume Builder

- 4 professional templates
- Auto-populated with your profile data
- No hardcoded values
- PDF export
- Job-specific optimization

### 5. Portfolio Verification

- Verify GitHub repositories
- Validate Coursera certificates
- Check LinkedIn profiles
- Credibility scoring
- Activity analysis

---

## 🧪 Testing

### Manual Testing

1. **Test Registration**:

   ```
   - Register new account
   - Check email for welcome message
   - Check phone for SMS (if provided)
   ```

2. **Test Login**:

   ```
   - Login with credentials
   - Check phone for security SMS
   - Verify profile loads correctly
   ```

3. **Test Timetable Upload**:

   ```
   - Go to Timetable page
   - Upload PDF or image
   - Wait for processing (2-5 seconds)
   - Check phone for confirmation SMS
   - Verify courses are displayed
   ```

4. **Test Notifications**:

   ```
   - Go to Notifications page
   - Should see real notifications (not fake data)
   - Click notification to mark as read
   - Refresh page - should stay marked as read
   ```

5. **Test Recommendations**:
   ```
   - Go to Opportunities page
   - Should see personalized recommendations
   - Check match percentages
   - Filter by type, location, skills
   - Click "Apply Now" to visit company sites
   ```

### API Testing

```bash
# Test Backend Health
curl http://localhost:5000/api/health

# Test AI Backend Health
curl http://localhost:8000/health

# Test SMS Notification
curl -X POST http://localhost:8000/api/v1/notifications/send-multi \
  -H "Content-Type: application/json" \
  -d '{
    "user_phone": "+1234567890",
    "user_email": "test@example.com",
    "subject": "Test",
    "message": "Test SMS from EduCareer AI",
    "channels": ["sms"]
  }'
```

---

## 📝 Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution**:

```bash
# Make sure MongoDB is running
mongod --dbpath "C:\data\db"

# Check if port 27017 is available
netstat -ano | findstr :27017
```

### Issue: SMS Not Sending

**Solution**:

- Check Twilio credentials in `.env`
- Verify phone number format (+country_code + number)
- Check Twilio account has credit
- For trial accounts, verify recipient phone numbers

### Issue: Frontend Not Loading

**Solution**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: AI Backend Errors

**Solution**:

```bash
# Reinstall Python dependencies
pip install -r requirements.txt

# Check Python version (need 3.8+)
python --version
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Update all environment variables for production
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set up MongoDB Atlas (cloud database)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up Twilio production account
- [ ] Configure email service
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Enable rate limiting
- [ ] Set up backups
- [ ] Configure CI/CD pipeline

### Deployment Options

1. **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
2. **Backend**: Heroku, Railway, AWS EC2, DigitalOcean
3. **AI Backend**: Railway, Render, AWS EC2
4. **Database**: MongoDB Atlas

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment
- [Testing Checklist](./TESTING_CHECKLIST.md) - Testing procedures
- [SMS Notifications Guide](./SMS_NOTIFICATIONS_GUIDE.md) - Twilio setup
- [Configuration Guide](./CONFIGURATION_GUIDE.md) - Detailed configuration
- [Quick Reference](./QUICK_REFERENCE.md) - Developer cheat sheet

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

Developed with ❤️ by the EduCareer AI Team

---

## 🙏 Acknowledgments

- **Twilio** for SMS notifications
- **OpenAI** for AI models
- **Hugging Face** for Transformers
- **MongoDB** for database
- **Vercel** for hosting

---

## 📞 Support

For support, email support@educareer.ai or join our Slack channel.

---

**Last Updated**: November 10, 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready

---

Made with ❤️ using React, Node.js, Python, and AI

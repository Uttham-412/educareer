# 🎓 EduCareer AI - Intelligent Education & Career Platform

A comprehensive AI-powered platform that helps students bridge the gap between education and career opportunities through personalized recommendations, automated portfolio management, and intelligent resume building.

## 🌟 Features

### 🤖 AI-Powered Recommendations
- **Smart Course Analysis**: Extract courses from timetables using OCR and NLP
- **Personalized Certifications**: AI recommendations based on your academic profile
- **Project Suggestions**: Curated projects to build your portfolio
- **Career Path Mapping**: Connect your studies to career opportunities

### 📄 Intelligent Resume Builder
- **Auto-Generated Resumes**: AI creates professional resumes from your profile
- **Multiple Templates**: Choose from modern, classic, and creative designs
- **Job Optimization**: Tailor resumes for specific job descriptions
- **Real-time Updates**: Resumes automatically update with new achievements

### 🔍 Portfolio Verification
- **Multi-Platform Integration**: Verify GitHub, Coursera, edX, LinkedIn certificates
- **Automated Validation**: AI checks and scores your achievements
- **Digital Portfolio**: Centralized showcase of all your accomplishments
- **Credibility Scoring**: Build trust with verified credentials

### 📱 Smart Notifications
- **Multi-Channel Alerts**: Email, SMS, and WhatsApp notifications
- **Personalized Digests**: Weekly learning recommendations
- **Achievement Tracking**: Celebrate your progress milestones
- **Opportunity Alerts**: Never miss relevant job openings

## 🏗 Architecture

### Frontend (React + TypeScript)
- **Modern UI**: Built with React 18 and TypeScript
- **Responsive Design**: Works seamlessly on all devices
- **Component Library**: Reusable UI components with Tailwind CSS
- **State Management**: Efficient data flow and caching

### Backend (Node.js + Express)
- **RESTful API**: Clean and documented API endpoints
- **Authentication**: Secure JWT-based user authentication
- **Database**: MongoDB for flexible data storage
- **File Handling**: Secure file upload and processing

### AI Backend (Python + FastAPI)
- **Machine Learning**: Advanced NLP and recommendation algorithms
- **Document Processing**: OCR and PDF text extraction
- **AI Models**: BERT, Sentence Transformers, XGBoost
- **Scalable Architecture**: Async processing and background tasks

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/edu-career-ai.git
cd edu-career-ai/edu-career-ai
```

### 2. Setup Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Setup Node.js Backend
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start the server
npm run dev
```

### 4. Setup AI Backend
```bash
# Navigate to AI backend directory
cd ai-backend

# Run setup script
python setup.py

# Or manual setup:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start the AI server
python main.py
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Node.js API**: http://localhost:5000
- **AI API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

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

*Empowering students to bridge the gap between education and career success through intelligent technology.*
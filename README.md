# EduCareer - AI-Powered Career Guidance Platform

An intelligent career guidance system for students that provides personalized course recommendations, job opportunities, resume building, and portfolio verification using AI/ML technologies.

## 🎯 Features

### 📊 Smart Dashboard
- Year-based content (courses for 1st-3rd year, jobs/internships for 4th year)
- Personalized recommendations based on student profile
- GitHub project and certification verification
- Career roadmap and progress tracking

### 💼 Opportunities
- Browse courses, internships, and jobs
- Advanced filtering (type, location, skills, salary)
- Search functionality
- Direct application system

### 📅 Timetable Analysis
- Upload timetable (PDF/Image)
- AI-powered course recommendations using Graph-BERT
- 50+ courses from 6 platforms (Coursera, Udemy, edX, NPTEL, etc.)
- Keyword extraction and learning path suggestions

### 📄 Resume Builder
- 4 professional templates
- 12 comprehensive sections
- Photo upload support
- Export to PDF and Word (.docx)

### 🔔 Notifications (Optional)
- Email notifications
- SMS and WhatsApp via Twilio
- Celery + Redis for async processing

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + Shadcn/ui
- Vite
- React Router v6

### Backend
- FastAPI (Python)
- Sentence Transformers (AI/ML)
- Graph-BERT for recommendations
- OCR for timetable processing
- Celery + Redis (optional)
- Twilio API (optional)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/educareer.git
cd educareer
```

2. **Setup Backend**
```bash
cd ai-backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials (optional)
python main.py
```

3. **Setup Frontend**
```bash
cd ..
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
educareer/
├── src/                          # Frontend source
│   ├── pages/                    # Page components
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── Opportunities.tsx     # Job/course listings
│   │   ├── Timetable.tsx        # Timetable upload
│   │   └── Resume.tsx           # Resume builder
│   ├── components/              # Reusable components
│   └── lib/                     # Utilities and API
├── ai-backend/                  # Backend services
│   ├── app/
│   │   ├── routers/            # API endpoints
│   │   └── services/           # Business logic
│   ├── main.py                 # FastAPI app
│   └── .env.example            # Environment template
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` in the `ai-backend` directory:

```bash
cd ai-backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Optional: Twilio (for notifications)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token

# Optional: Email (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: Redis (for Celery)
REDIS_URL=redis://localhost:6379
```

**Note**: The application works without these credentials. Notification features will be disabled.

## 📖 Usage

### For Students

1. **Sign up** and complete your profile
2. **Upload timetable** to get AI-powered course recommendations
3. **Browse opportunities** - filter by type, location, skills
4. **Build resume** - choose from 4 professional templates
5. **Verify portfolio** - upload GitHub projects and certifications

### For Developers

See [STARTUP.md](./STARTUP.md) for detailed development instructions.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Sentence Transformers for AI embeddings
- Shadcn/ui for beautiful components
- FastAPI for the robust backend framework
- Twilio for notification services

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for students seeking career guidance**

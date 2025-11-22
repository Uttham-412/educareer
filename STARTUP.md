# 🚀 Startup Guide

Quick guide to get EduCareer running on your local machine.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd ai-backend
pip install -r requirements.txt
```

### 2. Configure Environment (Optional)

```bash
cp .env.example .env
```

Edit `.env` if you want to enable notifications:
- Add Twilio credentials for SMS/WhatsApp
- Add Gmail credentials for email
- Add Redis URL for Celery

**Note**: App works fine without these!

### 3. Start Backend

```bash
python main.py
```

✅ Backend running on: http://localhost:8000

### 4. Install Frontend Dependencies

Open a new terminal:

```bash
cd educareer
npm install
```

### 5. Start Frontend

```bash
npm run dev
```

✅ Frontend running on: http://localhost:5173

### 6. Access Application

Open your browser: http://localhost:5173

## 🎯 What Works

### Without Any Configuration
- ✅ Dashboard with personalized content
- ✅ Opportunities page (8 default opportunities)
- ✅ Timetable upload with AI recommendations
- ✅ Resume builder with 4 templates
- ✅ All search and filter features

### With Optional Configuration
- 📧 Email notifications (requires Gmail setup)
- 📱 SMS/WhatsApp notifications (requires Twilio)
- ⚡ Background tasks (requires Redis + Celery)

## 🔧 Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Won't Start

```bash
# Check Node version
node --version  # Should be 16+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

**Backend (port 8000)**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Frontend (port 5173)**:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Course Recommendations Not Loading

Make sure backend is running:
```bash
curl http://localhost:8000/health
```

Should return: `{"status":"healthy","version":"1.0.0"}`

## 📝 Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh in browser
- Backend: Changes auto-restart server

### API Documentation

Visit http://localhost:8000/docs for interactive API documentation.

### Check Logs

- **Backend**: Check terminal where `python main.py` is running
- **Frontend**: Check browser console (F12)

## 🎉 You're Ready!

The application should now be running. Create an account and start exploring!

### Quick Test Checklist

- [ ] Can access http://localhost:5173
- [ ] Can sign up/login
- [ ] Dashboard loads
- [ ] Can view opportunities
- [ ] Can upload timetable
- [ ] Can build resume

If all checked, you're good to go! 🚀

## 📚 Next Steps

- Explore the Dashboard
- Upload a timetable to get course recommendations
- Browse opportunities and apply
- Build your resume with professional templates
- Verify your GitHub projects

---

**Need help?** Open an issue on GitHub or check the main README.md

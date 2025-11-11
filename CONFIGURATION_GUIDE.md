# 🔧 Complete Configuration Guide for EduCareer AI

This guide will walk you through setting up all the necessary tokens, URLs, and configurations for your EduCareer AI platform.

## 📋 Quick Overview

### Required (Essential for basic functionality):
- ✅ MongoDB (Local or Cloud)
- ✅ JWT Secret Key
- ✅ Gmail App Password (for email notifications)

### Optional (Enhanced features):
- 🔧 GitHub Personal Access Token (for portfolio verification)
- 🔧 Twilio Account (for SMS/WhatsApp)
- 🔧 PostgreSQL Database (additional storage)
- 🔧 Redis (for background tasks)

---

## 🚀 Step 1: Basic Setup (Required)

### 1.1 MongoDB Setup

**Option A: Local MongoDB (Recommended for development)**
1. Download and install MongoDB from: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: `net start MongoDB` (run as administrator)
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. Your MongoDB URI will be: `mongodb://localhost:27017/edu-career-ai`

**Option B: MongoDB Atlas (Cloud - Free tier available)**
1. Go to: https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/edu-career-ai`)

### 1.2 JWT Secret Key
Generate a secure random string for JWT tokens:
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use online generator
# Visit: https://generate-secret.vercel.app/64
```

### 1.3 Gmail App Password (for email notifications)
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google," click on "2-Step Verification" (enable if not already)
4. Scroll down and click on "App passwords"
5. Select "Mail" and "Other (custom name)"
6. Enter "EduCareer AI" as the name
7. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

---

## 🔧 Step 2: Configuration Files

### 2.1 Frontend Configuration
Create `edu-career-ai/edu-career-ai/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_API_URL=http://localhost:8000/api/v1
```

### 2.2 Node.js Backend Configuration
Update `edu-career-ai/edu-career-ai/server/.env`:
```env
# Replace with your actual values
MONGODB_URI=mongodb://localhost:27017/edu-career-ai
JWT_SECRET=your-64-character-jwt-secret-from-step-1.2
PORT=5000
NODE_ENV=development
```

### 2.3 AI Backend Configuration
Update `edu-career-ai/edu-career-ai/ai-backend/.env`:
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/educareer_ai
MONGODB_URI=mongodb://localhost:27017/edu-career-ai

# Email Configuration (REQUIRED)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-from-step-1.3

# Optional Services (leave empty if not using)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
REDIS_URL=redis://localhost:6379
GITHUB_TOKEN=

# AI Model Configuration (don't change)
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2
BERT_MODEL=distilbert-base-uncased

# File Storage (don't change)
UPLOAD_DIR=uploads
RESUME_OUTPUT_DIR=resumes
```

---

## 🌟 Step 3: Optional Enhanced Features

### 3.1 GitHub Personal Access Token (for portfolio verification)

**What it does**: Verifies GitHub repositories and projects in user portfolios

**How to get it**:
1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "EduCareer AI Portfolio Verification"
4. Select scopes:
   - ✅ `public_repo` (access public repositories)
   - ✅ `read:user` (read user profile)
5. Click "Generate token"
6. Copy the token (starts with `ghp_` or `github_pat_`)
7. Add to your `.env` file:
```env
GITHUB_TOKEN=your-github-token-here
```

### 3.2 Twilio Account (for SMS and WhatsApp notifications)

**What it does**: Sends SMS and WhatsApp notifications to users

**How to get it**:
1. Go to Twilio: https://www.twilio.com/try-twilio
2. Sign up for a free account
3. Verify your phone number
4. Go to Console Dashboard: https://console.twilio.com/
5. Find your Account SID and Auth Token
6. Add to your `.env` file:
```env
TWILIO_ACCOUNT_SID=your-account-sid-here
TWILIO_AUTH_TOKEN=your-auth-token-here
```

**Note**: Free tier includes $15 credit and sandbox WhatsApp

### 3.3 PostgreSQL Database (optional additional storage)

**What it does**: Additional relational database for complex queries

**How to get it**:
1. **Local PostgreSQL**:
   - Download: https://www.postgresql.org/download/
   - Install and create database: `educareer_ai`
   - Connection string: `postgresql://username:password@localhost/educareer_ai`

2. **Cloud PostgreSQL (Free options)**:
   - **Supabase**: https://supabase.com/ (free tier)
   - **Railway**: https://railway.app/ (free tier)
   - **Render**: https://render.com/ (free tier)

### 3.4 Redis (for background task processing)

**What it does**: Handles background tasks like scheduled notifications

**How to get it**:
1. **Local Redis**:
   - Windows: Download from https://github.com/microsoftarchive/redis/releases
   - Mac: `brew install redis` then `brew services start redis`
   - Linux: `sudo apt-get install redis-server`

2. **Cloud Redis (Free options)**:
   - **Redis Cloud**: https://redis.com/try-free/ (free 30MB)
   - **Railway**: https://railway.app/ (free tier)

---

## 🚀 Step 4: Testing Your Configuration

### 4.1 Test MongoDB Connection
```bash
cd edu-career-ai/edu-career-ai/server
npm run dev
# Should show: "Connected to MongoDB"
```

### 4.2 Test AI Backend
```bash
cd edu-career-ai/edu-career-ai/ai-backend
python main.py
# Visit: http://localhost:8000/health
```

### 4.3 Test Email Notifications
```bash
# Visit: http://localhost:8000/docs
# Try the POST /api/v1/notifications/test endpoint
```

---

## 📱 Step 5: Production Deployment

### 5.1 Environment Variables for Production

**Frontend (Vercel/Netlify)**:
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_AI_API_URL=https://your-ai-backend-domain.com/api/v1
```

**Backend (Railway/Render)**:
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

**AI Backend (Railway/Render)**:
```env
MONGODB_URI=your-production-mongodb-uri
EMAIL_USER=your-production-email
EMAIL_PASSWORD=your-production-app-password
# ... other production values
```

---

## 🔍 Step 6: Verification Checklist

### ✅ Basic Functionality
- [ ] MongoDB connected
- [ ] User registration/login works
- [ ] JWT tokens generated
- [ ] Email notifications sent

### ✅ AI Features
- [ ] Timetable upload works
- [ ] Recommendations generated
- [ ] Resume builder functional
- [ ] Portfolio verification active

### ✅ Optional Features
- [ ] GitHub portfolio verification
- [ ] SMS/WhatsApp notifications
- [ ] Background task processing
- [ ] Advanced analytics

---

## 🆘 Troubleshooting

### Common Issues:

**1. MongoDB Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service or check connection string

**2. Gmail Authentication Failed**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution**: Use App Password, not regular Gmail password

**3. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process or change port in .env file

**4. AI Models Not Loading**
```
Error: No module named 'transformers'
```
**Solution**: Install Python dependencies: `pip install -r requirements.txt`

---

## 📞 Support

If you encounter issues:
1. Check the error logs in terminal
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, etc.) are running
4. Check firewall/antivirus settings

---

## 🎉 You're All Set!

Once configured, your EduCareer AI platform will have:
- 🤖 AI-powered recommendations
- 📄 Automated resume generation
- ✅ Portfolio verification
- 📧 Smart notifications
- 📊 User analytics

**Next Steps**:
1. Test all features locally
2. Deploy to production
3. Add your own custom features
4. Scale as needed

Happy coding! 🚀
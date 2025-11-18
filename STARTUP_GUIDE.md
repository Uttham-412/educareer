# 🚀 EduCareer AI - Complete Startup Guide

## ✅ Current Status: ALL SERVICES RUNNING!

All services are currently running and connected:
- ✅ MongoDB (Port 27017) - Connected
- ✅ Node.js Backend (Port 5000) - Running
- ✅ AI Backend (Port 8000) - Running  
- ✅ Frontend (Port 8080) - Running

---

## 📋 Step-by-Step Startup Commands

### Method 1: Manual Startup (Recommended for Development)

Open **4 separate terminal windows** and run these commands:

#### Terminal 1: Start MongoDB
```bash
cd D:\mp\edu-career-ai\edu-career-ai
run-mongodb.bat
```
Wait until you see: `Waiting for connections on port 27017`

#### Terminal 2: Start Node.js Backend
```bash
cd D:\mp\edu-career-ai\edu-career-ai\server
npm run dev
```
Wait until you see: `Server running on port 5000` and `Connected to MongoDB`

#### Terminal 3: Start AI Backend
```bash
cd D:\mp\edu-career-ai\edu-career-ai\ai-backend
python main.py
```
Wait until you see: `Application startup complete`

#### Terminal 4: Start Frontend
```bash
cd D:\mp\edu-career-ai\edu-career-ai
npm run dev
```
Wait until you see: `Local: http://localhost:8080/`

---

### Method 2: Quick Start (All at Once)

**Right-click `start-all-services.bat` → Run as Administrator**

This will start all services automatically in separate windows.

---

## 🔧 Troubleshooting

### If MongoDB Won't Start:
```bash
# Option 1: Run as Administrator
Right-click PowerShell → Run as Administrator
net start MongoDB

# Option 2: Use the batch file
cd D:\mp\edu-career-ai\edu-career-ai
run-mongodb.bat
```

### If Port is Already in Use:
```bash
# Kill all node processes
Stop-Process -Name node -Force

# Kill process on specific port (e.g., 5000)
netstat -ano | findstr :5000
# Note the PID and kill it:
taskkill /PID <PID> /F
```

### If MongoDB Connection Fails:
1. Check if MongoDB is running:
   ```bash
   Get-Service -Name MongoDB
   ```

2. Test connection:
   ```bash
   Test-NetConnection -ComputerName localhost -Port 27017
   ```

3. Restart MongoDB:
   ```bash
   cd D:\mp\edu-career-ai\edu-career-ai
   run-mongodb.bat
   ```

---

## 🌐 Access URLs

Once all services are running:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **AI Backend API**: http://localhost:8000
- **AI Backend Docs**: http://localhost:8000/docs
- **MongoDB**: mongodb://localhost:27017

---

## 📦 Dependencies Check

### Node.js Dependencies:
```bash
# Frontend
cd D:\mp\edu-career-ai\edu-career-ai
npm install

# Backend
cd D:\mp\edu-career-ai\edu-career-ai\server
npm install
```

### Python Dependencies:
```bash
cd D:\mp\edu-career-ai\edu-career-ai\ai-backend
pip install -r requirements.txt

# Or install individually:
pip install fastapi uvicorn motor pymongo python-dotenv
pip install transformers sentence-transformers torch
pip install pytesseract opencv-python PyMuPDF pillow
pip install twilio aiofiles pandas
```

---

## 🎯 Testing the Application

### 1. Test Backend Health:
```bash
curl http://localhost:5000/api/health
```

### 2. Test AI Backend Health:
```bash
curl http://localhost:8000/health
```

### 3. Test MongoDB Connection:
```bash
mongosh
# Or
mongo
```

### 4. Test Frontend:
Open browser: http://localhost:8080

---

## 🔐 Environment Variables

### Backend (.env in server folder):
```env
MONGODB_URI=mongodb://localhost:27017/educareer
JWT_SECRET=your-secret-key
PORT=5000
```

### AI Backend (.env in ai-backend folder):
```env
MONGODB_URI=mongodb://localhost:27017/educareer
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

---

## 🛑 Stopping Services

### Stop All Services:
```bash
# Stop all node processes
Stop-Process -Name node -Force

# Stop Python processes
Stop-Process -Name python -Force

# Stop MongoDB (as Administrator)
net stop MongoDB
```

### Stop Individual Services:
- Press `Ctrl+C` in each terminal window

---

## 📝 Common Issues & Solutions

### Issue: "Port already in use"
**Solution**: Kill the process using that port or restart your computer

### Issue: "MongoDB connection timeout"
**Solution**: Make sure MongoDB is running first before starting backends

### Issue: "Module not found"
**Solution**: Run `npm install` or `pip install -r requirements.txt`

### Issue: "Cannot connect to MongoDB"
**Solution**: 
1. Check if MongoDB service is running
2. Verify MongoDB is listening on port 27017
3. Check firewall settings

---

## 🎉 Success Indicators

You'll know everything is working when you see:

1. **MongoDB**: `Waiting for connections on port 27017`
2. **Node.js Backend**: `Server running on port 5000` + `Connected to MongoDB`
3. **AI Backend**: `Application startup complete` + `Uvicorn running on http://0.0.0.0:8000`
4. **Frontend**: `Local: http://localhost:8080/`

---

## 📞 Need Help?

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the logs in each terminal window
3. Ensure all dependencies are installed
4. Verify MongoDB is running first

---

**Last Updated**: November 14, 2025
**Status**: All services operational ✅

# ⚡ Quick Reference Guide - EduCareer AI

A cheat sheet for developers working on the EduCareer AI platform.

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Start MongoDB
mongod --dbpath "C:\data\db"

# 2. Start Frontend (Terminal 1)
cd edu-career-ai
npm run dev

# 3. Start Backend (Terminal 2)
cd server
npm run dev

# 4. Start AI Backend (Terminal 3)
cd ai-backend
python main.py

# 5. Open browser
# http://localhost:5173
```

---

## 📡 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React UI |
| Backend API | http://localhost:5000 | Node.js REST API |
| AI API | http://localhost:8000 | Python FastAPI |
| API Docs | http://localhost:8000/docs | Swagger UI |
| MongoDB | localhost:27017 | Database |

---

## 🔑 Common Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend (Node.js)
```bash
npm run dev          # Start with nodemon
npm start            # Start production
npm run seed         # Seed database
npm run clear-data   # Clear database
```

### AI Backend (Python)
```bash
python main.py                    # Start server
python setup.py                   # Setup environment
pip install -r requirements.txt   # Install dependencies
```

---

## 📂 Key File Locations

### Frontend
```
src/
├── pages/
│   ├── Account.tsx              # Profile management
│   ├── Opportunities.tsx        # Recommendations
│   ├── Resume.tsx               # Resume builder
│   └── Timetable.tsx           # Timetable upload
├── components/
│   ├── opportunities/OpportunityCard.tsx
│   └── resume/ResumeTemplate[1-4].tsx
└── contexts/AuthContext.tsx     # Authentication
```

### Backend
```
server/src/
├── routes/
│   ├── auth.ts                  # Authentication
│   ├── users.ts                 # User management
│   └── opportunities.ts         # Opportunities
├── models/
│   ├── User.ts                  # User model
│   └── Opportunity.ts           # Opportunity model
└── seedData.ts                  # Database seeding
```

### AI Backend
```
ai-backend/app/
├── routers/
│   ├── timetable_extraction.py
│   ├── personalized_recommendations.py
│   └── resume_builder.py
└── services/
    ├── timetable_processor.py
    ├── recommendation_engine.py
    └── opportunity_scraper.py
```

---

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_AI_API_URL=http://localhost:8000
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/educareer
JWT_SECRET=your-secret-key
PORT=5000
```

### AI Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/educareer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

---

## 🐛 Common Issues & Fixes

### Issue: MongoDB Connection Failed
```bash
# Start MongoDB
mongod --dbpath "C:\data\db"

# Or create data directory
mkdir C:\data\db
```

### Issue: Port Already in Use
```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Issue: AI Backend Not Starting
```bash
# Reinstall dependencies
cd ai-backend
pip install -r requirements.txt

# Check Python version (need 3.8+)
python --version
```

### Issue: Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Code Snippets

### Add New API Endpoint (Node.js)
```typescript
// server/src/routes/myroute.ts
import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/my-endpoint', auth, async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

### Add New AI Endpoint (Python)
```python
# ai-backend/app/routers/myrouter.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/myrouter", tags=["MyRouter"])

class MyRequest(BaseModel):
    data: str

@router.post("/endpoint")
async def my_endpoint(request: MyRequest):
    try:
        # Your logic here
        return {"success": True, "data": {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Add New React Component
```typescript
// src/components/MyComponent.tsx
import { Card } from "@/components/ui/card";

interface MyComponentProps {
  data: string;
}

export function MyComponent({ data }: MyComponentProps) {
  return (
    <Card>
      <p>{data}</p>
    </Card>
  );
}
```

---

## 🧪 Testing Endpoints

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Test AI Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Get recommendations
curl -X POST http://localhost:8000/api/v1/recommendations/personalized \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","include_courses":true}'
```

---

## 🎨 UI Components

### Using Shadcn Components
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

<Button variant="default">Click Me</Button>
<Badge variant="secondary">New</Badge>
```

### Toast Notifications
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success!",
  description: "Operation completed successfully",
});
```

---

## 🔐 Authentication

### Protected Routes (Frontend)
```typescript
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedPage() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <div>Protected Content</div>;
}
```

### Auth Middleware (Backend)
```typescript
import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 📊 Database Operations

### MongoDB Queries (Mongoose)
```typescript
// Find all
const users = await User.find();

// Find one
const user = await User.findById(id);

// Create
const user = await User.create({ name, email, password });

// Update
await User.findByIdAndUpdate(id, { name: "New Name" });

// Delete
await User.findByIdAndDelete(id);
```

### Seed Database
```bash
cd server
npm run seed
```

---

## 🎯 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add: my feature description"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### Commit Message Convention
```
Add: New feature
Fix: Bug fix
Update: Modify existing feature
Remove: Delete code/feature
Docs: Documentation changes
Style: Code formatting
Refactor: Code restructuring
Test: Add tests
```

---

## 📦 Package Management

### Add New Package (Frontend)
```bash
npm install package-name
npm install -D package-name  # Dev dependency
```

### Add New Package (Backend)
```bash
npm install package-name
```

### Add New Package (AI Backend)
```bash
pip install package-name
pip freeze > requirements.txt  # Update requirements
```

---

## 🔍 Debugging

### Frontend Debugging
```typescript
// Console logging
console.log('Debug:', data);

// React DevTools
// Install browser extension

// Network tab
// Check API calls in browser DevTools
```

### Backend Debugging
```typescript
// Add logging
console.log('Request:', req.body);
console.error('Error:', error);

// Use debugger
debugger;
```

### AI Backend Debugging
```python
# Add logging
import logging
logging.info(f"Processing: {data}")

# Print debugging
print(f"Debug: {variable}")

# Use pdb
import pdb; pdb.set_trace()
```

---

## 📈 Performance Tips

### Frontend
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images
- Use production build for testing

### Backend
- Add database indexes
- Implement caching (Redis)
- Use connection pooling
- Enable compression

### AI Backend
- Cache model predictions
- Use batch processing
- Implement async operations
- Optimize model loading

---

## 🚀 Deployment Checklist

- [ ] Update environment variables
- [ ] Build frontend (`npm run build`)
- [ ] Test production build
- [ ] Set up MongoDB Atlas
- [ ] Configure CORS for production
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Update documentation

---

## 📚 Documentation Links

- [Full README](./README.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Testing Checklist](./TESTING_CHECKLIST.md)
- [Project Status](./PROJECT_STATUS.md)

---

## 💡 Pro Tips

1. **Use TypeScript**: Catch errors early with type checking
2. **Write Tests**: Prevent regressions with automated tests
3. **Document Code**: Add comments for complex logic
4. **Use Git**: Commit often with clear messages
5. **Review PRs**: Always review code before merging
6. **Monitor Logs**: Check logs regularly for issues
7. **Optimize Early**: Don't wait for performance issues
8. **Security First**: Always validate and sanitize input

---

## 🆘 Getting Help

- Check documentation first
- Search GitHub issues
- Ask in team chat
- Create detailed bug reports
- Include error messages and logs

---

**Last Updated**: November 10, 2025  
**Version**: 1.0.0

# 📚 API Documentation - EduCareer AI

## Base URLs

- **Node.js Backend**: `http://localhost:5000/api`
- **AI Backend**: `http://localhost:8000/api/v1`
- **Production**: Update with your domain

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Node.js Backend API

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Profile Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Computer Science Student",
    "skills": ["JavaScript", "Python", "React"],
    "education": [],
    "experience": [],
    "projects": []
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Full Stack Developer",
  "skills": ["JavaScript", "Python", "React", "Node.js"],
  "education": [
    {
      "institution": "University Name",
      "degree": "B.Tech Computer Science",
      "startDate": "2020-08-01",
      "endDate": "2024-05-31"
    }
  ]
}
```

### Opportunities Endpoints

#### Get All Opportunities
```http
GET /api/opportunities
Authorization: Bearer <token>
```

**Query Parameters**
- `type`: Filter by type (certification, internship, job)
- `location`: Filter by location
- `skills`: Filter by skills (comma-separated)
- `search`: Search term

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "opp_id",
      "title": "Frontend Developer Intern",
      "company": "TechCorp",
      "type": "internship",
      "location": "Remote",
      "skills": ["React", "TypeScript"],
      "description": "...",
      "applicationUrl": "https://..."
    }
  ]
}
```

#### Apply to Opportunity
```http
POST /api/opportunities/:id/apply
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "message": "Application submitted successfully"
}
```

---

## AI Backend API

### Health Check

#### Check API Health
```http
GET /health
```

**Response**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### Timetable Processing

#### Extract Courses from Timetable
```http
POST /api/v1/timetable/extract
Content-Type: multipart/form-data

file: <timetable.pdf or timetable.jpg>
```

**Response**
```json
{
  "success": true,
  "data": {
    "extracted_text": "Full OCR text...",
    "courses": [
      {
        "name": "Data Structures and Algorithms",
        "code": "CS201",
        "confidence": 0.95,
        "schedule": "Mon, Wed 10:00-11:30"
      }
    ],
    "processing_time": 2.34
  }
}
```

**Supported Formats**
- PDF (.pdf)
- Images (.jpg, .jpeg, .png)
- Excel (.xlsx, .xls)
- CSV (.csv)

### Personalized Recommendations

#### Get Personalized Recommendations
```http
POST /api/v1/recommendations/personalized
Content-Type: application/json

{
  "user_id": "user_id",
  "include_courses": true,
  "include_jobs": true,
  "limit": 20
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "title": "Advanced React Development",
        "provider": "Coursera",
        "description": "Master React with advanced patterns",
        "url": "https://coursera.org/...",
        "duration": "6 weeks",
        "skills": ["React", "JavaScript"],
        "rating": 4.8,
        "match_percentage": 92,
        "match_reasons": [
          "Matches your React skill",
          "Aligns with your career goals"
        ]
      }
    ],
    "jobs": [
      {
        "title": "Frontend Developer",
        "company": "Google",
        "type": "Full-time",
        "location": "Remote",
        "description": "Build amazing user experiences",
        "url": "https://careers.google.com/...",
        "skills": ["React", "TypeScript", "CSS"],
        "match_percentage": 88,
        "match_reasons": [
          "Strong skill match",
          "Experience level fits"
        ]
      }
    ],
    "total_recommendations": 15
  }
}
```

#### Submit Recommendation Feedback
```http
POST /api/v1/recommendations/feedback
Content-Type: application/json

{
  "user_id": "user_id",
  "item_id": "recommendation_id",
  "action": "clicked",
  "rating": 5
}
```

**Actions**: `clicked`, `applied`, `saved`, `dismissed`

### Resume Builder

#### Generate Resume
```http
POST /api/v1/resume/generate
Content-Type: application/json

{
  "user_id": "user_id",
  "template": "modern",
  "format": "pdf"
}
```

**Templates**: `modern`, `classic`, `creative`, `minimalist`

**Response**
```json
{
  "success": true,
  "data": {
    "resume_url": "https://storage.../resume.pdf",
    "download_url": "/api/v1/resume/download/resume_id"
  }
}
```

#### Optimize Resume for Job
```http
POST /api/v1/resume/optimize
Content-Type: application/json

{
  "user_id": "user_id",
  "job_description": "We are looking for a React developer with 2+ years experience...",
  "template": "modern"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "optimized_resume": "...",
    "suggestions": [
      "Add more React projects",
      "Highlight TypeScript experience",
      "Include team collaboration skills"
    ],
    "match_score": 85
  }
}
```

### Portfolio Verification

#### Verify Portfolio Item
```http
POST /api/v1/portfolio/verify
Content-Type: application/json

{
  "user_id": "user_id",
  "platform": "github",
  "url": "https://github.com/username"
}
```

**Supported Platforms**: `github`, `coursera`, `edx`, `linkedin`, `udemy`

**Response**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "platform": "github",
    "profile_data": {
      "username": "username",
      "repositories": 45,
      "followers": 120,
      "contributions": 1250
    },
    "credibility_score": 92,
    "verification_details": {
      "profile_exists": true,
      "activity_level": "high",
      "quality_score": 88
    }
  }
}
```

#### Get All Verified Portfolios
```http
GET /api/v1/portfolio/user/:user_id
```

**Response**
```json
{
  "success": true,
  "data": {
    "portfolios": [
      {
        "platform": "github",
        "verified": true,
        "score": 92,
        "last_verified": "2025-11-10T10:30:00Z"
      }
    ],
    "overall_score": 88
  }
}
```

### User Profiling

#### Analyze User Profile
```http
POST /api/v1/profile/analyze
Content-Type: application/json

{
  "user_id": "user_id",
  "profile_data": {
    "skills": ["React", "Python"],
    "education": [...],
    "experience": [...],
    "projects": [...]
  }
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "skill_level": "intermediate",
    "career_stage": "early_career",
    "strengths": ["Frontend Development", "Problem Solving"],
    "improvement_areas": ["Backend Development", "System Design"],
    "recommended_paths": [
      "Full Stack Developer",
      "Frontend Specialist"
    ],
    "skill_gaps": [
      {
        "skill": "Node.js",
        "importance": "high",
        "resources": [...]
      }
    ]
  }
}
```

### Notifications

#### Send Notification
```http
POST /api/v1/notifications/send
Content-Type: application/json

{
  "user_id": "user_id",
  "type": "email",
  "subject": "New Opportunity Match",
  "message": "We found 5 new opportunities matching your profile",
  "priority": "high"
}
```

**Types**: `email`, `sms`, `whatsapp`, `push`

**Response**
```json
{
  "success": true,
  "data": {
    "notification_id": "notif_id",
    "status": "sent",
    "sent_at": "2025-11-10T10:30:00Z"
  }
}
```

#### Get User Notifications
```http
GET /api/v1/notifications/user/:user_id
```

**Query Parameters**
- `unread`: Filter unread notifications (true/false)
- `type`: Filter by type
- `limit`: Number of notifications (default: 50)

**Response**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_id",
        "type": "email",
        "subject": "New Opportunity",
        "message": "...",
        "read": false,
        "created_at": "2025-11-10T10:30:00Z"
      }
    ],
    "unread_count": 5
  }
}
```

---

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INTERNAL_ERROR` | 500 | Server error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

---

## Rate Limiting

API requests are rate-limited to ensure fair usage:

- **Authentication endpoints**: 5 requests per minute
- **Standard endpoints**: 100 requests per minute
- **AI processing endpoints**: 20 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699632000
```

---

## Webhooks

Subscribe to events via webhooks:

### Available Events

- `user.registered` - New user registration
- `opportunity.applied` - User applied to opportunity
- `resume.generated` - Resume generation completed
- `portfolio.verified` - Portfolio verification completed
- `recommendation.generated` - New recommendations available

### Webhook Payload Example

```json
{
  "event": "opportunity.applied",
  "timestamp": "2025-11-10T10:30:00Z",
  "data": {
    "user_id": "user_id",
    "opportunity_id": "opp_id",
    "opportunity_title": "Frontend Developer"
  }
}
```

---

## SDK & Client Libraries

### JavaScript/TypeScript

```typescript
import { EduCareerClient } from '@educareer/sdk';

const client = new EduCareerClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:5000'
});

// Get recommendations
const recommendations = await client.recommendations.getPersonalized({
  userId: 'user_id',
  includeCourses: true,
  includeJobs: true
});
```

### Python

```python
from educareer import EduCareerClient

client = EduCareerClient(
    api_key='your-api-key',
    base_url='http://localhost:8000'
)

# Extract timetable
result = client.timetable.extract('path/to/timetable.pdf')
```

---

## Interactive API Documentation

Visit the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide:
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication testing

---

## Support

For API support:
- Email: api-support@educareer.com
- Documentation: https://docs.educareer.com
- GitHub Issues: https://github.com/educareer/issues

---

**Last Updated**: November 10, 2025
**API Version**: 1.0.0

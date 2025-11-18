# 🚀 Opportunities & Recommendations Enhancement

## ✅ What's Been Implemented

### 1. Expanded Course Database (50+ Courses)
- Added 50+ real courses from Coursera, Udemy, and other platforms
- Courses categorized by:
  - Data Science & Analytics (10+ courses)
  - Web Development (10+ courses)
  - Programming & Software Development (8+ courses)
  - Cloud & DevOps (5+ courses)
  - Mobile Development (5+ courses)
  - Cybersecurity (3+ courses)
  - AI & Machine Learning (5+ courses)
  - Business & Management (3+ courses)
  - Design & UX (3+ courses)

### 2. Year-Based Filtering
- Courses now tagged with suitable years: `year_suitable: [1, 2, 3, 4]`
- First/Second year students see beginner-friendly courses
- Third/Fourth year students see advanced courses and internships
- Automatic filtering based on user's `currentYear` field

### 3. More Internship Opportunities (10+ Added)
- **First/Second Year:**
  - Google STEP Intern
  - Microsoft Explore Intern
  
- **Third/Fourth Year:**
  - Meta Software Engineering Intern
  - Amazon Data Science Intern
  - Netflix Frontend Developer Intern
  - Apple ML Engineering Intern
  - IBM Cloud Engineering Intern
  - Cisco Cybersecurity Intern
  - Spotify Mobile App Development Intern
  - Airbnb Product Management Intern

### 4. New API Endpoint for Timetable Recommendations
**Endpoint:** `POST /api/v1/timetable/get-recommendations`

**Request:**
```json
{
  "courses": ["Data Structures", "Web Development", "Machine Learning"],
  "user_profile": {
    "currentYear": 3,
    "skills": ["Python", "JavaScript"],
    "occupation": "Software Developer"
  },
  "limit": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "title": "Machine Learning Specialization",
        "provider": "Coursera",
        "url": "https://...",
        "can_apply": true,
        "apply_button_text": "Enroll Now",
        "apply_url": "https://...",
        "match_percentage": 85,
        "skills": ["Machine Learning", "Python"],
        "year_suitable": [2, 3, 4]
      }
    ],
    "jobs": [...],
    "internships": [...],
    "total_courses": 25,
    "user_year": 3
  }
}
```

---

## 🔧 How to Use the Enhanced Features

### For Frontend Integration

#### 1. Update Opportunities Page to Show More Courses

```typescript
// In Opportunities.tsx
const fetchOpportunities = async () => {
  const response = await fetch(`${API_URL}/api/v1/timetable/get-recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      courses: userCourses,
      user_profile: {
        currentYear: user.currentYear || 2,
        skills: user.skills || [],
        occupation: user.occupation
      },
      limit: 30  // Get 30 recommendations instead of 9
    })
  });
  
  const data = await response.json();
  setOpportunities(data.data.courses);
  setInternships(data.data.internships);
};
```

#### 2. Add Apply Buttons to Each Opportunity

```typescript
// Opportunity Card Component
<Card>
  <CardHeader>
    <CardTitle>{opportunity.title}</CardTitle>
    <Badge>{opportunity.provider}</Badge>
  </CardHeader>
  <CardContent>
    <p>{opportunity.description}</p>
    <div className="flex gap-2 mt-4">
      <Button 
        onClick={() => window.open(opportunity.apply_url, '_blank')}
        className="w-full"
      >
        {opportunity.apply_button_text || 'Apply Now'}
      </Button>
      <Button variant="outline">
        Learn More
      </Button>
    </div>
  </CardContent>
</Card>
```

#### 3. Update Timetable Page to Show Recommendations

```typescript
// After timetable upload success
const getRecommendations = async (extractedCourses) => {
  const response = await fetch(`${API_URL}/api/v1/timetable/get-recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      courses: extractedCourses.map(c => c.name),
      user_profile: {
        currentYear: user.currentYear || 2,
        skills: user.skills || [],
        occupation: user.occupation
      },
      limit: 20
    })
  });
  
  const data = await response.json();
  setRecommendations(data.data.courses);
};

// Display recommendations
<div className="mt-6">
  <h3>Recommended Courses Based on Your Timetable</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {recommendations.map(course => (
      <Card key={course.title}>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <Badge>{course.provider}</Badge>
          <Badge variant="outline">{course.match_percentage}% Match</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{course.description}</p>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Duration: {course.duration} | Level: {course.level}
            </p>
            <p className="text-xs text-muted-foreground">
              Rating: {course.rating}/5 | Students: {course.students}
            </p>
          </div>
          <Button 
            className="w-full mt-4"
            onClick={() => window.open(course.apply_url, '_blank')}
          >
            {course.apply_button_text}
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

---

## 📊 Course Database Structure

Each course includes:
- `title`: Course name
- `provider`: Platform (Coursera, Udemy, etc.)
- `instructor`: Instructor/University name
- `url`: Course page URL
- `apply_url`: Direct enrollment URL
- `description`: Course description
- `duration`: Time to complete
- `level`: Beginner/Intermediate/Advanced
- `rating`: User rating (out of 5)
- `students`: Number of enrolled students
- `price`: Cost information
- `skills`: Array of skills taught
- `year_suitable`: Array of suitable years [1, 2, 3, 4]
- `category`: Course category
- `can_apply`: Boolean for apply button
- `apply_button_text`: Button text
- `match_percentage`: Relevance score (0-100)

---

## 🎯 Matching Algorithm

The system scores courses based on:

1. **Skill Match (30%)**: Overlap between user skills and course skills
2. **Level Match (20%)**: Beginner/Intermediate/Advanced alignment
3. **Course Relevance (30%)**: Keywords from timetable courses
4. **Rating Bonus (20%)**: Higher-rated courses get priority

**Example:**
- User has skills: ["Python", "JavaScript"]
- Course teaches: ["Python", "Machine Learning", "TensorFlow"]
- Skill overlap: 1 skill → 0.3 points
- Level match: Both Intermediate → 0.2 points
- Timetable has "Data Science" → 0.15 points
- Course rating: 4.8/5 → 0.19 points
- **Total Score: 0.84 (84% match)**

---

## 🔄 API Integration Flow

```
1. User uploads timetable
   ↓
2. AI extracts courses (e.g., "Data Structures", "Web Dev")
   ↓
3. Frontend calls /get-recommendations with:
   - Extracted courses
   - User profile (year, skills)
   - Limit (how many recommendations)
   ↓
4. Backend:
   - Extracts keywords from courses
   - Filters by user's year
   - Scores all courses
   - Returns top N matches
   ↓
5. Frontend displays:
   - Course cards with details
   - Apply buttons with direct links
   - Match percentage badges
   - Internship opportunities
```

---

## 📝 Testing the New Features

### Test 1: More Opportunities
1. Go to Opportunities page
2. Should see 20-30 courses (not just 9)
3. Courses should match your year level
4. Each course has "Apply Now" or "Enroll Now" button

### Test 2: Timetable Recommendations
1. Upload a timetable with courses like:
   - "Data Structures"
   - "Web Development"
   - "Machine Learning"
2. After upload, scroll down
3. Should see "Recommended Courses" section
4. Should show 15-20 relevant courses
5. Each has apply button that opens course page

### Test 3: Year-Based Filtering
1. Set your year to "1st Year" in profile
2. Go to Opportunities
3. Should see beginner courses (Python basics, Web fundamentals)
4. Change year to "4th Year"
5. Should see advanced courses (Deep Learning, System Design)

---

## 🚀 Next Steps to Complete Implementation

### 1. Update Opportunities.tsx
```typescript
// Add state for more opportunities
const [opportunities, setOpportunities] = useState([]);
const [loading, setLoading] = useState(true);
const [filter, setFilter] = useState('all'); // all, courses, internships

// Fetch from new endpoint
useEffect(() => {
  fetchEnhancedOpportunities();
}, [user]);

const fetchEnhancedOpportunities = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/timetable/get-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courses: user.courses || [],
        user_profile: {
          currentYear: user.currentYear || 2,
          skills: user.skills || [],
          occupation: user.occupation || 'Student'
        },
        limit: 30
      })
    });
    
    const data = await response.json();
    setOpportunities([
      ...data.data.courses,
      ...data.data.internships
    ]);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
  } finally {
    setLoading(false);
  }
};
```

### 2. Update Timetable.tsx
Add recommendations section after successful upload:

```typescript
const [recommendations, setRecommendations] = useState([]);

// After timetable upload success
const handleUploadSuccess = async (extractedCourses) => {
  // ... existing code ...
  
  // Get recommendations
  await fetchRecommendations(extractedCourses);
};

const fetchRecommendations = async (courses) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/timetable/get-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courses: courses.map(c => c.name),
        user_profile: {
          currentYear: user.currentYear || 2,
          skills: user.skills || [],
          occupation: user.occupation
        },
        limit: 20
      })
    });
    
    const data = await response.json();
    setRecommendations(data.data.courses);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
};
```

---

## 📦 Files Modified

1. **Backend:**
   - `ai-backend/app/services/opportunity_scraper.py` - Added 50+ courses, year filtering, internships
   - `ai-backend/app/routers/timetable_extraction.py` - Added `/get-recommendations` endpoint

2. **Frontend (To be updated):**
   - `src/pages/Opportunities.tsx` - Fetch from new endpoint, show more courses
   - `src/pages/Timetable.tsx` - Add recommendations section with apply buttons

---

## ✅ Summary

**What's Working:**
- ✅ 50+ real courses in database
- ✅ Year-based filtering (1st-4th year)
- ✅ 10+ internship opportunities
- ✅ New API endpoint for recommendations
- ✅ Apply buttons with direct links
- ✅ Match percentage scoring

**What Needs Frontend Update:**
- Update Opportunities page to call new endpoint
- Add recommendations section to Timetable page
- Add apply buttons to opportunity cards
- Show match percentage badges

**Result:**
- Users will see 20-30 courses instead of 9
- Courses filtered by their year level
- Direct apply buttons on each course
- Timetable recommendations with 15-20 relevant courses
- All opportunities have real URLs to apply

---

**Implementation Date:** November 15, 2025  
**Status:** Backend Complete ✅ | Frontend Updates Needed 🔄  
**Next Step:** Update Opportunities.tsx and Timetable.tsx with new API calls

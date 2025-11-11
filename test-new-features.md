# 🧪 Testing Guide - New Features

## Quick Test Checklist

### ✅ Test 1: Timetable Storage

**Steps**:
1. Start all services (MongoDB, Frontend, Backend, AI Backend)
2. Login to the application
3. Go to Timetable page
4. Upload a timetable (PDF or image)
5. Wait for processing

**Expected Results**:
- ✅ Timetable is displayed on screen
- ✅ Toast notification appears: "Timetable Saved!"
- ✅ Courses are extracted and shown
- ✅ Data is saved to database

**Verify in Database**:
```bash
mongosh
use edu-career-ai
db.users.findOne({ email: "your-email" }, { timetable: 1, courses: 1 })
```

---

### ✅ Test 2: Course Recommendations

**Steps**:
1. After uploading timetable (Test 1)
2. Wait 2-3 seconds
3. Go to Notifications page

**Expected Results**:
- ✅ New notification appears
- ✅ Title: "New Course Recommendations Available!"
- ✅ Description mentions number of courses found
- ✅ Type: certification

**Verify**:
- Check browser console for: "Course recommendations fetched"
- Check AI backend logs for recommendation request

---

### ✅ Test 3: Real Notifications (No Fake Data)

**Steps**:
1. Go to Notifications page
2. Check what notifications are displayed

**Expected Results**:
- ✅ Only real notifications from database
- ✅ No hardcoded fake notifications
- ✅ If no notifications, page shows "No notifications yet"
- ✅ Loading spinner appears while fetching

**Verify**:
```bash
# Check notifications in database
mongosh
use edu-career-ai
db.notifications.find({ userId: ObjectId("YOUR_USER_ID") })
```

---

### ✅ Test 4: Mark as Read

**Steps**:
1. Go to Notifications page
2. Click on an unread notification (has blue dot)
3. Observe the change

**Expected Results**:
- ✅ Blue dot disappears
- ✅ Notification text becomes lighter
- ✅ Unread count decreases
- ✅ Refresh page - notification stays marked as read

---

### ✅ Test 5: Mark All as Read

**Steps**:
1. Go to Notifications page
2. Ensure you have unread notifications
3. Click "Mark all read" button

**Expected Results**:
- ✅ All notifications marked as read
- ✅ Unread count becomes 0
- ✅ "Mark all read" button disappears
- ✅ All blue dots disappear

---

## 🔍 Detailed Testing

### Test Timetable API Endpoints

#### 1. Save Timetable
```bash
# Login first to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  | jq -r '.token')

# Save timetable
curl -X POST http://localhost:5000/api/users/timetable \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "timetable": [
      {
        "day": "Monday",
        "date": "2025-11-10",
        "classes": [
          {
            "id": "1",
            "subject": "Data Structures",
            "professor": "Dr. Smith",
            "room": "CS-101",
            "time": "09:00",
            "duration": 90,
            "type": "lecture",
            "difficulty": "hard"
          }
        ]
      }
    ],
    "courses": ["Data Structures", "Algorithms", "Web Development"]
  }'
```

**Expected Response**:
```json
{
  "message": "Timetable saved successfully",
  "timetable": [...],
  "courses": ["Data Structures", "Algorithms", "Web Development"]
}
```

#### 2. Get Timetable
```bash
curl http://localhost:5000/api/users/timetable \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
```json
{
  "timetable": [...],
  "courses": [...]
}
```

---

### Test Notifications API Endpoints

#### 1. Get Notifications
```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
```json
{
  "notifications": [
    {
      "id": "...",
      "title": "New Course Recommendations Available!",
      "description": "Based on your timetable...",
      "type": "certification",
      "read": false,
      "timestamp": "2 hours ago",
      "createdAt": "2025-11-10T10:30:00.000Z"
    }
  ]
}
```

#### 2. Create Notification
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Notification",
    "description": "This is a test notification",
    "type": "reminder"
  }'
```

#### 3. Mark as Read
```bash
# Get notification ID from previous response
NOTIF_ID="your-notification-id"

curl -X PUT http://localhost:5000/api/notifications/$NOTIF_ID/read \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Mark All as Read
```bash
curl -X PUT http://localhost:5000/api/notifications/read-all \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Troubleshooting

### Issue: Notifications not appearing

**Check**:
1. Is backend running? `curl http://localhost:5000/api/health`
2. Are you logged in? Check localStorage for token
3. Check browser console for errors
4. Check backend logs

**Solution**:
```bash
# Check if notifications exist in database
mongosh
use edu-career-ai
db.notifications.find()
```

### Issue: Timetable not saving

**Check**:
1. Is MongoDB running? `mongosh`
2. Is backend running?
3. Check browser console for errors
4. Check network tab for failed requests

**Solution**:
```bash
# Check backend logs
cd server
npm run dev
# Look for errors in console
```

### Issue: No course recommendations

**Check**:
1. Is AI backend running? `curl http://localhost:8000/health`
2. Check AI backend logs
3. Verify timetable has courses

**Solution**:
```bash
# Test AI backend directly
curl -X POST http://localhost:8000/api/v1/recommendations/personalized \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test",
    "courses": ["Data Structures"],
    "include_courses": true,
    "limit": 10
  }'
```

---

## ✅ Success Criteria

All tests pass if:

1. ✅ Timetable uploads successfully
2. ✅ Toast notification appears after upload
3. ✅ Timetable is saved to database
4. ✅ Courses are extracted correctly
5. ✅ Course recommendations are fetched
6. ✅ Notification is created automatically
7. ✅ Notifications page shows real data (not fake)
8. ✅ Mark as read works
9. ✅ Mark all as read works
10. ✅ Data persists after page refresh

---

## 📊 Performance Benchmarks

**Expected Times**:
- Timetable upload: 2-5 seconds (depending on file size)
- Save to database: < 500ms
- Fetch recommendations: 2-3 seconds
- Create notification: < 200ms
- Load notifications: < 500ms
- Mark as read: < 200ms

---

## 🎯 What to Look For

### In Browser Console
```
✅ "Saving timetable to database:"
✅ "Timetable saved successfully"
✅ "Course recommendations fetched:"
✅ No error messages
```

### In Backend Logs
```
✅ POST /api/users/timetable 200
✅ POST /api/notifications 200
✅ GET /api/notifications 200
✅ No 500 errors
```

### In AI Backend Logs
```
✅ POST /api/v1/recommendations/personalized
✅ "Processing recommendation request"
✅ No errors
```

---

## 📸 Screenshots to Verify

1. **Timetable Upload Success**
   - Toast notification visible
   - Courses displayed
   - No errors

2. **Notifications Page**
   - Real notifications shown
   - Unread count visible
   - Blue dots on unread items

3. **Database Verification**
   - User document has timetable field
   - User document has courses array
   - Notifications collection has entries

---

**Ready to test!** Follow the checklist above and verify each feature works as expected.

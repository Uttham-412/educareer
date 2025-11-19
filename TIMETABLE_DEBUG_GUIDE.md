# 🔍 Timetable Persistence - Debug Guide

## How to Debug the Issue

I've added detailed console logging to help identify why the timetable isn't persisting. Follow these steps:

### Step 1: Open Browser Console
1. Open your browser (Chrome/Edge/Firefox)
2. Press `F12` or `Ctrl+Shift+I` to open Developer Tools
3. Click on the "Console" tab

### Step 2: Upload a Timetable
1. Go to the Timetable page
2. Upload a CSV file with subjects
3. Watch the console for these messages:

**Expected Console Output:**
```
🔄 Attempting to save timetable to database...
Schedule data: [array of schedule objects]
Token found: true
Extracted courses: [array of course names]
Sending payload to backend: {timetable: [...], courses: [...]}
Response status: 200
✅ Timetable saved successfully to database: {message: "...", timetable: [...]}
```

**If you see errors:**
- `❌ No authentication token found` → You're not logged in
- `Response status: 401` → Token is invalid
- `Response status: 500` → Server error
- `❌ Failed to save timetable` → Check the error details

### Step 3: Refresh the Page
1. Refresh the page (F5)
2. Watch the console for these messages:

**Expected Console Output:**
```
🔄 Loading saved timetable...
Token found for loading: true
Load response status: 200
Loaded data from backend: {timetable: [...], courses: [...]}
✅ Timetable found, setting state
```

**If you see:**
- `No token, skipping load` → You're not logged in
- `No timetable data found in response` → Timetable wasn't saved
- `Failed to load timetable: 401` → Token is invalid

---

## Common Issues & Solutions

### Issue 1: "No authentication token found"
**Problem**: You're not logged in or token is missing

**Solution**:
1. Log out completely
2. Log back in
3. Try uploading again

### Issue 2: "Response status: 401"
**Problem**: Token is invalid or expired

**Solution**:
1. Clear browser cache
2. Log out and log back in
3. Try again

### Issue 3: "No timetable data found in response"
**Problem**: Timetable was saved but returned as null/empty

**Check**:
1. Look at the "Loaded data from backend" log
2. See if `timetable` field is null or empty array
3. If so, the save might have failed silently

### Issue 4: Backend not running
**Problem**: Can't connect to http://localhost:5000

**Solution**:
1. Check if backend server is running
2. Look for "Server running on port 5000" message
3. Restart backend if needed

---

## Manual Database Check

If you want to check the database directly:

### Using MongoDB Compass or mongosh:
```javascript
// Connect to database
use educareer

// Find your user
db.users.findOne({ email: "your-email@example.com" })

// Check if timetable field exists and has data
db.users.findOne(
  { email: "your-email@example.com" },
  { timetable: 1, courses: 1 }
)
```

---

## What to Look For

### 1. During Upload (Save):
- ✅ Token is found
- ✅ Payload is sent with timetable data
- ✅ Response status is 200
- ✅ Success message appears

### 2. During Page Load:
- ✅ Token is found
- ✅ Response status is 200
- ✅ Data contains timetable array
- ✅ Timetable is set in state

---

## Send Me This Information

If it's still not working, send me:

1. **Console logs** from upload:
   - All messages starting with 🔄, ✅, or ❌
   - Response status
   - Any error messages

2. **Console logs** from page refresh:
   - Loading messages
   - Response status
   - Loaded data structure

3. **Network tab** (optional):
   - Open Network tab in DevTools
   - Filter by "timetable"
   - Check the POST and GET requests
   - Look at Request/Response data

---

## Quick Test

Try this simple test:

1. **Upload** a CSV with just one subject:
   ```csv
   Subject
   Test Subject
   ```

2. **Check console** - should see "✅ Timetable saved successfully"

3. **Refresh page** - should see "✅ Timetable found, setting state"

4. **If step 3 fails**, check what "Loaded data from backend" shows

---

## Backend Logs

Also check the backend terminal for:
- "Timetable saved successfully" message
- Any error messages
- MongoDB connection status

---

With these logs, we can identify exactly where the issue is!

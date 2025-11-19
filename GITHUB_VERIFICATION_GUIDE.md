# Portfolio Verification Guide

## Overview
The Dashboard now includes two verification buttons in the hero section:
1. **Upload GitHub Project** - Verify GitHub repositories
2. **Upload Certification** - Verify certifications from various platforms

## Features Added

### Frontend (Dashboard)
- **Two Buttons in Hero Section**: 
  - Purple "Upload GitHub Project" button
  - Blue "Upload Certification" button
- **Modal Dialogs**: Clean UI for entering URLs and details
- **Validation**: Client-side URL format validation
- **Real-time Feedback**: Loading states and toast notifications

### Backend (AI Service)

#### GitHub Verification
- **Endpoint**: `POST /api/v1/portfolio/verify-github`
- **Verification**: Uses GitHub API to verify repository
- **Metrics Collected**:
  - Repository exists and is public
  - Stars, forks, language
  - Commit count and activity
  - Description and metadata
  - Confidence score (0-100%)

#### Certification Verification
- **Endpoint**: `POST /api/v1/portfolio/verify-certification`
- **Supported Platforms**:
  - Coursera, edX, Udemy
  - LinkedIn Learning
  - Credly, Badgr (Digital Badges)
  - Generic URL verification
- **Verification Methods**:
  - URL pattern matching
  - HTTP accessibility checks
  - Platform-specific validation
  - Confidence scoring

## How to Use

### 1. Start the AI Backend
```powershell
cd educareer/ai-backend
python -m uvicorn main:app --reload --port 8000
```

### 2. (Optional) Add GitHub Token
For higher API rate limits, add a GitHub Personal Access Token to `.env`:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

To create a token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scope: `public_repo` (read-only)
4. Copy the token to your `.env` file

### 3. Test the Features

#### GitHub Verification
1. Open the Dashboard
2. Click "Upload GitHub Project" button (purple) in the hero section
3. Enter a GitHub repository URL (e.g., `https://github.com/username/repo`)
4. Click "Verify Project"
5. See the verification results in a toast notification

#### Certification Verification
1. Open the Dashboard
2. Click "Upload Certification" button (blue) in the hero section
3. Enter certification title (e.g., "AWS Certified Solutions Architect")
4. Enter certification URL (e.g., `https://coursera.org/verify/...`)
5. Click "Verify Certification"
6. See the verification results in a toast notification

## Verification Criteria

### GitHub Projects
- ✅ Repository exists and is accessible
- ✅ Repository is public (not private)
- ✅ Has commits (shows activity)
- ✅ Has description and metadata
- ✅ Programming language used
- ✅ Stars and forks (popularity)

### Certifications
- ✅ URL is accessible
- ✅ Platform is recognized (Coursera, edX, etc.)
- ✅ Certificate page exists
- ✅ URL pattern matches known certificate formats
- ✅ Platform-specific validation

## Confidence Score
- **90%+**: Active project with multiple commits
- **70-89%**: Valid project with some activity
- **50-69%**: Basic project, minimal activity
- **Below 50%**: Repository found but limited content

## API Response Example

```json
{
  "success": true,
  "message": "GitHub project verified successfully! Confidence: 85%",
  "verified": true,
  "confidence_score": 0.85,
  "metadata": {
    "stars": 42,
    "forks": 12,
    "language": "TypeScript",
    "description": "An awesome project",
    "commits": 156,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-11-19T08:45:00Z"
  }
}
```

## Error Handling

The system handles:
- Invalid URL format
- Private repositories
- Non-existent repositories
- GitHub API rate limits
- Network errors

## Future Enhancements

Potential improvements:
- Save verified projects to user profile
- Display verified projects on resume
- Code quality analysis
- README quality check
- Test coverage verification
- CI/CD pipeline detection

# 📁 Project Structure

## Frontend (React + TypeScript)
```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── AuthRedirect.tsx  # Route protection and redirects
│   │   └── ProtectedRoute.tsx # Protected route wrapper
│   ├── dashboard/            # Dashboard components
│   │   ├── DashboardStats.tsx # User statistics
│   │   └── NewUserWelcome.tsx # New user onboarding
│   ├── layout/               # Layout components
│   ├── opportunities/        # Job/internship components
│   ├── profile/              # Profile management
│   │   └── StudentProfileOnboarding.tsx # 3-step onboarding
│   └── ui/                   # Reusable UI components
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── hooks/                    # Custom React hooks
├── integrations/
│   └── supabase/            # Supabase client configuration
├── lib/                     # Utility functions
└── pages/                   # Main application pages
    ├── Auth.tsx             # Login/signup page
    ├── Dashboard.tsx        # Main dashboard
    ├── Student.tsx          # Student profile page
    ├── Account.tsx          # Account settings
    ├── Timetable.tsx        # Class schedules
    ├── Resume.tsx           # Resume builder
    ├── Opportunities.tsx    # Job/internship listings
    └── Notifications.tsx    # User notifications
```

## Backend (Supabase)
```
supabase/
├── functions/               # Edge Functions (Serverless APIs)
│   ├── ai-recommendations/  # AI-powered recommendations
│   ├── auto-resume-builder/ # Automated resume generation
│   ├── skill-tracker/       # Skill tracking and analysis
│   ├── job-matching/        # Job opportunity matching
│   ├── generate-resume/     # Resume formatting
│   └── send-notification/   # Notification system
├── migrations/              # Database schema migrations
│   ├── 20250927041013_*.sql # Original profiles setup
│   ├── 20241027000000_*.sql # Core backend tables
│   ├── 20241027000001_*.sql # Sample data
│   ├── 20241027000002_*.sql # AI features tables
│   ├── 20241027000003_*.sql # AI functions
│   └── 20241027000006_*.sql # Extended student profile
└── config.toml             # Supabase configuration
```

## Utility Folders
```
docs/                        # Project documentation
├── README.md               # Original project readme
└── PROJECT_STRUCTURE.md   # This file

scripts/                    # Deployment and utility scripts
└── deploy-backend.bat     # Backend deployment script

temp/                       # Temporary files
└── apply_ai_features_manually.sql # Manual SQL for troubleshooting
```

## Key Features
- **AI-Powered Recommendations** - Personalized career guidance
- **Automated Resume Building** - Continuous updates from activities
- **Student Profile Management** - Comprehensive onboarding system
- **Real-time Notifications** - Instant updates and alerts
- **Skill Tracking** - AI-powered skill development monitoring
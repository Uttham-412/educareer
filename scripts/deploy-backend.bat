@echo off
echo Deploying Backend...
echo.

echo 1. Applying database migrations...
supabase db push
if %errorlevel% neq 0 (
    echo ERROR: Database migration failed!
    pause
    exit /b 1
)

echo.
echo 2. Deploying Edge Functions...
supabase functions deploy send-notification
supabase functions deploy generate-resume
supabase functions deploy job-matching
supabase functions deploy ai-recommendations
supabase functions deploy auto-resume-builder
supabase functions deploy skill-tracker

echo.
echo 3. Checking deployment status...
supabase functions list

echo.
echo ✅ Backend deployment complete!
echo.
echo Next steps:
echo 1. Start your frontend: npm run dev
echo 2. Visit: http://localhost:5173/test-backend
echo 3. Run the backend tests
echo.
pause
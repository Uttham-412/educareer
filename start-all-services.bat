@echo off
REM Start All EduCareer AI Services
REM Right-click this file and select "Run as Administrator"

echo ========================================
echo   EduCareer AI - Service Startup
echo ========================================
echo.

REM Start MongoDB
echo [1/4] Starting MongoDB...
net start MongoDB
if %errorlevel% equ 0 (
    echo      MongoDB: STARTED
) else (
    echo      MongoDB: FAILED or ALREADY RUNNING
)
echo.

REM Wait for MongoDB to initialize
timeout /t 3 /nobreak >nul

REM Start Node.js Backend
echo [2/4] Starting Node.js Backend...
start "EduCareer Backend" cmd /k "cd /d %~dp0server && npm run dev"
echo      Backend server starting on port 5000...
echo.

REM Start AI Backend
echo [3/4] Starting AI Backend...
start "EduCareer AI Backend" cmd /k "cd /d %~dp0ai-backend && python main.py"
echo      AI Backend starting on port 8000...
echo.

REM Start Frontend
echo [4/4] Starting Frontend...
start "EduCareer Frontend" cmd /k "cd /d %~dp0 && npm run dev"
echo      Frontend starting on port 8080...
echo.

echo ========================================
echo   All services are starting!
echo ========================================
echo.
echo Services:
echo   - MongoDB:        localhost:27017
echo   - Backend:        http://localhost:5000
echo   - AI Backend:     http://localhost:8000
echo   - Frontend:       http://localhost:8080
echo.
echo Wait 10-15 seconds for all services to start
echo Then open: http://localhost:8080
echo.
pause

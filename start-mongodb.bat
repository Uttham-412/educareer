@echo off
REM Start MongoDB Service
REM Right-click this file and select "Run as Administrator"

echo Starting MongoDB Service...

net start MongoDB

if %errorlevel% equ 0 (
    echo.
    echo MongoDB started successfully!
    echo MongoDB is now running on port 27017
    echo You can now use the application!
) else (
    echo.
    echo Failed to start MongoDB
    echo Please ensure:
    echo 1. MongoDB is installed
    echo 2. You're running this script as Administrator
    echo 3. MongoDB service is configured properly
)

echo.
pause

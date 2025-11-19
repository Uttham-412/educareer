@echo off
echo Starting MongoDB Service...
net start MongoDB
if %errorlevel% == 0 (
    echo MongoDB started successfully!
) else (
    echo Failed to start MongoDB. Please run this file as Administrator.
    echo Right-click this file and select "Run as administrator"
)
pause

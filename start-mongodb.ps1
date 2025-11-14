# Start MongoDB Service
# Right-click this file and select "Run with PowerShell as Administrator"

Write-Host "Starting MongoDB Service..." -ForegroundColor Cyan

try {
    # Try to start the MongoDB service
    Start-Service -Name MongoDB -ErrorAction Stop
    Write-Host "✓ MongoDB started successfully!" -ForegroundColor Green
    
    # Wait a moment for the service to fully start
    Start-Sleep -Seconds 2
    
    # Check the service status
    $service = Get-Service -Name MongoDB
    Write-Host "MongoDB Status: $($service.Status)" -ForegroundColor Yellow
    
    if ($service.Status -eq "Running") {
        Write-Host "`n✓ MongoDB is now running on port 27017" -ForegroundColor Green
        Write-Host "You can now use the application!" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Failed to start MongoDB: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nTrying alternative method..." -ForegroundColor Yellow
    
    try {
        # Try using net start command
        $result = net start MongoDB 2>&1
        Write-Host $result
        Write-Host "`n✓ MongoDB started successfully!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to start MongoDB" -ForegroundColor Red
        Write-Host "`nPlease ensure:" -ForegroundColor Yellow
        Write-Host "1. MongoDB is installed" -ForegroundColor White
        Write-Host "2. You're running this script as Administrator" -ForegroundColor White
        Write-Host "3. MongoDB service is configured properly" -ForegroundColor White
    }
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

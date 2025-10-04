# Expense Management - Quick Start Script
# This script starts both backend and frontend servers

Write-Host "🚀 Starting Expense Management System..." -ForegroundColor Green
Write-Host ""

# Check if backend exists
if (-not (Test-Path "Backend")) {
    Write-Host "❌ Backend folder not found!" -ForegroundColor Red
    exit 1
}

# Check if frontend exists
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Frontend folder not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Checking Backend dependencies..." -ForegroundColor Yellow
Set-Location Backend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Backend dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "📦 Checking Frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Frontend dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "✅ Dependencies ready!" -ForegroundColor Green
Write-Host ""

# Go back to root
Set-Location ..

Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
Write-Host "   Backend will run on http://localhost:5000" -ForegroundColor Gray

# Start backend in new window
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm run start:dev" -PassThru

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "   Frontend will run on http://localhost:3000" -ForegroundColor Gray

# Start frontend in new window
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✨ Expense Management System is starting!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - INTEGRATION_SUMMARY.md  - Quick overview" -ForegroundColor Gray
Write-Host "   - frontend/INTEGRATION_GUIDE.md - Detailed guide" -ForegroundColor Gray
Write-Host "   - Backend/API_REFERENCE.md - API docs" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 To stop servers: Close the terminal windows or press Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to open browser..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✅ Browser opened! Happy coding! 🎉" -ForegroundColor Green

# Expense Management System - Installation Script for Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Expense Management System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "✓ MongoDB service found" -ForegroundColor Green
    if ($mongoService.Status -eq 'Running') {
        Write-Host "✓ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "! MongoDB is not running. Starting MongoDB..." -ForegroundColor Yellow
        try {
            Start-Service MongoDB
            Write-Host "✓ MongoDB started successfully" -ForegroundColor Green
        } catch {
            Write-Host "! Could not start MongoDB. Please start it manually." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "! MongoDB service not found" -ForegroundColor Yellow
    Write-Host "Please install MongoDB from https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Creating upload directories..." -ForegroundColor Yellow
if (-not (Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads" | Out-Null
    New-Item -ItemType Directory -Path "uploads\receipts" | Out-Null
    Write-Host "✓ Upload directories created" -ForegroundColor Green
} else {
    Write-Host "✓ Upload directories already exist" -ForegroundColor Green
}

Write-Host ""
Write-Host "Checking .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created from .env.example" -ForegroundColor Green
    Write-Host "! Please edit .env file with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review and update .env file with your settings" -ForegroundColor White
Write-Host "2. Set up Google Vision API credentials (optional, for OCR)" -ForegroundColor White
Write-Host "3. Configure email settings for notifications" -ForegroundColor White
Write-Host "4. Run: npm run start:dev" -ForegroundColor White
Write-Host "5. Open: http://localhost:3000/api/docs" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

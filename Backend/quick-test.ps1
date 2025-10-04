# Quick API Test - Signup Only
# Run this to quickly test signup and get a token

$baseUrl = "http://localhost:3000/api"

Write-Host "Testing Signup..." -ForegroundColor Cyan

$timestamp = Get-Date -Format "MMddHHmmss"
$body = @{
    name = "John Doe"
    email = "john$timestamp@example.com"
    password = "Test@123"
    country = "United States"
} | ConvertTo-Json

Write-Host "Request Body:" -ForegroundColor Yellow
Write-Host $body -ForegroundColor White
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Full Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor White
    Write-Host ""
    
    if ($response.user) {
        Write-Host "User Details:" -ForegroundColor Cyan
        Write-Host "  Name: $($response.user.name)" -ForegroundColor White
        Write-Host "  Email: $($response.user.email)" -ForegroundColor White
        Write-Host "  Role: $($response.user.role)" -ForegroundColor White
        Write-Host "  User ID: $($response.user.id)" -ForegroundColor White
        Write-Host "  Company ID: $($response.user.companyId)" -ForegroundColor White
        Write-Host ""
    }
    
    if ($response.accessToken) {
        Write-Host "Access Token:" -ForegroundColor Cyan
        Write-Host $response.accessToken -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Copy this token to use in Swagger:" -ForegroundColor Green
        Write-Host "Bearer $($response.accessToken)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

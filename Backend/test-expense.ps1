# Test Expense Creation with Token

# Get fresh token first
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Expense Creation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"

# Step 1: Get a fresh token
Write-Host "Step 1: Getting fresh authentication token..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "MMddHHmmss"
$signupBody = @{
    name = "Test User"
    email = "test$timestamp@example.com"
    password = "Test@123"
    country = "United States"
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    $token = $authResponse.data.accessToken
    Write-Host "SUCCESS! Token obtained" -ForegroundColor Green
    Write-Host "Token: $token" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "FAILED to get token!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Create an expense using the token
Write-Host "Step 2: Creating expense with authorization..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$expenseBody = @{
    amount = 150.50
    originalCurrency = "USD"
    category = "Travel"
    description = "Taxi to client meeting"
    expenseDate = "2025-10-04"
    paidBy = "Personal"
    remarks = "Business trip"
} | ConvertTo-Json

try {
    $expenseResponse = Invoke-RestMethod -Uri "$baseUrl/expenses" -Method Post -Body $expenseBody -Headers $headers
    
    Write-Host "SUCCESS! Expense created" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $expenseResponse | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor White
    Write-Host ""
    
    if ($expenseResponse.data) {
        $expense = $expenseResponse.data
        Write-Host "Expense Details:" -ForegroundColor Cyan
        Write-Host "  ID: $($expense._id)" -ForegroundColor White
        Write-Host "  Amount: $($expense.amount) $($expense.originalCurrency)" -ForegroundColor White
        Write-Host "  Converted: $($expense.convertedAmount) $($expense.baseCurrency)" -ForegroundColor White
        Write-Host "  Category: $($expense.category)" -ForegroundColor White
        Write-Host "  Status: $($expense.status)" -ForegroundColor White
        Write-Host "  Description: $($expense.description)" -ForegroundColor White
        Write-Host "  Paid By: $($expense.paidBy)" -ForegroundColor White
    }
    
} catch {
    Write-Host "FAILED to create expense!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "TO USE IN SWAGGER:" -ForegroundColor Yellow
Write-Host "1. Click the green 'Authorize' button (lock icon)" -ForegroundColor White
Write-Host "2. Paste this EXACT text:" -ForegroundColor White
Write-Host "   Bearer $token" -ForegroundColor Yellow
Write-Host "3. Click 'Authorize' then 'Close'" -ForegroundColor White
Write-Host "4. Try creating expense again in Swagger" -ForegroundColor White
Write-Host ""

# Expense Management API Testing Script
# Make sure the server is running on http://localhost:3000

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Expense Management API - Testing Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"

# Test 1: Sign Up (Create Company + Admin User)
Write-Host "1. Testing Signup..." -ForegroundColor Yellow
$signupBody = @{
    name = "John Doe"
    email = "john@example.com"
    password = "Test@123"
    country = "United States"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host "✓ Signup successful!" -ForegroundColor Green
    Write-Host "User ID: $($signupResponse.user.id)" -ForegroundColor White
    Write-Host "Company ID: $($signupResponse.user.companyId)" -ForegroundColor White
    $token = $signupResponse.accessToken
    Write-Host "Access Token: $token" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "✗ Signup failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    $token = $null
}

# Test 2: Sign In
Write-Host "2. Testing Signin..." -ForegroundColor Yellow
$signinBody = @{
    email = "john@example.com"
    password = "Test@123"
} | ConvertTo-Json

try {
    $signinResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signin" -Method Post -Body $signinBody -ContentType "application/json"
    Write-Host "✓ Signin successful!" -ForegroundColor Green
    $token = $signinResponse.accessToken
    Write-Host "Access Token: $token" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "✗ Signin failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

if ($token) {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    # Test 3: Create Manager User
    Write-Host "3. Creating Manager User..." -ForegroundColor Yellow
    $managerBody = @{
        name = "Jane Manager"
        email = "jane@example.com"
        password = "Manager@123"
        role = "Manager"
    } | ConvertTo-Json

    try {
        $managerResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method Post -Body $managerBody -ContentType "application/json" -Headers $headers
        Write-Host "✓ Manager created!" -ForegroundColor Green
        Write-Host "Manager ID: $($managerResponse._id)" -ForegroundColor White
        $managerId = $managerResponse._id
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to create manager: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        $managerId = $null
    }

    # Test 4: Create Employee User
    Write-Host "4. Creating Employee User..." -ForegroundColor Yellow
    $employeeBody = @{
        name = "Bob Employee"
        email = "bob@example.com"
        password = "Employee@123"
        role = "Employee"
    } | ConvertTo-Json

    try {
        $employeeResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method Post -Body $employeeBody -ContentType "application/json" -Headers $headers
        Write-Host "✓ Employee created!" -ForegroundColor Green
        Write-Host "Employee ID: $($employeeResponse._id)" -ForegroundColor White
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to create employee: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }

    # Test 5: Get All Users
    Write-Host "5. Getting All Users..." -ForegroundColor Yellow
    try {
        $users = Invoke-RestMethod -Uri "$baseUrl/users" -Method Get -Headers $headers
        Write-Host "✓ Found $($users.Length) users" -ForegroundColor Green
        foreach ($user in $users) {
            Write-Host "  - $($user.name) ($($user.role)) - $($user.email)" -ForegroundColor White
        }
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to get users: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }

    # Test 6: Create Expense
    Write-Host "6. Creating Expense..." -ForegroundColor Yellow
    $expenseBody = @{
        amount = 150.50
        originalCurrency = "USD"
        category = "Travel"
        description = "Taxi to client meeting"
        expenseDate = "2025-10-04"
        paidBy = "Personal"
        remarks = "Urgent client visit"
    } | ConvertTo-Json

    try {
        $expenseResponse = Invoke-RestMethod -Uri "$baseUrl/expenses" -Method Post -Body $expenseBody -ContentType "application/json" -Headers $headers
        Write-Host "✓ Expense created!" -ForegroundColor Green
        Write-Host "Expense ID: $($expenseResponse._id)" -ForegroundColor White
        Write-Host "Status: $($expenseResponse.status)" -ForegroundColor White
        Write-Host "Amount: $($expenseResponse.amount) $($expenseResponse.originalCurrency)" -ForegroundColor White
        $expenseId = $expenseResponse._id
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to create expense: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        $expenseId = $null
    }

    # Test 7: Get All Expenses
    Write-Host "7. Getting All Expenses..." -ForegroundColor Yellow
    try {
        $expenses = Invoke-RestMethod -Uri "$baseUrl/expenses" -Method Get -Headers $headers
        Write-Host "✓ Found $($expenses.Length) expenses" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to get expenses: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }

    # Test 8: Create Approval Rule
    if ($managerId) {
        Write-Host "8. Creating Approval Rule..." -ForegroundColor Yellow
        $ruleBody = @{
            ruleName = "Standard Expense Approval"
            approvers = @(
                @{
                    user = $managerId
                    sequenceOrder = 1
                    required = $true
                }
            )
            isManagerApprover = $false
            sequenceMatters = $false
            minimumApprovalPercentage = 100
        } | ConvertTo-Json -Depth 10

        try {
            $ruleResponse = Invoke-RestMethod -Uri "$baseUrl/approval-rules" -Method Post -Body $ruleBody -ContentType "application/json" -Headers $headers
            Write-Host "✓ Approval rule created!" -ForegroundColor Green
            Write-Host "Rule ID: $($ruleResponse._id)" -ForegroundColor White
            Write-Host ""
        } catch {
            Write-Host "✗ Failed to create approval rule: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
        }
    }

    # Test 9: Test Currency Conversion
    Write-Host "9. Testing Currency Conversion..." -ForegroundColor Yellow
    try {
        $rate = Invoke-RestMethod -Uri "$baseUrl/currency/exchange-rate?from=USD&to=EUR" -Method Get -Headers $headers
        Write-Host "✓ Exchange rate retrieved!" -ForegroundColor Green
        Write-Host "USD to EUR rate: $rate" -ForegroundColor White
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to get exchange rate: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }

    # Test 10: Get Dashboard Stats
    Write-Host "10. Getting Dashboard Statistics..." -ForegroundColor Yellow
    try {
        $stats = Invoke-RestMethod -Uri "$baseUrl/dashboard/company-stats" -Method Get -Headers $headers
        Write-Host "✓ Dashboard stats retrieved!" -ForegroundColor Green
        Write-Host "Total Expenses: $($stats.totalExpenses)" -ForegroundColor White
        Write-Host "Pending: $($stats.pendingCount)" -ForegroundColor White
        Write-Host "Approved: $($stats.approvedCount)" -ForegroundColor White
        Write-Host "Rejected: $($stats.rejectedCount)" -ForegroundColor White
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to get dashboard stats: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Save your access token for future requests:" -ForegroundColor Yellow
Write-Host "`$token = '$token'" -ForegroundColor White
Write-Host ""
Write-Host "📚 API Documentation: http://localhost:3000/api/docs" -ForegroundColor Cyan

# API Quick Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints (except `/auth/login` and `/auth/register`) require JWT Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Expense Categories
- `travel` - Travel expenses
- `meals` - Meal expenses
- `accommodation` - Hotel and lodging
- `transportation` - Transportation costs
- `office_supplies` - Office supplies
- `entertainment` - Entertainment expenses
- `training` - Training and education
- `other` - Other expenses

## Expense Status Flow
```
draft → pending_approval → approved/rejected → paid
```

## User Roles
- `employee` - Standard user, can create expenses
- `manager` - Can approve/reject expenses
- `admin` - Full system access
- `super-admin` - Multi-company admin (for initial setup)

## Common Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "timestamp": "2025-10-04T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (in development mode)",
  "timestamp": "2025-10-04T12:00:00.000Z"
}
```

## Key Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "companyId": "company-id-here",
  "roles": ["employee"]
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response includes `access_token` - save this for subsequent requests.

### Expenses

#### Create Expense
```http
POST /expenses
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Business Lunch",
  "description": "Client meeting",
  "amount": 75.50,
  "currency": "USD",
  "category": "meals",
  "date": "2025-10-04",
  "merchant": "Restaurant Name"
}
```

#### Get All Expenses
```http
GET /expenses
Authorization: Bearer YOUR_TOKEN

Query Parameters:
- status: Filter by status (draft, pending_approval, approved, rejected)
- userId: Filter by user ID
```

#### Submit Expense for Approval
```http
POST /expenses/{expenseId}/submit
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "notes": "Ready for review"
}
```

### Approvals

#### Get Pending Approvals
```http
GET /approvals/pending
Authorization: Bearer YOUR_TOKEN
```

#### Approve Expense
```http
POST /approvals/{expenseId}/approve
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "comments": "Approved"
}
```

#### Reject Expense
```http
POST /approvals/{expenseId}/reject
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "reason": "Missing documentation",
  "comments": "Please provide receipt"
}
```

### Dashboard

#### Company Statistics
```http
GET /dashboard/company-stats
Authorization: Bearer YOUR_TOKEN
```

Returns:
- Total expenses count
- Pending/Approved/Rejected counts
- Total amount spent
- Month-to-date statistics

#### User Statistics
```http
GET /dashboard/user-stats
Authorization: Bearer YOUR_TOKEN
```

#### Expenses by Category
```http
GET /dashboard/expenses-by-category
Authorization: Bearer YOUR_TOKEN
```

#### Monthly Trend
```http
GET /dashboard/monthly-trend?months=6
Authorization: Bearer YOUR_TOKEN
```

#### Top Spenders
```http
GET /dashboard/top-spenders?limit=10
Authorization: Bearer YOUR_TOKEN
```

### Currency

#### Get All Currencies
```http
GET /currency/list
Authorization: Bearer YOUR_TOKEN
```

#### Get Exchange Rate
```http
GET /currency/exchange-rate?from=EUR&to=USD
Authorization: Bearer YOUR_TOKEN
```

#### Convert Currency
```http
GET /currency/convert?amount=100&from=EUR&to=USD
Authorization: Bearer YOUR_TOKEN
```

### OCR

#### Scan Receipt
```http
POST /ocr/scan-receipt
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

Form Data:
- file: [image file]
```

Returns extracted text and structured data (merchant, date, total, etc.)

### Approval Rules

#### Create Approval Rule
```http
POST /approval-rules
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Over $500 Approval",
  "description": "Requires manager approval",
  "minAmount": 500,
  "maxAmount": 10000,
  "categories": ["travel", "accommodation"],
  "approvers": [
    {
      "userId": "manager-user-id",
      "order": 1,
      "isRequired": true
    }
  ],
  "priority": 1
}
```

#### Get All Approval Rules
```http
GET /approval-rules
Authorization: Bearer YOUR_TOKEN
```

### Users

#### Get All Users
```http
GET /users
Authorization: Bearer YOUR_TOKEN

Query Parameters:
- companyId: Filter by company (optional)
```

#### Get Managers
```http
GET /users/managers
Authorization: Bearer YOUR_TOKEN
```

#### Update User
```http
PATCH /users/{userId}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "department": "Engineering",
  "position": "Senior Developer"
}
```

### Companies

#### Create Company
```http
POST /companies
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Acme Corp",
  "baseCurrency": "USD",
  "email": "admin@acme.com",
  "settings": {
    "approvalWorkflow": true,
    "autoApprovalLimit": 100,
    "requireReceipts": true,
    "allowMultipleCurrencies": true
  }
}
```

#### Get Company Details
```http
GET /companies/{companyId}
Authorization: Bearer YOUR_TOKEN
```

## File Upload

When uploading files (receipts, OCR images):

### Single File
```http
POST /ocr/scan-receipt
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

file: [select file]
```

### Multiple Files (Receipts)
```http
POST /expenses
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

receipts: [select file 1]
receipts: [select file 2]
title: "Business Expense"
amount: 100
currency: "USD"
category: "meals"
date: "2025-10-04"
```

**File Limits:**
- Max file size: 5MB for receipts, 10MB for OCR
- Supported formats: JPG, PNG, PDF
- Max files per expense: 5

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |

## Rate Limiting
Consider implementing rate limiting for production:
- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute
- File uploads: 10 requests per minute

## Data Validation

All DTOs use class-validator decorators:
- `@IsNotEmpty()` - Field is required
- `@IsEmail()` - Valid email format
- `@IsNumber()` - Must be a number
- `@MinLength(n)` - Minimum string length
- `@IsEnum()` - Must match enum value

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create Expense Example
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Taxi Fare",
    "amount":25,
    "currency":"USD",
    "category":"transportation",
    "date":"2025-10-04"
  }'
```

## Best Practices

1. **Always validate tokens** before processing requests
2. **Use HTTPS** in production
3. **Implement pagination** for large lists
4. **Cache currency rates** to reduce external API calls
5. **Store files in cloud storage** (S3, Azure Blob) in production
6. **Log all approval actions** for audit trail
7. **Implement request timeouts** for external APIs
8. **Use connection pooling** for database
9. **Validate file types and sizes** before processing
10. **Sanitize user inputs** to prevent injection attacks

## Quick Development Setup

1. Install dependencies: `npm install`
2. Start MongoDB: `net start MongoDB`
3. Run app: `npm run start:dev`
4. Open Swagger: http://localhost:3000/api/docs
5. Import Postman collection for testing

## Support

- Full Documentation: http://localhost:3000/api/docs (when running)
- Setup Guide: See SETUP_GUIDE.md
- Postman Collection: Import postman_collection.json

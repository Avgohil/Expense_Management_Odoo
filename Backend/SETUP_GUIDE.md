# Expense Management System - Setup Guide

## Quick Start Guide

### 1. Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages including:
- NestJS framework and modules
- MongoDB driver (Mongoose)
- Authentication packages (JWT, Passport)
- Validation libraries
- Swagger for API documentation
- External API clients (Google Vision, Axios)
- Email service (Nodemailer)

### 2. Set Up MongoDB

#### Option A: Local MongoDB
1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
3. The default connection string is: `mongodb://localhost:27017/expense-management`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `.env` file with your connection string

### 3. Configure Environment Variables

The `.env` file is already created with default values. Update the following:

```env
# Database - Update if using MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/expense-management

# JWT Secret - Change this in production!
JWT_SECRET=your-secure-secret-key-here

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@expense-management.com
```

#### Setting up Gmail for Email Notifications:
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use the generated password in `SMTP_PASSWORD`

### 4. Set Up Google Vision API (Optional - for OCR features)

1. Create a Google Cloud Project: https://console.cloud.google.com/
2. Enable the Vision API
3. Create a Service Account
4. Download the JSON credentials file
5. Save it as `google-vision-credentials.json` in the project root
6. The `.env` file already points to this location

**Note**: OCR features will not work without this setup, but the rest of the application will function normally.

### 5. Create Upload Directories

Create the uploads directory for receipt storage:

```powershell
mkdir uploads
mkdir uploads\receipts
```

### 6. Run the Application

#### Development Mode (with auto-reload):
```powershell
npm run start:dev
```

#### Production Mode:
```powershell
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000`

### 7. Access API Documentation

Open your browser and navigate to:
```
http://localhost:3000/api/docs
```

This will open the Swagger UI where you can:
- View all available endpoints
- Test API calls directly
- See request/response schemas
- Understand authentication requirements

## Testing the API

### 1. Create a Company

**POST** `/api/companies`
```json
{
  "name": "Acme Corporation",
  "baseCurrency": "USD",
  "email": "admin@acme.com"
}
```

**Note**: You'll need to add the super-admin role manually or temporarily disable the guard for initial setup.

### 2. Register a User

**POST** `/api/auth/register`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@acme.com",
  "password": "SecurePass123",
  "companyId": "your-company-id-from-step-1",
  "roles": ["employee"]
}
```

### 3. Login

**POST** `/api/auth/login`
```json
{
  "email": "john.doe@acme.com",
  "password": "SecurePass123"
}
```

Save the `access_token` from the response. You'll need it for authenticated requests.

### 4. Create an Expense

**POST** `/api/expenses`

Add the Authorization header: `Bearer YOUR_ACCESS_TOKEN`

```json
{
  "title": "Business Lunch",
  "description": "Lunch with client",
  "amount": 50.00,
  "currency": "USD",
  "category": "meals",
  "date": "2025-10-04",
  "merchant": "Restaurant ABC"
}
```

## User Roles

The system supports three main roles:

- **employee**: Can create and manage their own expenses
- **manager**: Can approve/reject expenses, view reports
- **admin**: Full access to all features, can manage users and company settings

## Common Issues and Solutions

### Issue: Cannot connect to MongoDB
**Solution**: 
- Make sure MongoDB is running: `net start MongoDB`
- Check your connection string in `.env`
- For Atlas, ensure your IP is whitelisted

### Issue: Authentication errors
**Solution**: 
- Make sure you're including the JWT token in the Authorization header
- Format: `Bearer YOUR_TOKEN`
- Check if the token hasn't expired (default: 7 days)

### Issue: Email notifications not working
**Solution**: 
- Verify SMTP credentials in `.env`
- For Gmail, make sure you're using an App Password, not your regular password
- Check if 2FA is enabled on your Google account

### Issue: OCR not working
**Solution**: 
- Ensure Google Vision API is enabled
- Verify the credentials file path is correct
- Check if the service account has proper permissions

### Issue: File upload errors
**Solution**: 
- Ensure the `uploads/receipts` directory exists
- Check file size limits (default: 5MB for receipts, 10MB for OCR)
- Verify file permissions on the uploads directory

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user (admin only)
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `GET /api/companies/:id` - Get company details
- `PATCH /api/companies/:id` - Update company

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense (with file upload)
- `GET /api/expenses/:id` - Get expense details
- `PATCH /api/expenses/:id` - Update expense
- `POST /api/expenses/:id/submit` - Submit for approval
- `DELETE /api/expenses/:id` - Delete expense

### Approvals
- `POST /api/approvals/:expenseId/approve` - Approve expense
- `POST /api/approvals/:expenseId/reject` - Reject expense
- `GET /api/approvals/pending` - Get pending approvals
- `GET /api/approvals/history/:expenseId` - Get approval history

### Approval Rules
- `GET /api/approval-rules` - List rules
- `POST /api/approval-rules` - Create rule
- `PATCH /api/approval-rules/:id` - Update rule
- `DELETE /api/approval-rules/:id` - Delete rule

### Currency
- `GET /api/currency/list` - Get all currencies
- `GET /api/currency/exchange-rate` - Get exchange rate
- `GET /api/currency/convert` - Convert amount

### OCR
- `POST /api/ocr/scan-receipt` - Scan receipt (file upload)

### Dashboard
- `GET /api/dashboard/company-stats` - Company statistics
- `GET /api/dashboard/user-stats` - User statistics
- `GET /api/dashboard/expenses-by-category` - Expenses by category
- `GET /api/dashboard/monthly-trend` - Monthly trends
- `GET /api/dashboard/top-spenders` - Top spenders

## Database Schema

### Users Collection
- firstName, lastName, email, password (hashed)
- companyId (reference to Company)
- roles (array: employee, manager, admin)
- department, position, managerId
- isActive, phoneNumber, profilePicture

### Companies Collection
- name, address, city, country
- baseCurrency, settings
- isActive

### Expenses Collection
- userId, companyId
- title, description, amount, currency
- category, date, receipts (array)
- status (draft, submitted, pending_approval, approved, rejected, paid)
- merchant, location, projectCode
- exchangeRate, amountInBaseCurrency
- approvedBy, approvedAt, rejectionReason

### Approval Rules Collection
- companyId, name, description
- minAmount, maxAmount
- categories, departments
- approvers (array with userId, order, isRequired)
- priority, isActive

### Approval Logs Collection
- expenseId, approverId
- action (approved, rejected, pending)
- comments, actionDate, level

## Development Tips

### Generate New Modules
```powershell
npx nest generate module module-name
npx nest generate controller module-name
npx nest generate service module-name
```

### View Database
Use MongoDB Compass (GUI) or mongosh (CLI) to view and manage your data:
```powershell
mongosh mongodb://localhost:27017/expense-management
```

### Code Formatting
```powershell
npm run format
```

### Linting
```powershell
npm run lint
```

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Change JWT_SECRET** in production
3. **Use strong passwords** for database and email
4. **Enable HTTPS** in production
5. **Keep dependencies updated**: `npm audit` and `npm update`
6. **Rate limiting** - Consider adding rate limiting for production
7. **Input validation** - Already implemented with class-validator

## Deployment Checklist

Before deploying to production:

- [ ] Update all environment variables in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Use a strong `JWT_SECRET`
- [ ] Set up proper MongoDB backup
- [ ] Configure proper CORS settings
- [ ] Set up SSL/TLS certificates
- [ ] Configure proper logging
- [ ] Set up monitoring and alerts
- [ ] Review and test all security settings
- [ ] Set up proper file storage (consider cloud storage for receipts)

## Support and Troubleshooting

For detailed API documentation, always refer to the Swagger UI at `/api/docs` when the application is running.

For issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check network connectivity for external APIs

## Next Steps

1. Set up approval rules for your company
2. Invite team members
3. Configure email notifications
4. Set up OCR for receipt scanning (optional)
5. Customize expense categories if needed
6. Configure approval workflows
7. Start creating and managing expenses!

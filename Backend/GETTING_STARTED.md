# Getting Started Checklist

Use this checklist to get your Expense Management System up and running.

## Prerequisites Setup
- [ ] Install Node.js (v16 or higher) from https://nodejs.org/
- [ ] Install MongoDB (v5 or higher) from https://www.mongodb.com/try/download/community
- [ ] Install a code editor (VS Code recommended)
- [ ] Install Postman (optional, for API testing)

## Initial Configuration
- [ ] Open PowerShell in the project directory
- [ ] Run installation script: `.\install.ps1` (or manually run `npm install`)
- [ ] Verify `node_modules` folder was created
- [ ] Check that `.env` file exists (created from `.env.example`)
- [ ] Create `uploads/receipts` directories if not already created

## Database Setup
- [ ] Verify MongoDB is installed: `mongod --version`
- [ ] Start MongoDB service: `net start MongoDB`
- [ ] Verify MongoDB is running (should be accessible at localhost:27017)
- [ ] (Optional) Install MongoDB Compass for GUI access

## Environment Configuration
Edit the `.env` file and configure:

### Required Settings
- [ ] `MONGODB_URI` - Verify or update MongoDB connection string
- [ ] `JWT_SECRET` - Change to a secure random string (production)
- [ ] `PORT` - Default 3000, change if needed

### Email Settings (Required for notifications)
- [ ] `SMTP_HOST` - Your SMTP server (e.g., smtp.gmail.com)
- [ ] `SMTP_PORT` - SMTP port (usually 587)
- [ ] `SMTP_USER` - Your email address
- [ ] `SMTP_PASSWORD` - Your email password/app password
- [ ] `EMAIL_FROM` - From address for emails

### Optional Settings
- [ ] Google Vision API credentials (for OCR features)
  - Create Google Cloud project
  - Enable Vision API
  - Create service account
  - Download JSON credentials
  - Save as `google-vision-credentials.json` in project root

## Start the Application
- [ ] Run development server: `npm run start:dev`
- [ ] Wait for "Application is running" message
- [ ] Note the URL displayed (usually http://localhost:3000)

## Verify Installation
- [ ] Open browser to http://localhost:3000/api/docs
- [ ] Verify Swagger documentation loads
- [ ] Check all endpoint groups are visible:
  - [ ] Authentication
  - [ ] Users
  - [ ] Companies
  - [ ] Expenses
  - [ ] Approval Rules
  - [ ] Approvals
  - [ ] OCR
  - [ ] Currency
  - [ ] Dashboard

## Initial Data Setup

### 1. Create a Company (via Swagger or Postman)
- [ ] POST `/api/companies` with company details
- [ ] Note the company ID from the response
- [ ] Sample data:
  ```json
  {
    "name": "Your Company Name",
    "baseCurrency": "USD",
    "email": "admin@company.com"
  }
  ```

### 2. Register First User
- [ ] POST `/api/auth/register` with user details
- [ ] Use the company ID from step 1
- [ ] Sample data:
  ```json
  {
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@company.com",
    "password": "SecurePassword123",
    "companyId": "YOUR_COMPANY_ID",
    "roles": ["admin", "employee"]
  }
  ```

### 3. Login and Get Token
- [ ] POST `/api/auth/login` with credentials
- [ ] Copy the `access_token` from response
- [ ] Click "Authorize" in Swagger UI
- [ ] Enter: `Bearer YOUR_ACCESS_TOKEN`
- [ ] Click "Authorize" button

### 4. Test Basic Operations
- [ ] Create an expense (POST `/api/expenses`)
- [ ] View your expenses (GET `/api/expenses/my-expenses`)
- [ ] Submit expense for approval (POST `/api/expenses/{id}/submit`)
- [ ] View dashboard stats (GET `/api/dashboard/user-stats`)

## Configure Approval Workflow (Optional)
- [ ] Create approval rules (POST `/api/approval-rules`)
- [ ] Set up approvers (managers/admins)
- [ ] Test approval flow

## Testing
- [ ] Import Postman collection: `postman_collection.json`
- [ ] Set environment variables in Postman
- [ ] Run through sample API calls
- [ ] Test file upload with receipt
- [ ] Test OCR scanning (if configured)
- [ ] Test currency conversion
- [ ] Verify email notifications (if configured)

## Documentation Review
- [ ] Read README.md for project overview
- [ ] Review SETUP_GUIDE.md for detailed instructions
- [ ] Check API_REFERENCE.md for quick API reference
- [ ] Review PROJECT_SUMMARY.md for complete feature list

## Production Readiness (Before Deploying)
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB instance (MongoDB Atlas recommended)
- [ ] Configure proper SMTP service (SendGrid, AWS SES, etc.)
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for your frontend domain
- [ ] Set up proper logging
- [ ] Configure file storage (AWS S3, Azure Blob, etc.)
- [ ] Set up monitoring and alerts
- [ ] Review security settings
- [ ] Set up automated backups
- [ ] Test disaster recovery procedures

## Troubleshooting

If you encounter issues, check:

### Application Won't Start
- [ ] Node.js is installed and in PATH
- [ ] All dependencies installed (`node_modules` exists)
- [ ] `.env` file exists and is properly formatted
- [ ] Port 3000 is not already in use
- [ ] Check console for error messages

### Cannot Connect to Database
- [ ] MongoDB service is running: `net start MongoDB`
- [ ] Connection string in `.env` is correct
- [ ] MongoDB is accessible at specified host/port
- [ ] Firewall allows MongoDB connections
- [ ] For Atlas: IP whitelist configured

### Authentication Issues
- [ ] JWT token is included in Authorization header
- [ ] Token format: `Bearer YOUR_TOKEN`
- [ ] Token hasn't expired (check JWT_EXPIRES_IN)
- [ ] User has required role for the endpoint

### Email Not Sending
- [ ] SMTP credentials are correct
- [ ] Using App Password for Gmail (not regular password)
- [ ] 2FA enabled on email account
- [ ] Firewall allows SMTP connections
- [ ] Check application logs for SMTP errors

### OCR Not Working
- [ ] Google Vision API is enabled
- [ ] Credentials file exists and path is correct
- [ ] Service account has proper permissions
- [ ] Billing is enabled on Google Cloud project

## Quick Command Reference

```powershell
# Install dependencies
npm install

# Start development server
npm run start:dev

# Start production server
npm run build
npm run start:prod

# Start MongoDB (Windows)
net start MongoDB

# Stop MongoDB (Windows)
net stop MongoDB

# View MongoDB data
mongosh mongodb://localhost:27017/expense-management

# Format code
npm run format

# Run linter
npm run lint
```

## Success Indicators

You know everything is working when:
- ✅ Application starts without errors
- ✅ Swagger UI loads at http://localhost:3000/api/docs
- ✅ You can register and login successfully
- ✅ You can create and view expenses
- ✅ Authentication tokens work properly
- ✅ Dashboard shows statistics
- ✅ File uploads work
- ✅ Email notifications are sent (if configured)
- ✅ Currency conversion works

## Next Steps

Once everything is working:
1. **Customize** expense categories for your needs
2. **Configure** approval workflows
3. **Invite** team members
4. **Set up** departments and managers
5. **Train** users on the system
6. **Monitor** usage and performance
7. **Plan** for production deployment

## Support Resources
- Swagger Documentation: http://localhost:3000/api/docs
- Setup Guide: SETUP_GUIDE.md
- API Reference: API_REFERENCE.md
- Project Summary: PROJECT_SUMMARY.md

## Notes
- Save this checklist and mark off items as you complete them
- Keep your `.env` file secure and never commit it to version control
- Document any custom configurations you make
- Backup your database regularly

---

**Last Updated:** October 4, 2025
**Version:** 1.0.0

Good luck with your Expense Management System! 🚀

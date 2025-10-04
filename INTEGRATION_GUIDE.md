# Backend-Frontend Integration Guide

## 🎯 Overview

This guide provides complete instructions for running the integrated Expense Management System with:
- **Backend**: NestJS + MongoDB + JWT Authentication
- **Frontend**: React + Vite + TailwindCSS + Axios

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
   - Option 1: Local installation
   - Option 2: MongoDB Atlas (cloud) - [Sign up free](https://www.mongodb.com/cloud/atlas)
3. **Git** - [Download](https://git-scm.com/downloads)

## 🚀 Quick Start

### Step 1: Clone and Setup

```powershell
# Clone the repository (if not already done)
git clone https://github.com/Avgohil/Expense_Management_Odoo.git
cd Expense_Management_Odoo
```

### Step 2: Backend Setup

```powershell
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Create .env file (copy from example)
Copy-Item .env.example .env

# Edit .env file with your MongoDB connection string
# Open .env in notepad or your preferred editor
notepad .env
```

**Configure your `.env` file:**
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/expense-management
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-management

# JWT Secret (change this to a random secure string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Port
PORT=5000

# CORS Origin (frontend URL)
CORS_ORIGIN=http://localhost:3000
```

```powershell
# Start the backend server
npm run start:dev
```

The backend will start on `http://localhost:5000`

### Step 3: Frontend Setup

Open a **new terminal window**:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# The .env file is already configured
# Backend API URL is set to http://localhost:5000/api

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 👤 First Time Setup

### Create Admin Account

1. Go to `http://localhost:3000/signup`
2. Fill in the form:
   - **Company Name**: Your company name
   - **Country**: Select your country
   - **Full Name**: Admin User
   - **Email**: admin@company.com
   - **Password**: Choose a secure password
   - **Role**: Select "Admin"
3. Click "Signup"

You'll be automatically logged in and redirected to the Admin Dashboard.

### Create Additional Users

As an admin, you can create more users through the Admin Dashboard or by having them sign up directly.

## 🔑 API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Expenses
- `GET /api/expenses` - Get all expenses (filtered by role)
- `GET /api/expenses/my` - Get current user's expenses
- `POST /api/expenses` - Create new expense
- `PATCH /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `POST /api/expenses/:id/submit` - Submit expense for approval

### Approvals
- `GET /api/approvals/pending` - Get pending approvals
- `POST /api/approvals/approve` - Approve expense
- `POST /api/approvals/reject` - Reject expense
- `GET /api/approvals/history/:expenseId` - Get approval history

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities
- `GET /api/dashboard/trends` - Get expense trends

### OCR
- `POST /api/ocr/process` - Process receipt image (OCR)

## 🧪 Testing the Application

### Test Employee Workflow

1. **Login as Employee**
2. **Create an Expense**:
   - Click "Add Expense"
   - Fill in: Date, Category, Amount, Description
   - Click "Submit"
3. **Scan Receipt (Optional)**:
   - Click "Scan Receipt (OCR)"
   - Upload a receipt image
   - Expense is auto-created from OCR data

### Test Manager Workflow

1. **Login as Manager**
2. **View Pending Approvals**:
   - See all expenses pending approval
3. **Approve/Reject Expenses**:
   - Click "Approve" to approve
   - Click "Reject" and provide reason to reject

### Test Admin Workflow

1. **Login as Admin**
2. **View System Overview**:
   - See all expenses across the organization
   - View statistics and trends
3. **Manage Users**:
   - Create new users
   - Update user roles

## 🛠️ Troubleshooting

### Backend Issues

**Problem: Backend won't start**
```powershell
# Check if MongoDB is running
# For local MongoDB:
mongod --version

# Check if port 5000 is in use
netstat -ano | findstr :5000

# If port is in use, change PORT in .env file
```

**Problem: Database connection error**
- Verify MongoDB is running
- Check MONGODB_URI in .env
- For MongoDB Atlas: Check network access and database user credentials

**Problem: JWT errors**
- Ensure JWT_SECRET is set in .env
- Clear browser localStorage and try again

### Frontend Issues

**Problem: Frontend won't start**
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

**Problem: API calls failing**
- Check backend is running on http://localhost:5000
- Check VITE_API_BASE_URL in frontend/.env
- Check browser console for CORS errors
- Verify CORS_ORIGIN in backend/.env

**Problem: Login not working**
- Clear browser cache and localStorage
- Check browser console for errors
- Verify backend is accessible

### Common Errors

**CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Add frontend URL to CORS_ORIGIN in Backend/.env
```env
CORS_ORIGIN=http://localhost:3000
```

**401 Unauthorized**
```
Failed to authenticate token
```
**Solution**: Login again to get a fresh token

**Network Error**
```
Network Error / ERR_CONNECTION_REFUSED
```
**Solution**: Ensure backend is running on http://localhost:5000

## 📚 Project Structure

```
expense-management/
├── Backend/                  # NestJS Backend
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── expenses/        # Expense management
│   │   ├── approvals/       # Approval workflows
│   │   ├── users/           # User management
│   │   ├── dashboard/       # Dashboard stats
│   │   └── ocr/            # OCR processing
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/                # React Frontend
    ├── src/
    │   ├── services/       # API service layer
    │   ├── pages/          # Page components
    │   ├── components/     # Reusable components
    │   ├── store/          # Auth state
    │   └── context/        # React context
    ├── .env                # Environment variables
    └── package.json
```

## 🔒 Security Notes

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Validate all inputs** on backend
4. **Store sensitive data** in environment variables
5. **Enable rate limiting** for API endpoints
6. **Use strong passwords**

## 📦 Deployment

### Backend Deployment (Heroku Example)

```powershell
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login and create app
heroku login
heroku create expense-backend

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set CORS_ORIGIN=https://your-frontend-url.com

# Deploy
git subtree push --prefix Backend heroku master
```

### Frontend Deployment (Vercel Example)

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_BASE_URL production
# Enter: https://your-backend-url.herokuapp.com/api
```

## 🆘 Support

For issues or questions:
1. Check this documentation
2. Review Backend/README.md
3. Review frontend/README.md
4. Check GitHub issues
5. Contact: avgohil@example.com

## 📝 License

MIT License - See LICENSE file for details

---

**Happy Coding! 🚀**

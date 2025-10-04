# Frontend-Backend Integration Guide

## Overview
This document describes how the React frontend integrates with the NestJS backend for the Expense Management System.

## Table of Contents
1. [Setup](#setup)
2. [Architecture](#architecture)
3. [API Integration](#api-integration)
4. [Authentication Flow](#authentication-flow)
5. [Running the Application](#running-the-application)
6. [Deployment](#deployment)

---

## Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- Backend server running on `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Expense Management System
```

For production, update the API URL:
```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

---

## Architecture

### Project Structure
```
frontend/
├── src/
│   ├── services/          # API service layer
│   │   ├── api.js        # Axios instance & interceptors
│   │   ├── authService.js
│   │   ├── expenseService.js
│   │   ├── approvalService.js
│   │   ├── dashboardService.js
│   │   ├── userService.js
│   │   ├── ocrService.js
│   │   └── index.js
│   ├── components/        # Reusable UI components
│   │   ├── ProtectedRoute.jsx  # Route guard
│   │   └── ...
│   ├── pages/            # Page components
│   ├── store/            # State management
│   └── App.jsx           # Main app with routing
├── vite.config.js        # Vite configuration
└── .env                  # Environment variables
```

### Service Layer Pattern

All API calls go through service modules that use a configured axios instance:
- **Centralized error handling**
- **Automatic token injection**
- **Response/request interceptors**

---

## API Integration

### Base API Client (`src/services/api.js`)

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Modules

Each service module exports methods for specific API endpoints:

#### Authentication Service
```javascript
import { authService } from './services';

// Login
await authService.login(email, password);

// Signup
await authService.signup(userData);

// Logout
authService.logout();

// Get current user
const user = authService.getCurrentUser();
```

#### Expense Service
```javascript
import { expenseService } from './services';

// Get all expenses
const expenses = await expenseService.getExpenses();

// Create expense
await expenseService.createExpense(expenseData);

// Update expense
await expenseService.updateExpense(id, updatedData);

// Submit for approval
await expenseService.submitExpense(id);

// Upload receipt
await expenseService.uploadReceipt(expenseId, file);
```

#### Approval Service
```javascript
import { approvalService } from './services';

// Get pending approvals
const pending = await approvalService.getPendingApprovals();

// Approve expense
await approvalService.approveExpense(expenseId, comments);

// Reject expense
await approvalService.rejectExpense(expenseId, reason);
```

---

## Authentication Flow

### 1. User Signup/Login

```javascript
// pages/auth/Login.jsx
import { login } from '../../store/authSlice';

async function handleSubmit(e) {
  e.preventDefault();
  const res = await login({ email, password });
  
  if (res.success) {
    // Token & user stored in localStorage
    navigate('/dashboard');
  }
}
```

### 2. Token Storage

After successful login:
- JWT token stored in `localStorage` as `token`
- User info stored as `user`

### 3. Protected Routes

```javascript
// App.jsx
<Route path="/admin" element={
  <ProtectedRoute allowedRoles={['Admin']}>
    <AdminDashboard/>
  </ProtectedRoute>
} />
```

The `ProtectedRoute` component:
- Checks if user is authenticated
- Validates user role against allowed roles
- Redirects to login or appropriate dashboard

### 4. Automatic Token Injection

All API requests automatically include the JWT token via the axios interceptor.

### 5. Session Expiration

If the backend returns 401 Unauthorized:
- Token is cleared from localStorage
- User is redirected to `/login`

---

## Running the Application

### Development Mode

1. **Start the backend server** (from Backend directory):
```bash
npm run start:dev
# Backend runs on http://localhost:5000
```

2. **Start the frontend dev server** (from frontend directory):
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

3. **Open browser**: http://localhost:3000

### Vite Proxy Configuration

The frontend proxies `/api` requests to the backend automatically:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});
```

This means you can use relative paths like `/api/expenses` in development.

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/my` - Get current user's expenses
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PATCH /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `POST /api/expenses/:id/submit` - Submit for approval
- `POST /api/expenses/:id/receipt` - Upload receipt

### Approvals
- `GET /api/approvals/pending` - Get pending approvals
- `POST /api/approvals/approve` - Approve expense
- `POST /api/approvals/reject` - Reject expense
- `GET /api/approvals/history/:id` - Get approval history

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/profile` - Update current user profile

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities
- `GET /api/dashboard/trends` - Get expense trends

### OCR
- `POST /api/ocr/process` - Process receipt image

---

## Error Handling

### Client-Side Error Handling

All service calls are wrapped in try-catch blocks:

```javascript
async function fetchExpenses() {
  setLoading(true);
  setError('');
  
  try {
    const response = await expenseService.getExpenses();
    setExpenses(response.data);
  } catch (err) {
    setError(err.message || 'Failed to fetch expenses');
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
}
```

### Backend Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` directory with optimized static files.

### Environment Variables for Production

Update `.env` with production API URL:
```env
VITE_API_BASE_URL=https://api.yourproduction.com/api
```

### Deploy to Netlify/Vercel

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in hosting dashboard

### Deploy with Backend

1. Build frontend: `npm run build`
2. Copy `dist/` contents to backend's `public/` folder
3. Configure NestJS to serve static files
4. Deploy backend with integrated frontend

---

## Testing the Integration

### 1. Test Authentication
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"Employee"}'

# Login
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Expense Creation
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-10-04","category":"Travel","amount":100,"description":"Test expense","currency":"USD"}'
```

---

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend has CORS enabled:

```typescript
// Backend: main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### 401 Unauthorized
- Check if token is stored in localStorage
- Verify token hasn't expired
- Check backend JWT secret matches

### Network Errors
- Ensure backend is running on port 5000
- Check firewall settings
- Verify API_BASE_URL in .env

### API Not Found (404)
- Check API endpoint paths match backend routes
- Verify backend route prefixes (e.g., `/api`)
- Check method types (GET, POST, etc.)

---

## Next Steps

1. **Add Loading States**: Show spinners during API calls
2. **Implement Toast Notifications**: User feedback for success/errors
3. **Add Data Caching**: Use React Query or SWR
4. **Implement Pagination**: For large data sets
5. **Add Unit Tests**: Test service functions and components
6. **Implement WebSockets**: Real-time notifications
7. **Add Error Boundary**: Catch and handle React errors gracefully

---

## Support

For issues or questions:
- Backend API Documentation: `/Backend/API_REFERENCE.md`
- Backend Setup Guide: `/Backend/SETUP_GUIDE.md`
- Create an issue on GitHub

---

**Last Updated**: October 4, 2025

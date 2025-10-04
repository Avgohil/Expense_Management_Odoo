# Expense Management Frontend (React + Vite + TailwindCSS)

This is the React frontend for an Expense Management System with three role-based dashboards: Employee, Manager, and Admin. It uses React + Vite + TailwindCSS and is fully integrated with the NestJS backend API.

## Features

✅ **Fully Integrated with Backend API**
- Real authentication with JWT tokens
- CRUD operations for expenses
- Approval workflow integration
- OCR receipt processing
- Role-based access control

✅ **Three Role-Based Dashboards**
- **Employee**: Create, submit, and track expenses
- **Manager**: Review and approve/reject team expenses
- **Admin**: System-wide overview and user management

✅ **Modern Tech Stack**
- React 18 with Hooks
- Vite for fast development
- TailwindCSS for styling
- Axios for API calls
- React Router for navigation

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Expense Management System
```

### 3. Start Backend Server
Ensure the NestJS backend is running on port 5000:
```bash
cd ../Backend
npm run start:dev
```

### 4. Start Frontend Dev Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── services/          # API service layer (axios)
│   │   ├── api.js        # Base axios instance with interceptors
│   │   ├── authService.js
│   │   ├── expenseService.js
│   │   ├── approvalService.js
│   │   ├── dashboardService.js
│   │   ├── userService.js
│   │   ├── ocrService.js
│   │   └── index.js
│   ├── components/        # Reusable UI components
│   │   ├── ProtectedRoute.jsx  # Route guard for auth
│   │   ├── Sidebar.jsx
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── auth/         # Login & Signup
│   │   ├── employee/     # Employee dashboard
│   │   ├── manager/      # Manager dashboard
│   │   └── admin/        # Admin dashboard
│   ├── store/            # State management (auth)
│   ├── context/          # React Context (theme)
│   ├── layouts/          # Layout components
│   └── App.jsx           # Main app with routing
├── vite.config.js        # Vite configuration
├── .env                  # Environment variables
└── INTEGRATION_GUIDE.md  # Detailed integration docs
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Integration Details

### Authentication Flow
1. User signs up or logs in via `/login` or `/signup`
2. Backend returns JWT token and user info
3. Token stored in localStorage
4. All subsequent API calls include token in Authorization header
5. Protected routes validate authentication and role

### API Services

All API calls are handled through service modules:

```javascript
// Example: Using expense service
import { expenseService } from './services';

// Get expenses
const expenses = await expenseService.getMyExpenses();

// Create expense
await expenseService.createExpense({
  date: '2025-10-04',
  category: 'Travel',
  amount: 100,
  description: 'Client visit',
  currency: 'USD'
});

// Submit for approval
await expenseService.submitExpense(expenseId);
```

### Protected Routes

Routes are protected based on user roles:

```javascript
<Route path="/admin" element={
  <ProtectedRoute allowedRoles={['Admin']}>
    <AdminDashboard/>
  </ProtectedRoute>
} />
```

### Error Handling

Global error handling via axios interceptors:
- 401 Unauthorized → Redirect to login
- Network errors → Show user-friendly message
- Validation errors → Display inline

## Key Features

### Employee Dashboard
- View all personal expenses
- Create new expenses
- Upload receipts
- Scan receipts with OCR
- Track expense status

### Manager Dashboard
- View pending approvals
- Approve/reject expenses
- Add comments to approvals
- View team expense statistics

### Admin Dashboard
- System-wide expense overview
- User management
- Approval rules configuration
- Dashboard analytics

## Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Expense Management System
```

## Deployment

### Build for Production
```bash
npm run build
```

Output directory: `dist/`

### Deploy to Netlify/Vercel
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables in hosting dashboard

### Deploy with Backend
1. Build frontend
2. Copy `dist/` to backend's `public/` folder
3. Configure backend to serve static files

## Documentation

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Detailed integration documentation
- **[Backend API Reference](../Backend/API_REFERENCE.md)** - API endpoints
- **[Backend Setup Guide](../Backend/SETUP_GUIDE.md)** - Backend setup

## Troubleshooting

### CORS Issues
Ensure backend enables CORS for `http://localhost:3000`

### 401 Unauthorized
- Check if token is in localStorage
- Verify token hasn't expired
- Check backend JWT configuration

### API Connection Failed
- Ensure backend is running on port 5000
- Check `VITE_API_BASE_URL` in `.env`
- Verify network connectivity

## Tech Stack

- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **TailwindCSS 3** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router 6** - Client-side routing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

---

**Last Updated**: October 4, 2025

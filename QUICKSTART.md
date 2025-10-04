# 🚀 Quick Start - Run the Application

## Prerequisites Checklist
- [ ] Node.js v16+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] Git installed

## Option 1: Automated Start (Recommended)

Simply run this command in PowerShell:

```powershell
.\start.ps1
```

This will:
1. Check dependencies
2. Install missing packages
3. Start Backend (Port 5000)
4. Start Frontend (Port 3000)
5. Open browser automatically

## Option 2: Manual Start

### Terminal 1 - Backend
```powershell
cd Backend
npm install        # First time only
npm run start:dev  # Start backend
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm install        # First time only
npm run dev        # Start frontend
```

## Access the Application

🌐 **Frontend**: http://localhost:3000
🔌 **Backend API**: http://localhost:5000/api

## First Time Setup

1. Open http://localhost:3000/signup
2. Create an admin account:
   - **Email**: admin@company.com
   - **Password**: Choose a secure password
   - **Role**: Admin
3. Start managing expenses!

## Need Help?

📖 See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed setup instructions

---

**Quick Links:**
- 📚 [Backend API Docs](./Backend/API_REFERENCE.md)
- 🎨 [Frontend Guide](./frontend/README.md)
- 🔧 [Backend Setup](./Backend/SETUP_GUIDE.md)

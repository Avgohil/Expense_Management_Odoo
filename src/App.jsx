import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import { getCurrentUser, mockLogout } from './store/authSlice'
import { ThemeProvider } from './context/ThemeContext'
import ThemeSwitcher from './components/ThemeSwitcher'
import ProfileMenu from './components/ProfileMenu'
import AuthMenu from './components/AuthMenu'
import Sidebar from './components/Sidebar'
import Profile from './pages/Profile'
import Debug from './pages/Debug'
import './styles.css'

export default function App(){
  const user = getCurrentUser()
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <nav className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button id="hamburger" className="md:hidden mr-2" onClick={()=>{ const ev = new CustomEvent('toggleSidebar'); window.dispatchEvent(ev) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <Link to="/" className="text-xl font-semibold">Expense UI</Link>
                <Link to="/employee" className="text-sm text-gray-600 hover:text-gray-900">Employee</Link>
                <Link to="/manager" className="text-sm text-gray-600 hover:text-gray-900">Manager</Link>
                <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900">Admin</Link>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSwitcher />
                <AuthMenu loggedIn={!!user} />
                <div className="text-sm text-gray-500">{user ? `${user.name} • ${user.role}` : 'No backend connected - dummy data'}</div>
                <ProfileMenu />
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<EmployeeDashboard/>} />
            <Route path="/employee" element={<EmployeeDashboard/>} />
            <Route path="/manager" element={<ManagerDashboard/>} />
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/debug" element={<Debug/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

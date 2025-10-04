import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../store/authSlice';

/**
 * ProtectedRoute component to guard routes based on authentication and role
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0) {
    const user = getCurrentUser();
    
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      if (user) {
        if (user.role === 'Admin') return <Navigate to="/admin" replace />;
        if (user.role === 'Manager') return <Navigate to="/manager" replace />;
        return <Navigate to="/employee" replace />;
      }
      
      return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and has correct role
  return children;
}

// Authentication service using real backend API
import { authService } from '../services';

// Signup user
export async function signup(userData) {
  try {
    const response = await authService.signup(userData);
    const data = response.data || response;
    const user = data.user;
    return { success: true, user, message: 'Signup successful!' };
  } catch (error) {
    return { success: false, message: error.message || 'Signup failed' };
  }
}

// Login user
export async function login({ email, password }) {
  try {
    const response = await authService.login(email, password);
    const data = response.data || response;
    const user = data.user;
    return { success: true, user, message: 'Login successful!' };
  } catch (error) {
    return { success: false, message: error.message || 'Invalid credentials' };
  }
}

// Logout user
export function logout() {
  authService.logout();
}

// Get current user from localStorage
export function getCurrentUser() {
  return authService.getCurrentUser();
}

// Check if user is authenticated
export function isAuthenticated() {
  return authService.isAuthenticated();
}

// Legacy mock functions for backward compatibility (can be removed after full migration)
export const mockSignup = signup;
export const mockLogin = login;
export const mockLogout = logout;

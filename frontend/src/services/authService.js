import apiClient from './api';

export const authService = {
  // Login user
  async login(email, password) {
    const response = await apiClient.post('/auth/signin', { email, password });
    // Handle both response.data and response.data.data formats
    const data = response.data.data || response.data;
    if (data.access_token || data.accessToken) {
      const token = data.access_token || data.accessToken;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return response.data;
  },

  // Register new user
  async signup(userData) {
    const response = await apiClient.post('/auth/signup', userData);
    // Handle both response.data and response.data.data formats
    const data = response.data.data || response.data;
    if (data.access_token || data.accessToken) {
      const token = data.access_token || data.accessToken;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return response.data;
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  async resetPassword(token, newPassword) {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }
};

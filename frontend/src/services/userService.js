import apiClient from './api';

export const userService = {
  // Get all users (admin only)
  async getUsers() {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Get user by ID
  async getUser(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create new user (admin only)
  async createUser(userData) {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Update user
  async updateUser(id, userData) {
    const response = await apiClient.patch(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  async deleteUser(id) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Get current user profile
  async getProfile() {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // Update current user profile
  async updateProfile(userData) {
    const response = await apiClient.patch('/users/profile', userData);
    return response.data;
  }
};

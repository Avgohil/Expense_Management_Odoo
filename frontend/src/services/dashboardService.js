import apiClient from './api';

export const dashboardService = {
  // Get dashboard stats
  async getStats() {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  // Get recent activities
  async getRecentActivities(limit = 10) {
    const response = await apiClient.get(`/dashboard/activities?limit=${limit}`);
    return response.data;
  },

  // Get expense trends
  async getExpenseTrends(period = 'month') {
    const response = await apiClient.get(`/dashboard/trends?period=${period}`);
    return response.data;
  }
};

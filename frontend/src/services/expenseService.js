import apiClient from './api';

export const expenseService = {
  // Get all expenses (with optional filters)
  async getExpenses(params = {}) {
    const response = await apiClient.get('/expenses', { params });
    return response.data;
  },

  // Get single expense by ID
  async getExpense(id) {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  // Create new expense
  async createExpense(expenseData) {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  // Update expense
  async updateExpense(id, expenseData) {
    const response = await apiClient.patch(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  async deleteExpense(id) {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },

  // Submit expense for approval
  async submitExpense(id) {
    const response = await apiClient.post(`/expenses/${id}/submit`);
    return response.data;
  },

  // Upload receipt
  async uploadReceipt(expenseId, file) {
    const formData = new FormData();
    formData.append('receipt', file);
    const response = await apiClient.post(`/expenses/${expenseId}/receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get expenses by status
  async getExpensesByStatus(status) {
    return this.getExpenses({ status });
  },

  // Get user's expenses
  async getMyExpenses() {
    const response = await apiClient.get('/expenses/my');
    return response.data;
  }
};

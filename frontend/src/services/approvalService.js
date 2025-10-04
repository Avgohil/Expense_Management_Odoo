import apiClient from './api';

export const approvalService = {
  // Get pending approvals for current user (manager/admin)
  async getPendingApprovals() {
    const response = await apiClient.get('/approvals/pending');
    return response.data;
  },

  // Approve an expense
  async approveExpense(expenseId, comments = '') {
    const response = await apiClient.post('/approvals/approve', {
      expenseId,
      comments
    });
    return response.data;
  },

  // Reject an expense
  async rejectExpense(expenseId, reason) {
    const response = await apiClient.post('/approvals/reject', {
      expenseId,
      reason
    });
    return response.data;
  },

  // Get approval history for an expense
  async getApprovalHistory(expenseId) {
    const response = await apiClient.get(`/approvals/history/${expenseId}`);
    return response.data;
  }
};

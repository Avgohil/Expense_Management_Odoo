import apiClient from './api';

export const ocrService = {
  // Upload and process receipt with OCR
  async processReceipt(file) {
    const formData = new FormData();
    formData.append('receipt', file);
    const response = await apiClient.post('/ocr/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

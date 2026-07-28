import api from './api.js';

export const createReturnRequest = (orderId, payload) =>
  api.post(`/orders/${orderId}/return-requests`, payload).then((res) => res.data);

export const getReturnRequest = (returnRequestId) =>
  api.get(`/return-requests/${returnRequestId}`).then((res) => res.data);

// Admin
export const adminListReturnRequests = (params) =>
  api.get('/return-requests', { params }).then((res) => res.data);

export const adminReviewReturnRequest = (returnRequestId, payload) =>
  api.post(`/return-requests/${returnRequestId}/review`, payload).then((res) => res.data);

export default {
  createReturnRequest,
  getReturnRequest,
  adminListReturnRequests,
  adminReviewReturnRequest,
};

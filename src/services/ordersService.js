import api from './api.js';

export const listOrders = (params) =>
  api.get('/orders', { params }).then((res) => res.data);

export const getOrder = (orderId) =>
  api.get(`/orders/${orderId}`).then((res) => res.data);

export const getOrderTimeline = (orderId) =>
  api.get(`/orders/${orderId}/timeline`).then((res) => res.data);

export const getOrderTracking = (orderId) =>
  api.get(`/orders/${orderId}/tracking`).then((res) => res.data);

export const cancelOrder = (orderId, payload) =>
  api.post(`/orders/${orderId}/cancel`, payload).then((res) => res.data);

export const getOrderRefunds = (orderId) =>
  api.get(`/orders/${orderId}/refunds`).then((res) => res.data);

// Admin
export const adminListOrders = (params) =>
  api.get('/admin/orders', { params }).then((res) => res.data);

export const adminGetOrder = (orderId) =>
  api.get(`/admin/orders/${orderId}`).then((res) => res.data);

export const adminAdvanceOrder = (orderId, payload) =>
  api.post(`/orders/${orderId}/advance`, payload).then((res) => res.data);

export const adminUpdateOrderStatus = (orderId, payload) =>
  api.patch(`/admin/orders/${orderId}/status`, payload).then((res) => res.data);

export default {
  listOrders,
  getOrder,
  getOrderTimeline,
  getOrderTracking,
  cancelOrder,
  getOrderRefunds,
  adminListOrders,
  adminGetOrder,
  adminAdvanceOrder,
  adminUpdateOrderStatus,
};

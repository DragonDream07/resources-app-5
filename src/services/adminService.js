import api from './api.js';
import ordersService from './ordersService.js';
import returnsService from './returnsService.js';
import promotionsService from './promotionsService.js';
import usersService from './usersService.js';
import catalogueService from './catalogueService.js';

export const getDashboardStats = () =>
  api.get('/admin/dashboard').then((res) => res.data);

export const getReports = (params) =>
  api.get('/admin/reports', { params }).then((res) => res.data);

// Delegated order admin calls
export const adminListOrders = (params) =>
  ordersService.adminListOrders(params);

export const adminGetOrder = (orderId) =>
  ordersService.adminGetOrder(orderId);

export const adminAdvanceOrder = (orderId, payload) =>
  ordersService.adminAdvanceOrder(orderId, payload);

export const adminUpdateOrderStatus = (orderId, payload) =>
  ordersService.adminUpdateOrderStatus(orderId, payload);

// Delegated returns admin calls
export const adminListReturnRequests = (params) =>
  returnsService.adminListReturnRequests(params);

export const adminReviewReturnRequest = (returnRequestId, payload) =>
  returnsService.adminReviewReturnRequest(returnRequestId, payload);

// Delegated promotions admin calls
export const adminListPromoCodes = (params) =>
  promotionsService.adminListPromoCodes(params);

export const adminCreatePromoCode = (payload) =>
  promotionsService.adminCreatePromoCode(payload);

export const adminGetPromoCode = (promoCodeId) =>
  promotionsService.adminGetPromoCode(promoCodeId);

export const adminUpdatePromoCode = (promoCodeId, payload) =>
  promotionsService.adminUpdatePromoCode(promoCodeId, payload);

export const adminDeletePromoCode = (promoCodeId) =>
  promotionsService.adminDeletePromoCode(promoCodeId);

// Delegated users admin calls
export const adminListUsers = (params) =>
  usersService.adminListUsers(params);

export const adminGetUser = (userId) =>
  usersService.adminGetUser(userId);

export const adminUpdateUser = (userId, payload) =>
  usersService.adminUpdateUser(userId, payload);

export const adminDeleteUser = (userId) =>
  usersService.adminDeleteUser(userId);

// Delegated catalogue admin calls
export const adminCreateProduct = (payload) =>
  catalogueService.adminCreateProduct(payload);

export const adminUpdateProduct = (productId, payload) =>
  catalogueService.adminUpdateProduct(productId, payload);

export const adminDeleteProduct = (productId) =>
  catalogueService.adminDeleteProduct(productId);

export const adminCreateCategory = (payload) =>
  catalogueService.adminCreateCategory(payload);

export const adminUpdateCategory = (categoryId, payload) =>
  catalogueService.adminUpdateCategory(categoryId, payload);

export const adminDeleteCategory = (categoryId) =>
  catalogueService.adminDeleteCategory(categoryId);

export const adminCreateBrand = (payload) =>
  catalogueService.adminCreateBrand(payload);

export default {
  getDashboardStats,
  getReports,
  adminListOrders,
  adminGetOrder,
  adminAdvanceOrder,
  adminUpdateOrderStatus,
  adminListReturnRequests,
  adminReviewReturnRequest,
  adminListPromoCodes,
  adminCreatePromoCode,
  adminGetPromoCode,
  adminUpdatePromoCode,
  adminDeletePromoCode,
  adminListUsers,
  adminGetUser,
  adminUpdateUser,
  adminDeleteUser,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateBrand,
};

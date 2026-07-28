import api from './api.js';

export const getMe = () =>
  api.get('/users/me').then((res) => res.data);

export const updateMe = (payload) =>
  api.patch('/users/me', payload).then((res) => res.data);

export const changePassword = (payload) =>
  api.post('/users/me/change-password', payload).then((res) => res.data);

// Admin CRUD
export const adminListUsers = (params) =>
  api.get('/admin/users', { params }).then((res) => res.data);

export const adminGetUser = (userId) =>
  api.get(`/admin/users/${userId}`).then((res) => res.data);

export const adminCreateUser = (payload) =>
  api.post('/admin/users', payload).then((res) => res.data);

export const adminUpdateUser = (userId, payload) =>
  api.put(`/admin/users/${userId}`, payload).then((res) => res.data);

export const adminDeleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`).then((res) => res.data);

export default {
  getMe,
  updateMe,
  changePassword,
  adminListUsers,
  adminGetUser,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
};

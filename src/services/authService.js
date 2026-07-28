import api from './api.js';

export const register = (payload) =>
  api.post('/auth/register', payload).then((res) => res.data);

export const guestRegister = (payload) =>
  api.post('/auth/guest-register', payload).then((res) => res.data);

export const login = (payload) =>
  api.post('/auth/login', payload).then((res) => res.data);

export const logout = () =>
  api.post('/auth/logout').then((res) => res.data);

export const forgotPassword = (payload) =>
  api.post('/auth/forgot-password', payload).then((res) => res.data);

export const resetPassword = (payload) =>
  api.post('/auth/reset-password', payload).then((res) => res.data);

export default {
  register,
  guestRegister,
  login,
  logout,
  forgotPassword,
  resetPassword,
};

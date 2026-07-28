import api from './api.js';

export const listAddresses = () =>
  api.get('/users/me/addresses').then((res) => res.data);

export const getAddress = (addressId) =>
  api.get(`/users/me/addresses/${addressId}`).then((res) => res.data);

export const createAddress = (payload) =>
  api.post('/users/me/addresses', payload).then((res) => res.data);

export const updateAddress = (addressId, payload) =>
  api.put(`/users/me/addresses/${addressId}`, payload).then((res) => res.data);

export const deleteAddress = (addressId) =>
  api.delete(`/users/me/addresses/${addressId}`).then((res) => res.data);

export const checkServiceability = (pinCode) =>
  api.get('/serviceability', { params: { pinCode } }).then((res) => res.data);

export default {
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  checkServiceability,
};

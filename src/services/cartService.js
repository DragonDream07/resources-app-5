import api from './api.js';

export const getCart = (cartId) =>
  api.get(`/carts/${cartId}`).then((res) => res.data);

export const addCartItem = (cartId, payload) =>
  api.post(`/carts/${cartId}/items`, payload).then((res) => res.data);

export const updateCartItem = (cartId, itemId, payload) =>
  api.patch(`/carts/${cartId}/items/${itemId}`, payload).then((res) => res.data);

export const removeCartItem = (cartId, itemId) =>
  api.delete(`/carts/${cartId}/items/${itemId}`).then((res) => res.data);

export const applyPromo = (cartId, payload) =>
  api.post(`/carts/${cartId}/promo`, payload).then((res) => res.data);

export default {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  applyPromo,
};

import api from './api.js';

export const reviewCheckout = () =>
  api.get('/checkout/review').then((res) => res.data);

export const setCheckoutAddress = (payload) =>
  api.post('/checkout/address', payload).then((res) => res.data);

export const placeOrder = (payload) =>
  api.post('/checkout/place-order', payload).then((res) => res.data);

export default {
  reviewCheckout,
  setCheckoutAddress,
  placeOrder,
};

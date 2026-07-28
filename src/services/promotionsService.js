import api from './api.js';

export const listPromoCodes = (params) =>
  api.get('/promo-codes', { params }).then((res) => res.data);

export const validatePromo = (cartId, payload) => {
  const { cartService } = payload;
  return import('./cartService.js').then(({ applyPromo }) =>
    applyPromo(cartId, payload)
  );
};

// Admin CRUD
export const adminListPromoCodes = (params) =>
  api.get('/promo-codes', { params }).then((res) => res.data);

export const adminCreatePromoCode = (payload) =>
  api.post('/admin/promo-codes', payload).then((res) => res.data);

export const adminGetPromoCode = (promoCodeId) =>
  api.get(`/admin/promo-codes/${promoCodeId}`).then((res) => res.data);

export const adminUpdatePromoCode = (promoCodeId, payload) =>
  api.put(`/admin/promo-codes/${promoCodeId}`, payload).then((res) => res.data);

export const adminDeletePromoCode = (promoCodeId) =>
  api.delete(`/admin/promo-codes/${promoCodeId}`).then((res) => res.data);

export default {
  listPromoCodes,
  validatePromo,
  adminListPromoCodes,
  adminCreatePromoCode,
  adminGetPromoCode,
  adminUpdatePromoCode,
  adminDeletePromoCode,
};

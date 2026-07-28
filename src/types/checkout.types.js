/**
 * @typedef {Object} CheckoutInitiatePayload
 * @property {number} cart_id
 * @property {number} address_id
 */

/**
 * @typedef {Object} CheckoutConfirmPayload
 * @property {number} cart_id
 * @property {number} address_id
 * @property {string} payment_method
 * @property {string|null} promo_code
 */

export {};

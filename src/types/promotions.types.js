/**
 * @typedef {'percentage'|'fixed'} DiscountType
 */

/**
 * @typedef {Object} PromoCode
 * @property {number} id
 * @property {string} code
 * @property {DiscountType} discount_type
 * @property {number} discount_value
 * @property {number|null} min_order_value
 * @property {number|null} max_uses
 * @property {number} times_used
 * @property {string|null} expires_at
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};

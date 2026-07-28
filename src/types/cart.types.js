/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {number} cart_id
 * @property {number} sku_id
 * @property {number} quantity
 * @property {number} unit_price
 * @property {string} sku_code
 * @property {string} variant_label
 * @property {string} product_name
 * @property {string|null} image_url
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Cart
 * @property {number} id
 * @property {number|null} user_id
 * @property {string|null} guest_token
 * @property {string|null} promo_code
 * @property {number} discount_amount
 * @property {number} subtotal
 * @property {number} total
 * @property {CartItem[]} items
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};

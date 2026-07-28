/**
 * @typedef {Object} OrderItem
 * @property {number} id
 * @property {number} order_id
 * @property {number} sku_id
 * @property {string} sku_code
 * @property {string} variant_label
 * @property {string} product_name
 * @property {number} quantity
 * @property {number} unit_price
 * @property {number} total_price
 * @property {string|null} image_url
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {number} id
 * @property {number} order_id
 * @property {string} status
 * @property {string|null} note
 * @property {number|null} changed_by
 * @property {string} created_at
 */

/**
 * @typedef {Object} OrderTracking
 * @property {number} id
 * @property {number} order_id
 * @property {string|null} carrier
 * @property {string|null} tracking_number
 * @property {string|null} tracking_url
 * @property {string|null} estimated_delivery
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {string} order_number
 * @property {number} user_id
 * @property {number} address_id
 * @property {string} status
 * @property {number} subtotal
 * @property {number} discount_amount
 * @property {number} total
 * @property {string|null} promo_code
 * @property {string|null} notes
 * @property {OrderItem[]} items
 * @property {OrderStatusHistory[]} status_history
 * @property {OrderTracking|null} tracking
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};

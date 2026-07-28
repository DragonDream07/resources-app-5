/**
 * @typedef {Object} DashboardStats
 * @property {number} total_orders
 * @property {number} total_revenue
 * @property {number} total_users
 * @property {number} total_products
 * @property {number} pending_orders
 * @property {number} pending_returns
 * @property {number} orders_today
 * @property {number} revenue_today
 */

/**
 * @typedef {Object} ReportData
 * @property {string} period
 * @property {number} orders_count
 * @property {number} revenue
 * @property {number} avg_order_value
 * @property {number} new_users
 * @property {number} returned_orders
 * @property {Array<{label: string, value: number}>} orders_by_status
 */

/**
 * @typedef {Object} AdminUser
 * @property {number} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string|null} phone
 * @property {boolean} is_active
 * @property {boolean} is_guest
 * @property {string[]} roles
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};

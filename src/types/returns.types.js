/**
 * @typedef {Object} ReturnRequest
 * @property {number} id
 * @property {number} order_id
 * @property {number} user_id
 * @property {string} reason
 * @property {string} status
 * @property {string|null} admin_notes
 * @property {number|null} reviewed_by
 * @property {string|null} reviewed_at
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Refund
 * @property {number} id
 * @property {number} order_id
 * @property {number|null} return_request_id
 * @property {number} amount
 * @property {string} status
 * @property {string|null} gateway_reference
 * @property {string|null} notes
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};

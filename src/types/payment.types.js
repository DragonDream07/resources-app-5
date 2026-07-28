/**
 * @typedef {'success'|'failure'|'pending'} PaymentOutcome
 */

/**
 * @typedef {Object} PaymentAttempt
 * @property {number} id
 * @property {number} order_id
 * @property {string} payment_method
 * @property {string} gateway_reference
 * @property {PaymentOutcome} status
 * @property {number} amount
 * @property {string|null} failure_reason
 * @property {string|null} gateway_response
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};

/**
 * PaymentAdapterInterface
 *
 * Duck-type contract that every payment provider adapter must satisfy.
 * Concrete adapters should extend this class (or implement all methods)
 * and override each method with provider-specific logic.
 *
 * Method signatures:
 *
 *   initiatePayment(payload)  → Promise<InitiateResult>
 *   verifyPayment(payload)    → Promise<VerifyResult>
 *   refundPayment(payload)    → Promise<RefundResult>
 *   getPaymentStatus(payload) → Promise<StatusResult>
 *
 * Shape contracts (all fields are illustrative; adapters may add extras):
 *
 *   payload for initiatePayment:
 *     { orderId, amount, currency, method, metadata }
 *
 *   InitiateResult:
 *     { success, transactionId, redirectUrl, providerPayload }
 *
 *   payload for verifyPayment:
 *     { transactionId, providerPayload }
 *
 *   VerifyResult:
 *     { success, status, providerPayload }
 *
 *   payload for refundPayment:
 *     { transactionId, amount, reason }
 *
 *   RefundResult:
 *     { success, refundId, providerPayload }
 *
 *   payload for getPaymentStatus:
 *     { transactionId }
 *
 *   StatusResult:
 *     { success, status, providerPayload }
 */
export class PaymentAdapterInterface {
  /**
   * Initiate a payment with the provider.
   *
   * @param {Object} payload
   * @param {string} payload.orderId
   * @param {number} payload.amount
   * @param {string} payload.currency
   * @param {string} payload.method
   * @param {Object} [payload.metadata]
   * @returns {Promise<{success: boolean, transactionId: string, redirectUrl: string|null, providerPayload: Object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async initiatePayment(payload) {
    throw new Error('PaymentAdapterInterface.initiatePayment() must be implemented by the concrete adapter.');
  }

  /**
   * Verify a payment with the provider.
   *
   * @param {Object} payload
   * @param {string} payload.transactionId
   * @param {Object} [payload.providerPayload]
   * @returns {Promise<{success: boolean, status: string, providerPayload: Object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async verifyPayment(payload) {
    throw new Error('PaymentAdapterInterface.verifyPayment() must be implemented by the concrete adapter.');
  }

  /**
   * Issue a refund for a previously completed payment.
   *
   * @param {Object} payload
   * @param {string} payload.transactionId
   * @param {number} payload.amount
   * @param {string} [payload.reason]
   * @returns {Promise<{success: boolean, refundId: string, providerPayload: Object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async refundPayment(payload) {
    throw new Error('PaymentAdapterInterface.refundPayment() must be implemented by the concrete adapter.');
  }

  /**
   * Retrieve the current status of a payment from the provider.
   *
   * @param {Object} payload
   * @param {string} payload.transactionId
   * @returns {Promise<{success: boolean, status: string, providerPayload: Object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async getPaymentStatus(payload) {
    throw new Error('PaymentAdapterInterface.getPaymentStatus() must be implemented by the concrete adapter.');
  }
}

export default PaymentAdapterInterface;

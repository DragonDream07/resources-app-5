import { PaymentAdapterInterface } from './payment.adapter.interface.js';

/**
 * MockPaymentAdapter
 *
 * A test-mode adapter that returns configurable success or failure responses
 * without contacting any real payment gateway.
 *
 * Usage:
 *   const adapter = new MockPaymentAdapter({ shouldSucceed: true });
 *   const adapter = new MockPaymentAdapter({ shouldSucceed: false, errorMessage: 'Declined' });
 *
 * Options:
 *   shouldSucceed  {boolean}  default: true  — controls outcome of all operations
 *   errorMessage   {string}   default: 'Mock payment failure' — used when shouldSucceed is false
 *   delay          {number}   default: 0     — artificial async delay in milliseconds
 */
export class MockPaymentAdapter extends PaymentAdapterInterface {
  /**
   * @param {Object}  [options]
   * @param {boolean} [options.shouldSucceed=true]
   * @param {string}  [options.errorMessage='Mock payment failure']
   * @param {number}  [options.delay=0]
   */
  constructor(options = {}) {
    super();
    this._shouldSucceed = options.shouldSucceed !== undefined ? Boolean(options.shouldSucceed) : true;
    this._errorMessage = options.errorMessage || 'Mock payment failure';
    this._delay = typeof options.delay === 'number' ? options.delay : 0;
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /**
   * Simulate async latency when a delay is configured.
   * @returns {Promise<void>}
   */
  _wait() {
    if (this._delay <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, this._delay));
  }

  /**
   * Generate a deterministic-style mock identifier.
   * In tests this is stable enough; real UUIDs are not required.
   * @param {string} prefix
   * @returns {string}
   */
  _mockId(prefix) {
    return `${prefix}_mock_${Math.random().toString(36).slice(2, 11)}`;
  }

  // ---------------------------------------------------------------------------
  // Interface implementation
  // ---------------------------------------------------------------------------

  /**
   * Simulate payment initiation.
   *
   * @param {Object} payload
   * @param {string} payload.orderId
   * @param {number} payload.amount
   * @param {string} payload.currency
   * @param {string} payload.method
   * @param {Object} [payload.metadata]
   * @returns {Promise<{success: boolean, transactionId: string|null, redirectUrl: string|null, providerPayload: Object}>}
   */
  async initiatePayment(payload) {
    await this._wait();

    if (!this._shouldSucceed) {
      return {
        success: false,
        transactionId: null,
        redirectUrl: null,
        providerPayload: {
          error: this._errorMessage,
          receivedPayload: payload,
        },
      };
    }

    const transactionId = this._mockId('txn');
    return {
      success: true,
      transactionId,
      redirectUrl: null,
      providerPayload: {
        mock: true,
        transactionId,
        orderId: payload.orderId,
        amount: payload.amount,
        currency: payload.currency,
        method: payload.method,
      },
    };
  }

  /**
   * Simulate payment verification.
   *
   * @param {Object} payload
   * @param {string} payload.transactionId
   * @param {Object} [payload.providerPayload]
   * @returns {Promise<{success: boolean, status: string, providerPayload: Object}>}
   */
  async verifyPayment(payload) {
    await this._wait();

    if (!this._shouldSucceed) {
      return {
        success: false,
        status: 'failed',
        providerPayload: {
          error: this._errorMessage,
          transactionId: payload.transactionId,
        },
      };
    }

    return {
      success: true,
      status: 'paid',
      providerPayload: {
        mock: true,
        transactionId: payload.transactionId,
        verified: true,
      },
    };
  }

  /**
   * Simulate a refund.
   *
   * @param {Object} payload
   * @param {string} payload.transactionId
   * @param {number} payload.amount
   * @param {string} [payload.reason]
   * @returns {Promise<{success: boolean, refundId: string|null, providerPayload: Object}>}
   */
  async refundPayment(payload) {
    await this._wait();

    if (!this._shouldSucceed) {
      return {
        success: false,
        refundId: null,
        providerPayload: {
          error: this._errorMessage,
          transactionId: payload.transactionId,
        },
      };
    }

    const refundId = this._mockId('ref');
    return {
      success: true,
      refundId,
      providerPayload: {
        mock: true,
        refundId,
        transactionId: payload.transactionId,
        amount: payload.amount,
        reason: payload.reason || null,
      },
    };
  }

  /**
   * Simulate a payment status enquiry.
   *
   * @param {Object} payload
   * @param {string} payload.transactionId
   * @returns {Promise<{success: boolean, status: string, providerPayload: Object}>}
   */
  async getPaymentStatus(payload) {
    await this._wait();

    if (!this._shouldSucceed) {
      return {
        success: false,
        status: 'unknown',
        providerPayload: {
          error: this._errorMessage,
          transactionId: payload.transactionId,
        },
      };
    }

    return {
      success: true,
      status: 'paid',
      providerPayload: {
        mock: true,
        transactionId: payload.transactionId,
      },
    };
  }
}

export default MockPaymentAdapter;

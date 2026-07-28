import React, { useState } from 'react';
import PropTypes from 'prop-types';

const OUTCOMES = [
  { value: 'success', label: 'Simulate Success', description: 'Payment completes successfully.' },
  { value: 'failure', label: 'Simulate Failure', description: 'Payment is declined.' },
  { value: 'pending', label: 'Simulate Pending', description: 'Payment is awaiting confirmation.' },
];

const STATUS_CONFIG = {
  success: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✓', message: 'Payment successful! Your order is being placed.' },
  failure: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '✗', message: 'Payment failed. Please try a different method.' },
  pending: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏳', message: 'Payment is pending. We will notify you once confirmed.' },
};

function PaymentMockForm({ onPaymentResult, isSubmitting }) {
  const [selectedOutcome, setSelectedOutcome] = useState('success');
  const [resultStatus, setResultStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultStatus(null);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setResultStatus(selectedOutcome);
    setLoading(false);

    if (onPaymentResult) {
      onPaymentResult(selectedOutcome);
    }
  };

  const config = resultStatus ? STATUS_CONFIG[resultStatus] : null;

  return (
    <div className="payment-mock-form">
      <div className="payment-mock-form__test-banner">
        <span className="payment-mock-form__test-badge">TEST MODE</span>
        <span className="payment-mock-form__test-note">No real transactions will be processed.</span>
      </div>

      <form className="payment-mock-form__form" onSubmit={handleSubmit}>
        <fieldset className="payment-mock-form__fieldset" disabled={loading || isSubmitting}>
          <legend className="payment-mock-form__legend">Select payment outcome</legend>
          <div className="payment-mock-form__options">
            {OUTCOMES.map((outcome) => (
              <label
                key={outcome.value}
                className={`payment-mock-form__option${
                  selectedOutcome === outcome.value ? ' payment-mock-form__option--selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentOutcome"
                  value={outcome.value}
                  checked={selectedOutcome === outcome.value}
                  onChange={() => { setSelectedOutcome(outcome.value); setResultStatus(null); }}
                  className="payment-mock-form__radio"
                />
                <div className="payment-mock-form__option-text">
                  <span className="payment-mock-form__option-label">{outcome.label}</span>
                  <span className="payment-mock-form__option-desc">{outcome.description}</span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="payment-mock-form__card-placeholder">
          <div className="payment-mock-form__card-row">
            <div className="payment-mock-form__card-field payment-mock-form__card-field--full">
              <label className="payment-mock-form__card-label">Card Number</label>
              <input
                type="text"
                className="payment-mock-form__card-input"
                value="4111 1111 1111 1111"
                readOnly
                aria-label="Mock card number"
              />
            </div>
          </div>
          <div className="payment-mock-form__card-row">
            <div className="payment-mock-form__card-field">
              <label className="payment-mock-form__card-label">Expiry</label>
              <input
                type="text"
                className="payment-mock-form__card-input"
                value="12/28"
                readOnly
                aria-label="Mock expiry date"
              />
            </div>
            <div className="payment-mock-form__card-field">
              <label className="payment-mock-form__card-label">CVV</label>
              <input
                type="text"
                className="payment-mock-form__card-input"
                value="123"
                readOnly
                aria-label="Mock CVV"
              />
            </div>
            <div className="payment-mock-form__card-field payment-mock-form__card-field--wide">
              <label className="payment-mock-form__card-label">Name on Card</label>
              <input
                type="text"
                className="payment-mock-form__card-input"
                value="Test User"
                readOnly
                aria-label="Mock cardholder name"
              />
            </div>
          </div>
          <p className="payment-mock-form__card-note">These are pre-filled mock values for testing only.</p>
        </div>

        {config && (
          <div
            className="payment-mock-form__result"
            style={{ background: config.bg, borderColor: config.border, color: config.color }}
            role="alert"
          >
            <span className="payment-mock-form__result-icon">{config.icon}</span>
            <span className="payment-mock-form__result-message">{config.message}</span>
          </div>
        )}

        <button
          type="submit"
          className="payment-mock-form__submit"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? (
            <span className="payment-mock-form__spinner" aria-label="Processing">Processing…</span>
          ) : (
            'Pay Now'
          )}
        </button>
      </form>

      <style>{`
        .payment-mock-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .payment-mock-form__test-banner {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 0.375rem;
          padding: 0.5rem 0.875rem;
        }
        .payment-mock-form__test-badge {
          background: #f59e0b;
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          letter-spacing: 0.05em;
        }
        .payment-mock-form__test-note { font-size: 0.8125rem; color: #92400e; }
        .payment-mock-form__fieldset { border: none; padding: 0; margin: 0; }
        .payment-mock-form__legend {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
        }
        .payment-mock-form__options { display: flex; flex-direction: column; gap: 0.5rem; }
        .payment-mock-form__option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1.5px solid #d1d5db;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: #fff;
        }
        .payment-mock-form__option--selected { border-color: #2563eb; background: #eff6ff; }
        .payment-mock-form__radio { margin-top: 0.1rem; cursor: pointer; accent-color: #2563eb; }
        .payment-mock-form__option-text { display: flex; flex-direction: column; gap: 0.125rem; }
        .payment-mock-form__option-label { font-size: 0.9375rem; font-weight: 500; color: #111827; }
        .payment-mock-form__option-desc { font-size: 0.8125rem; color: #6b7280; }
        .payment-mock-form__card-placeholder {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .payment-mock-form__card-row { display: flex; gap: 0.75rem; }
        .payment-mock-form__card-field { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
        .payment-mock-form__card-field--full { flex: 1 0 100%; }
        .payment-mock-form__card-field--wide { flex: 2; }
        .payment-mock-form__card-label { font-size: 0.75rem; color: #6b7280; font-weight: 500; }
        .payment-mock-form__card-input {
          padding: 0.4rem 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.9rem;
          background: #fff;
          color: #9ca3af;
          outline: none;
        }
        .payment-mock-form__card-note { font-size: 0.75rem; color: #9ca3af; margin: 0; }
        .payment-mock-form__result {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.75rem 1rem;
          border: 1.5px solid;
          border-radius: 0.375rem;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .payment-mock-form__result-icon { font-size: 1.1rem; }
        .payment-mock-form__submit {
          width: 100%;
          padding: 0.75rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .payment-mock-form__submit:hover:not(:disabled) { background: #1d4ed8; }
        .payment-mock-form__submit:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

PaymentMockForm.propTypes = {
  onPaymentResult: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

PaymentMockForm.defaultProps = {
  onPaymentResult: null,
  isSubmitting: false,
};

export default PaymentMockForm;

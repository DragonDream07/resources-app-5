import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ShippingBadge from './ShippingBadge';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function OrderSummaryPanel({ items, subtotal, discount, promoCode, taxAmount, onApplyPromo, onRemovePromo }) {
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const shippingCharge = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = subtotal - discount + shippingCharge + (taxAmount || 0);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      await onApplyPromo(promoInput.trim());
      setPromoInput('');
    } catch (err) {
      setPromoError(err?.message || 'Invalid or expired promo code.');
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <aside className="order-summary-panel">
      <h2 className="order-summary-panel__title">Order Summary</h2>

      {items && items.length > 0 && (
        <ul className="order-summary-panel__items">
          {items.map((item) => (
            <li key={item.id} className="order-summary-panel__item">
              <div className="order-summary-panel__item-info">
                <span className="order-summary-panel__item-name">{item.name}</span>
                {item.variantLabel && (
                  <span className="order-summary-panel__item-variant">{item.variantLabel}</span>
                )}
              </div>
              <div className="order-summary-panel__item-right">
                <span className="order-summary-panel__item-qty">×{item.quantity}</span>
                <span className="order-summary-panel__item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="order-summary-panel__shipping-badge">
        <ShippingBadge orderTotal={subtotal - discount} />
      </div>

      <div className="order-summary-panel__totals">
        <div className="order-summary-panel__row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="order-summary-panel__row order-summary-panel__row--discount">
            <span>Discount{promoCode ? ` (${promoCode})` : ''}</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="order-summary-panel__row">
          <span>Shipping</span>
          <span className={shippingCharge === 0 ? 'order-summary-panel__free' : ''}>
            {shippingCharge === 0 ? 'FREE' : formatPrice(shippingCharge)}
          </span>
        </div>
        {taxAmount > 0 && (
          <div className="order-summary-panel__row">
            <span>GST / Taxes</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
        )}
        <div className="order-summary-panel__row order-summary-panel__row--total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {onApplyPromo && (
        <div className="order-summary-panel__promo">
          {promoCode ? (
            <div className="order-summary-panel__promo-applied">
              <span>Promo <strong>{promoCode}</strong> applied</span>
              <button
                type="button"
                className="order-summary-panel__promo-remove"
                onClick={onRemovePromo}
              >
                Remove
              </button>
            </div>
          ) : (
            <form className="order-summary-panel__promo-form" onSubmit={handleApplyPromo}>
              <input
                type="text"
                className="order-summary-panel__promo-input"
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                aria-label="Promo code"
              />
              <button
                type="submit"
                className="order-summary-panel__promo-btn"
                disabled={promoLoading || !promoInput.trim()}
              >
                {promoLoading ? '…' : 'Apply'}
              </button>
            </form>
          )}
          {promoError && <p className="order-summary-panel__promo-error">{promoError}</p>}
        </div>
      )}

      <style>{`
        .order-summary-panel {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .order-summary-panel__title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        .order-summary-panel__items {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.75rem;
        }
        .order-summary-panel__item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .order-summary-panel__item-info { display: flex; flex-direction: column; flex: 1; }
        .order-summary-panel__item-name { color: #374151; font-weight: 500; }
        .order-summary-panel__item-variant { font-size: 0.8125rem; color: #6b7280; }
        .order-summary-panel__item-right { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; }
        .order-summary-panel__item-qty { color: #6b7280; font-size: 0.8125rem; }
        .order-summary-panel__item-price { font-weight: 500; color: #111827; }
        .order-summary-panel__shipping-badge { padding-bottom: 0.25rem; }
        .order-summary-panel__totals { display: flex; flex-direction: column; gap: 0.5rem; }
        .order-summary-panel__row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #374151;
        }
        .order-summary-panel__row--discount { color: #16a34a; }
        .order-summary-panel__row--total {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          border-top: 1px solid #d1d5db;
          padding-top: 0.5rem;
          margin-top: 0.25rem;
        }
        .order-summary-panel__free { color: #16a34a; font-weight: 600; }
        .order-summary-panel__promo { display: flex; flex-direction: column; gap: 0.375rem; }
        .order-summary-panel__promo-form { display: flex; gap: 0.5rem; }
        .order-summary-panel__promo-input {
          flex: 1;
          padding: 0.4rem 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          outline: none;
        }
        .order-summary-panel__promo-input:focus { border-color: #2563eb; box-shadow: 0 0 0 2px #bfdbfe; }
        .order-summary-panel__promo-btn {
          padding: 0.4rem 0.875rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
        }
        .order-summary-panel__promo-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .order-summary-panel__promo-applied { display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: #16a34a; }
        .order-summary-panel__promo-remove {
          background: none;
          border: none;
          color: #dc2626;
          font-size: 0.8125rem;
          cursor: pointer;
          text-decoration: underline;
        }
        .order-summary-panel__promo-error { font-size: 0.8125rem; color: #dc2626; margin: 0; }
      `}</style>
    </aside>
  );
}

OrderSummaryPanel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      variantLabel: PropTypes.string,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ),
  subtotal: PropTypes.number.isRequired,
  discount: PropTypes.number,
  promoCode: PropTypes.string,
  taxAmount: PropTypes.number,
  onApplyPromo: PropTypes.func,
  onRemovePromo: PropTypes.func,
};

OrderSummaryPanel.defaultProps = {
  items: [],
  discount: 0,
  promoCode: null,
  taxAmount: 0,
  onApplyPromo: null,
  onRemovePromo: null,
};

export default OrderSummaryPanel;

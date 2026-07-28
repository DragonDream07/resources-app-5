import React from 'react';
import PropTypes from 'prop-types';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

function ShippingBadge({ orderTotal }) {
  const isFree = orderTotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFree = FREE_SHIPPING_THRESHOLD - orderTotal;

  if (isFree) {
    return (
      <div className="shipping-badge shipping-badge--free" role="status" aria-label="Free shipping applied">
        <span className="shipping-badge__icon" aria-hidden="true">🚚</span>
        <span className="shipping-badge__text">You've unlocked <strong>FREE shipping</strong>!</span>
        <style>{`
          .shipping-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.375rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            width: fit-content;
          }
          .shipping-badge--free {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #15803d;
          }
          .shipping-badge--paid {
            background: #fefce8;
            border: 1px solid #fde68a;
            color: #92400e;
          }
          .shipping-badge__icon { font-size: 1rem; line-height: 1; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="shipping-badge shipping-badge--paid" role="status" aria-label={`Shipping charge ₹${SHIPPING_CHARGE}`}>
      <span className="shipping-badge__icon" aria-hidden="true">🚚</span>
      <span className="shipping-badge__text">
        Add{' '}
        <strong>
          ₹{amountToFree.toLocaleString('en-IN')}
        </strong>{' '}
        more for <strong>FREE shipping</strong> · ₹{SHIPPING_CHARGE} charge applies
      </span>
      <style>{`
        .shipping-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          width: fit-content;
        }
        .shipping-badge--free {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }
        .shipping-badge--paid {
          background: #fefce8;
          border: 1px solid #fde68a;
          color: #92400e;
        }
        .shipping-badge__icon { font-size: 1rem; line-height: 1; }
      `}</style>
    </div>
  );
}

ShippingBadge.propTypes = {
  orderTotal: PropTypes.number.isRequired,
};

export default ShippingBadge;

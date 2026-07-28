import React from 'react';

function CartSummary({ subtotal, shippingCharge, discount, gst, grandTotal }) {
  const fmt = (value) =>
    Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>

      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span className="cart-summary__label">Subtotal</span>
          <span className="cart-summary__value">₹{fmt(subtotal)}</span>
        </div>

        <div className="cart-summary__row">
          <span className="cart-summary__label">Shipping</span>
          <span className="cart-summary__value">
            {Number(shippingCharge) === 0 ? (
              <span className="cart-summary__free">FREE</span>
            ) : (
              `₹${fmt(shippingCharge)}`
            )}
          </span>
        </div>

        {Number(discount) > 0 && (
          <div className="cart-summary__row cart-summary__row--discount">
            <span className="cart-summary__label">Discount</span>
            <span className="cart-summary__value cart-summary__value--discount">
              −₹{fmt(discount)}
            </span>
          </div>
        )}

        <div className="cart-summary__row">
          <span className="cart-summary__label">GST</span>
          <span className="cart-summary__value">₹{fmt(gst)}</span>
        </div>

        <div className="cart-summary__divider" />

        <div className="cart-summary__row cart-summary__row--total">
          <span className="cart-summary__label cart-summary__label--total">Grand Total</span>
          <span className="cart-summary__value cart-summary__value--total">₹{fmt(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;

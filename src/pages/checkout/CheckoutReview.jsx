import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '32px 16px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '24px',
    alignItems: 'start',
  },
  containerFull: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '8px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepCircle: (active, done) => ({
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: done ? '#37b24d' : active ? '#4c6ef5' : '#e9ecef',
    color: done || active ? '#ffffff' : '#495057',
  }),
  stepLabel: (active) => ({
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    color: active ? '#212529' : '#495057',
  }),
  stepDivider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#868e96',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
    lineHeight: '28px',
  },
  itemRow: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '16px',
  },
  itemImg: {
    width: '64px',
    height: '64px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#e9ecef',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '22px',
  },
  itemMeta: {
    fontSize: '13px',
    color: '#495057',
    lineHeight: '18px',
  },
  itemPrice: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#212529',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#495057',
    padding: '6px 0',
    lineHeight: '20px',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
    padding: '10px 0 0',
    borderTop: '2px solid #212529',
    marginTop: '6px',
    lineHeight: '24px',
  },
  promoRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    marginBottom: '4px',
  },
  promoInput: (hasError) => ({
    flex: 1,
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#f03e3e' : '#868e96'}`,
    borderRadius: '6px',
    fontSize: '14px',
    color: '#212529',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    outline: 'none',
    minHeight: '44px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    boxSizing: 'border-box',
  }),
  promoBtn: {
    padding: '10px 16px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    whiteSpace: 'nowrap',
  },
  promoSuccess: {
    fontSize: '13px',
    color: '#37b24d',
    marginTop: '4px',
    lineHeight: '18px',
  },
  promoError: {
    fontSize: '13px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '18px',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    marginTop: '8px',
  },
  outlineBtn: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    color: '#4c6ef5',
    border: '2px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
  },
  primaryBtn: (disabled) => ({
    padding: '12px 24px',
    backgroundColor: disabled ? '#adb5bd' : '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
  }),
  alertBox: (type) => ({
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    backgroundColor: type === 'error' ? '#ffe3e3' : '#d3f9d8',
    color: type === 'error' ? '#f03e3e' : '#37b24d',
    marginBottom: '16px',
  }),
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    height: '16px',
    marginBottom: '8px',
    animation: 'pulse 1.4s ease-in-out infinite',
  },
  shippingBadge: (free) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: free ? '#d3f9d8' : '#e8ecfd',
    color: free ? '#37b24d' : '#4c6ef5',
    marginLeft: '6px',
  }),
};

const STEPS = ['Address', 'Payment', 'Review'];

function CheckoutStepper({ current }) {
  return (
    <div style={styles.stepper}>
      {STEPS.map((label, idx) => (
        <>
          <div key={label} style={styles.stepItem}>
            <div style={styles.stepCircle(idx === current, idx < current)}>
              {idx < current ? '✓' : idx + 1}
            </div>
            <span style={styles.stepLabel(idx === current)}>{label}</span>
          </div>
          {idx < STEPS.length - 1 && <div key={`div-${idx}`} style={styles.stepDivider} />}
        </>
      ))}
    </div>
  );
}

export default function CheckoutReview() {
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState(null); // null | 'ok' | 'fail'
  const [promoMessage, setPromoMessage] = useState('');
  const [promoApplying, setPromoApplying] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/checkout/review', {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((r) => r.json())
      .then((data) => {
        setReview(data);
      })
      .catch(() => {
        setApiError('Failed to load order review. Please go back and try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoApplying(true);
    setPromoStatus(null);
    setPromoMessage('');
    const token = localStorage.getItem('token');
    try {
      const cartId = review?.cartId || localStorage.getItem('cartId');
      const r = await fetch(`/api/carts/${cartId}/promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase() }),
      });
      const data = await r.json();
      if (!r.ok) {
        setPromoStatus('fail');
        setPromoMessage(data.message || 'Promo code is invalid or expired.');
        return;
      }
      setPromoStatus('ok');
      setPromoMessage(data.message || 'Promo code applied successfully!');
      // Refresh review data
      const r2 = await fetch('/api/checkout/review', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const updated = await r2.json();
      setReview(updated);
    } catch {
      setPromoStatus('fail');
      setPromoMessage('Failed to apply promo code.');
    } finally {
      setPromoApplying(false);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setApiError('');
    try {
      const token = localStorage.getItem('token');
      const r = await fetch('/api/checkout/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });
      if (!r.ok) {
        const d = await r.json();
        setApiError(d.message || 'Failed to place order.');
        return;
      }
      const data = await r.json();
      const orderId = data.orderId || data.id || data.order?.id;
      if (orderId) localStorage.setItem('lastOrderId', orderId);
      navigate('/checkout/confirmation');
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const fmt = (n) =>
    typeof n === 'number'
      ? `₹${n.toFixed(2)}`
      : typeof n === 'string'
      ? `₹${parseFloat(n).toFixed(2)}`
      : '—';

  return (
    <div style={styles.page}>
      <div style={styles.containerFull}>
        <CheckoutStepper current={2} />
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '24px', lineHeight: '32px' }}>
          Review Your Order
        </h1>

        {apiError && <div style={styles.alertBox('error')}>{apiError}</div>}

        {loading ? (
          <div style={styles.card}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...styles.skeleton, width: `${60 + i * 10}%` }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
            <div>
              {/* Items */}
              <div style={styles.card}>
                <div style={styles.cardTitle}>Order Items</div>
                {review?.items?.length > 0 ? (
                  review.items.map((item) => (
                    <div key={item.id || item.skuId} style={styles.itemRow}>
                      <img
                        src={item.image || '/assets/images/placeholder-product.svg'}
                        alt={item.name}
                        style={styles.itemImg}
                        onError={(e) => { e.target.src = '/assets/images/placeholder-product.svg'; }}
                      />
                      <div style={styles.itemInfo}>
                        <div style={styles.itemName}>{item.name}</div>
                        {item.variant && <div style={styles.itemMeta}>Variant: {item.variant}</div>}
                        <div style={styles.itemMeta}>Qty: {item.quantity}</div>
                      </div>
                      <div style={styles.itemPrice}>{fmt(item.subtotal || item.price * item.quantity)}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#495057', fontSize: '14px' }}>No items found.</div>
                )}
              </div>

              {/* Delivery Address */}
              {review?.address && (
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Delivery Address</div>
                  <div style={{ fontSize: '14px', color: '#212529', lineHeight: '22px' }}>
                    <strong>{review.address.fullName}</strong><br />
                    {review.address.addressLine1}
                    {review.address.addressLine2 ? `, ${review.address.addressLine2}` : ''}<br />
                    {review.address.city}, {review.address.state} — {review.address.pinCode}<br />
                    Ph: {review.address.phone}
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {review?.paymentMethod && (
                <div style={styles.card}>
                  <div style={styles.cardTitle}>Payment Method</div>
                  <div style={{ fontSize: '14px', color: '#495057', lineHeight: '20px' }}>
                    {review.paymentMethod === 'card' && '💳 Credit / Debit Card'}
                    {review.paymentMethod === 'upi' && '📲 UPI'}
                    {review.paymentMethod === 'cod' && '💵 Cash on Delivery'}
                    {!['card', 'upi', 'cod'].includes(review.paymentMethod) && review.paymentMethod}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Order Summary</div>

                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{fmt(review?.subtotal)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>
                    Shipping
                    {review?.shippingCharge === 0 && (
                      <span style={styles.shippingBadge(true)}>FREE</span>
                    )}
                  </span>
                  <span>
                    {review?.shippingCharge === 0
                      ? 'Free'
                      : fmt(review?.shippingCharge)}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Tax (GST)</span>
                  <span>{fmt(review?.tax)}</span>
                </div>
                {review?.discount > 0 && (
                  <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                    <span>Discount</span>
                    <span>-{fmt(review.discount)}</span>
                  </div>
                )}
                <div style={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{fmt(review?.total)}</span>
                </div>

                {/* Promo Code */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #e9ecef', paddingTop: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#495057', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Promo Code
                  </label>
                  <div style={styles.promoRow}>
                    <input
                      style={styles.promoInput(promoStatus === 'fail')}
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoStatus(null);
                        setPromoMessage('');
                      }}
                      placeholder="ENTER CODE"
                      maxLength={20}
                    />
                    <button
                      style={styles.promoBtn}
                      onClick={handleApplyPromo}
                      disabled={promoApplying || !promoCode.trim()}
                      type="button"
                    >
                      {promoApplying ? '…' : 'Apply'}
                    </button>
                  </div>
                  {promoStatus === 'ok' && <div style={styles.promoSuccess}>✓ {promoMessage}</div>}
                  {promoStatus === 'fail' && <div style={styles.promoError}>✗ {promoMessage}</div>}
                </div>
              </div>

              <div style={styles.btnRow}>
                <button style={styles.outlineBtn} onClick={() => navigate('/checkout/payment')}>
                  ← Back
                </button>
                <button
                  style={styles.primaryBtn(placing)}
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? 'Placing…' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '48px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    maxWidth: '680px',
    width: '100%',
  },
  successIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontSize: '36px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    lineHeight: '40px',
    letterSpacing: '-0.02em',
    marginBottom: '8px',
  },
  sub: {
    fontSize: '16px',
    color: '#495057',
    textAlign: 'center',
    lineHeight: '24px',
    marginBottom: '32px',
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
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#495057',
    padding: '6px 0',
    lineHeight: '20px',
    borderBottom: '1px solid #f1f3f5',
  },
  rowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
    padding: '10px 0 0',
    lineHeight: '24px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#4c6ef5',
    fontWeight: '600',
    letterSpacing: '0.02em',
    lineHeight: '20px',
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
  },
  primaryBtn: {
    display: 'block',
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textAlign: 'center',
    textDecoration: 'none',
  },
  outlineBtn: {
    display: 'block',
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#ffffff',
    color: '#4c6ef5',
    border: '2px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box',
  },
  guestRegisterCard: {
    backgroundColor: '#e8ecfd',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  guestTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '24px',
  },
  guestSub: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  guestBtn: {
    padding: '10px 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    alignSelf: 'flex-start',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
  },
  deliveryNote: {
    padding: '12px 16px',
    backgroundColor: '#fff4e6',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#fd7e14',
    lineHeight: '20px',
    marginTop: '12px',
    fontWeight: '500',
  },
};

export default function CheckoutConfirmation() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = !localStorage.getItem('token');

  useEffect(() => {
    const orderId = localStorage.getItem('lastOrderId');
    if (!orderId) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    fetch(`/api/orders/${orderId}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((r) => r.json())
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) =>
    typeof n === 'number'
      ? `₹${n.toFixed(2)}`
      : typeof n === 'string'
      ? `₹${parseFloat(n).toFixed(2)}`
      : '—';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.heading}>Order Confirmed!</h1>
        <p style={styles.sub}>
          Thank you for your purchase. We've received your order and will start processing it shortly.
        </p>

        {!loading && order && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Order Details</div>
            <div style={styles.row}>
              <span>Order ID</span>
              <span style={styles.orderId}>#{order.id || order.orderId}</span>
            </div>
            {order.createdAt && (
              <div style={styles.row}>
                <span>Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}
            {order.status && (
              <div style={styles.row}>
                <span>Status</span>
                <span style={{ color: '#37b24d', fontWeight: '600', textTransform: 'capitalize' }}>{order.status}</span>
              </div>
            )}
            {order.paymentMethod && (
              <div style={styles.row}>
                <span>Payment</span>
                <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span>
              </div>
            )}
            {order.address && (
              <div style={styles.row}>
                <span>Deliver to</span>
                <span style={{ textAlign: 'right', maxWidth: '60%' }}>
                  {order.address.fullName}, {order.address.city} — {order.address.pinCode}
                </span>
              </div>
            )}
            {typeof order.total !== 'undefined' && (
              <div style={styles.rowLast}>
                <span>Total Paid</span>
                <span>{fmt(order.total)}</span>
              </div>
            )}
            {order.estimatedDelivery && (
              <div style={styles.deliveryNote}>
                🚚 Estimated delivery: {order.estimatedDelivery}
              </div>
            )}
          </div>
        )}

        {!loading && !order && (
          <div style={styles.card}>
            <div style={{ color: '#495057', fontSize: '14px', lineHeight: '20px' }}>
              Your order has been placed. You will receive a confirmation email shortly.
            </div>
          </div>
        )}

        {isGuest && (
          <div style={styles.guestRegisterCard}>
            <div style={styles.guestTitle}>Save your order history</div>
            <div style={styles.guestSub}>
              Create a free account to track your order, view past purchases, and enjoy a faster checkout next time.
            </div>
            <Link to="/checkout/register" style={styles.guestBtn}>
              Create Account
            </Link>
          </div>
        )}

        <div style={styles.btnGroup}>
          {!isGuest && (
            <Link to="/orders" style={styles.primaryBtn}>
              View My Orders
            </Link>
          )}
          <Link to="/" style={styles.outlineBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

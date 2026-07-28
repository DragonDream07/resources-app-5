import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#4c6ef5' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  'return requested': { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#f1f3f5', color: '#495057' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status?.toLowerCase()] || { bg: '#f1f3f5', color: '#495057' };
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: s.bg,
      color: s.color,
      borderRadius: '3px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '2px 8px',
    }}>
      {status}
    </span>
  );
}

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '16px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
    color: 'inherit',
    transition: 'box-shadow 0.15s',
  },
  orderRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#4c6ef5',
    fontWeight: '600',
    margin: '0 0 4px',
  },
  orderDate: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  orderTotal: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
    textAlign: 'right',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '16px',
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    height: '80px',
    marginBottom: '16px',
  },
  notifBtn: {
    background: 'none',
    border: 'none',
    color: '#4c6ef5',
    fontSize: '14px',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    marginBottom: '24px',
    display: 'block',
  },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setOrders(Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load orders. Please try again.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.heading}>Order history</h1>
          {[1, 2, 3].map(i => <div key={i} style={styles.skeleton} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <h1 style={styles.heading}>Order history</h1>
        <button style={styles.notifBtn} onClick={() => navigate('/account/notifications')}>Notifications</button>

        {error && <div style={styles.errorBanner}>{error}</div>}

        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#212529', margin: '0 0 8px' }}>No orders yet</p>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 24px' }}>Your order history is only available to registered users. Create an account to track orders.</p>
            <Link to="/" style={{ color: '#4c6ef5', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}>Continue shopping</Link>
          </div>
        ) : (
          orders.map(order => (
            <Link key={order.id} to={`/account/orders/${order.id}`} style={styles.card}>
              <div style={styles.orderRow}>
                <div>
                  <p style={styles.orderId}>#{order.id}</p>
                  <p style={styles.orderDate}>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#495057', margin: '4px 0 0' }}>
                    {order.item_count ? `${order.item_count} item${order.item_count !== 1 ? 's' : ''}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <StatusBadge status={order.status} />
                  <p style={styles.orderTotal}>
                    {order.total != null ? `£${Number(order.total).toFixed(2)}` : '—'}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

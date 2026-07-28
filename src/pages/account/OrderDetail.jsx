import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

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
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  heading: { fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '40px', color: '#212529', marginBottom: '8px' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '24px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#212529', marginBottom: '16px', marginTop: 0 },
  backLink: { display: 'inline-block', marginBottom: '16px', color: '#4c6ef5', fontSize: '14px', textDecoration: 'none' },
  errorBanner: { backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' },
  successBanner: { backgroundColor: '#d3f9d8', color: '#37b24d', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' },
  itemRow: { display: 'flex', gap: '16px', alignItems: 'flex-start', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #e9ecef' },
  itemImg: { width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  itemName: { fontSize: '16px', fontWeight: '600', color: '#212529', margin: '0 0 4px' },
  itemMeta: { fontSize: '14px', color: '#495057', margin: 0 },
  timelineItem: { display: 'flex', gap: '12px', marginBottom: '16px' },
  timelineDot: { width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#4c6ef5', marginTop: '4px', flexShrink: 0 },
  timelineText: { fontSize: '14px', color: '#212529' },
  timelineMeta: { fontSize: '12px', color: '#495057' },
  btnPrimary: { minHeight: '44px', padding: '0 24px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", marginRight: '12px' },
  btnDanger: { minHeight: '44px', padding: '0 24px', backgroundColor: 'transparent', color: '#f03e3e', border: '1px solid #f03e3e', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  skeleton: { backgroundColor: '#e9ecef', borderRadius: '6px', height: '120px', marginBottom: '24px' },
  orderIdCode: { fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '14px', color: '#495057' },
  fieldRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
};

const CANCELLABLE = ['pending', 'confirmed'];
const RETURNABLE = ['delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    Promise.all([
      fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => { if (!r.ok) throw new Error('not_found'); return r.json(); }),
      fetch(`/api/orders/${id}/timeline`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`/api/orders/${id}/tracking`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null).catch(() => null),
    ])
      .then(([orderData, timelineData, trackingData]) => {
        setOrder(orderData);
        setTimeline(Array.isArray(timelineData) ? timelineData : timelineData?.timeline || []);
        setTracking(trackingData);
      })
      .catch(() => setOrder('error'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${id}/cancel`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setOrder(prev => ({ ...prev, status: 'cancelled' }));
      setActionMsg({ type: 'success', text: 'Order cancelled successfully.' });
    } catch {
      setActionMsg({ type: 'error', text: 'Failed to cancel order. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.skeleton} />
          <div style={styles.skeleton} />
          <div style={styles.skeleton} />
        </div>
      </div>
    );
  }

  if (order === 'error' || !order) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card, borderLeft: '4px solid #f03e3e' }}>
            <p style={{ color: '#f03e3e', fontWeight: '600', margin: '0 0 8px' }}>Order not found or you do not have permission to view it.</p>
            <Link to="/account/orders" style={{ color: '#4c6ef5', fontSize: '14px' }}>← Back to order history</Link>
          </div>
        </div>
      </div>
    );
  }

  const statusLower = (order.status || '').toLowerCase();
  const canCancel = CANCELLABLE.includes(statusLower);
  const canReturn = RETURNABLE.includes(statusLower);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <a href="#" onClick={e => { e.preventDefault(); navigate('/account/orders'); }} style={{ ...styles.backLink, textDecoration: 'none' }}>
          ← Back to order history
        </a>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <h1 style={{ ...styles.heading, marginBottom: 0 }}>Order Detail</h1>
          <StatusBadge status={order.status} />
        </div>
        <p style={styles.orderIdCode}>Order #{order.id}</p>
        <p style={{ fontSize: '14px', color: '#495057', marginBottom: '24px' }}>
          Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
        </p>

        {actionMsg && (
          <div style={actionMsg.type === 'success' ? styles.successBanner : styles.errorBanner}>
            {actionMsg.text}
          </div>
        )}

        {/* Items */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Items</h2>
          {(order.items || []).map((item, idx) => (
            <div key={idx} style={{ ...styles.itemRow, ...(idx === (order.items.length - 1) ? { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : {}) }}>
              <img src={item.image_url || placeholderProduct} alt={item.name} style={styles.itemImg} />
              <div style={{ flex: 1 }}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemMeta}>Qty: {item.quantity} &bull; {item.sku && <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>{item.sku}</span>}</p>
              </div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#212529', margin: 0, flexShrink: 0 }}>
                {item.price != null ? `£${Number(item.price).toFixed(2)}` : '—'}
              </p>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '16px', marginTop: '8px' }}>
            <div style={styles.fieldRow}><span style={{ color: '#495057' }}>Subtotal</span><span style={{ fontWeight: '600' }}>{order.subtotal != null ? `£${Number(order.subtotal).toFixed(2)}` : '—'}</span></div>
            {order.discount != null && order.discount > 0 && (
              <div style={styles.fieldRow}><span style={{ color: '#495057' }}>Discount</span><span style={{ fontWeight: '600', color: '#37b24d' }}>-£{Number(order.discount).toFixed(2)}</span></div>
            )}
            <div style={styles.fieldRow}><span style={{ color: '#495057' }}>Shipping</span><span style={{ fontWeight: '600' }}>{order.shipping_cost != null ? `£${Number(order.shipping_cost).toFixed(2)}` : '—'}</span></div>
            <div style={{ ...styles.fieldRow, fontSize: '18px', fontWeight: '700', marginTop: '8px' }}><span>Total</span><span>{order.total != null ? `£${Number(order.total).toFixed(2)}` : '—'}</span></div>
          </div>
        </div>

        {/* Status timeline */}
        {timeline.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Order timeline</h2>
            {timeline.map((entry, idx) => (
              <div key={idx} style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: idx === 0 ? '#4c6ef5' : '#adb5bd' }} />
                <div>
                  <p style={{ ...styles.timelineText, margin: '0 0 2px' }}>{entry.status}</p>
                  <p style={{ ...styles.timelineMeta, margin: 0 }}>{entry.note}</p>
                  <p style={{ ...styles.timelineMeta, margin: 0 }}>
                    {entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tracking */}
        {tracking && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Tracking</h2>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 4px' }}>Carrier: <strong>{tracking.carrier}</strong></p>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 4px' }}>
              Tracking number: <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>{tracking.tracking_number}</span>
            </p>
            {tracking.tracking_url && (
              <a href={tracking.tracking_url} target="_blank" rel="noopener noreferrer" style={{ color: '#4c6ef5', fontSize: '14px' }}>
                Track shipment ↗
              </a>
            )}
          </div>
        )}

        {/* Delivery address */}
        {order.shipping_address && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Delivery address</h2>
            <p style={{ fontSize: '14px', color: '#212529', lineHeight: '1.5', margin: 0 }}>
              {order.shipping_address.full_name}<br />
              {order.shipping_address.line1}{order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}<br />
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
              {order.shipping_address.country}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginBottom: '24px' }}>
          {canCancel && (
            <button style={styles.btnDanger} onClick={handleCancel} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : 'Cancel order'}
            </button>
          )}
          {canReturn && (
            <Link to={`/account/orders/${id}/return`} style={{ ...styles.btnPrimary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', marginLeft: canCancel ? '12px' : 0 }}>
              Request return
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

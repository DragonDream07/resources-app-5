import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#3b5bdb' },
  shipped: { bg: '#e8ecfd', color: '#4c6ef5' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  return_requested: { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#ffe3e3', color: '#f03e3e' },
};

const STATUS_FLOW = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 14px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        backgroundColor: style.bg,
        color: style.color,
        lineHeight: '16px',
      }}
    >
      {status ? status.replace(/_/g, ' ') : '—'}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
        padding: '24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#212529',
        margin: '0 0 16px 0',
        lineHeight: '24px',
      }}
    >
      {children}
    </h2>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '8px 0',
        borderBottom: '1px solid #e9ecef',
        gap: '16px',
      }}
    >
      <span
        style={{
          fontSize: '13px',
          color: '#868e96',
          fontWeight: '500',
          letterSpacing: '0.01em',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#212529',
          textAlign: 'right',
          wordBreak: 'break-word',
        }}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}

function TimelineItem({ event, isLast }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#4c6ef5',
            border: '2px solid #e8ecfd',
            marginTop: '2px',
          }}
        />
        {!isLast && (
          <div
            style={{
              width: '2px',
              flexGrow: 1,
              backgroundColor: '#e9ecef',
              minHeight: '24px',
            }}
          />
        )}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : '20px', flex: 1 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#212529',
            textTransform: 'capitalize',
          }}
        >
          {(event.status || event.event || '').replace(/_/g, ' ')}
        </div>
        {event.note && (
          <div style={{ fontSize: '13px', color: '#495057', marginTop: '2px' }}>
            {event.note}
          </div>
        )}
        <div style={{ fontSize: '12px', color: '#868e96', marginTop: '4px' }}>
          {event.created_at
            ? new Date(event.created_at).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—'}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState(null);
  const [advanceSuccess, setAdvanceSuccess] = useState(null);

  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [reviewingReturn, setReviewingReturn] = useState(false);
  const [returnDecision, setReturnDecision] = useState('');
  const [returnNote, setReturnNote] = useState('');
  const [returnError, setReturnError] = useState(null);
  const [returnSuccess, setReturnSuccess] = useState(null);

  const token = () => localStorage.getItem('token');

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderRes, timelineRes, refundsRes] = await Promise.all([
        fetch(`/orders/${id}`, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(`/orders/${id}/timeline`, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(`/orders/${id}/refunds`, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      if (!orderRes.ok) throw new Error('Failed to load order');
      const orderData = await orderRes.json();
      setOrder(orderData.data || orderData.order || orderData);

      if (timelineRes.ok) {
        const tData = await timelineRes.json();
        setTimeline(tData.data || tData.timeline || tData || []);
      }
      if (refundsRes.ok) {
        const rData = await refundsRes.json();
        setRefunds(rData.data || rData.refunds || rData || []);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const canAdvance =
    order &&
    STATUS_FLOW.includes(order.status) &&
    STATUS_FLOW.indexOf(order.status) < STATUS_FLOW.length - 1;

  const nextStatus = canAdvance
    ? STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]
    : null;

  const canCancel =
    order && ['pending', 'confirmed', 'processing'].includes(order.status);

  const hasReturnRequest =
    order && order.status === 'return_requested';

  async function handleAdvance() {
    setAdvancing(true);
    setAdvanceError(null);
    setAdvanceSuccess(null);
    try {
      const res = await fetch(`/orders/${id}/advance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to advance order status');
      }
      setAdvanceSuccess(`Order advanced to ${nextStatus ? nextStatus.replace(/_/g, ' ') : 'next status'}`);
      await fetchOrder();
    } catch (err) {
      setAdvanceError(err.message);
    } finally {
      setAdvancing(false);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await fetch(`/orders/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to cancel order');
      }
      setShowCancelModal(false);
      setCancelReason('');
      await fetchOrder();
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  async function handleReturnReview() {
    if (!returnDecision) {
      setReturnError('Please select a decision.');
      return;
    }
    const returnRequestId =
      order.return_request_id ||
      (order.return_request && order.return_request.id);
    if (!returnRequestId) {
      setReturnError('No return request ID found.');
      return;
    }
    setReviewingReturn(true);
    setReturnError(null);
    setReturnSuccess(null);
    try {
      const res = await fetch(`/return-requests/${returnRequestId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ decision: returnDecision, note: returnNote }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to review return request');
      }
      setReturnSuccess(`Return request ${returnDecision}.`);
      setReturnDecision('');
      setReturnNote('');
      await fetchOrder();
    } catch (err) {
      setReturnError(err.message);
    } finally {
      setReviewingReturn(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #e8ecfd',
              borderTop: '3px solid #4c6ef5',
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ color: '#868e96', fontSize: '14px' }}>Loading order…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          padding: '24px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div
            style={{
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              padding: '16px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4c6ef5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const items = order.items || order.order_items || [];
  const address = order.shipping_address || order.address || null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '20px' }}>
          <Link
            to="/admin/orders"
            style={{
              fontSize: '14px',
              color: '#4c6ef5',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            ← Orders
          </Link>
        </nav>

        {/* Page header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  letterSpacing: '-0.01em',
                  lineHeight: '32px',
                  margin: 0,
                  color: '#212529',
                }}
              >
                Order{' '}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                    fontSize: '20px',
                  }}
                >
                  #{order.id || order.order_id}
                </span>
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p style={{ fontSize: '14px', color: '#868e96', margin: '6px 0 0 0' }}>
              Placed on{' '}
              {order.created_at
                ? new Date(order.created_at).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'}
            </p>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {canAdvance && (
              <button
                onClick={handleAdvance}
                disabled={advancing}
                style={{
                  padding: '10px 20px',
                  backgroundColor: advancing ? '#e9ecef' : '#4c6ef5',
                  color: advancing ? '#adb5bd' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: advancing ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                }}
              >
                {advancing
                  ? 'Advancing…'
                  : `Advance to ${nextStatus ? nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1).replace(/_/g, ' ') : ''}` }
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  color: '#f03e3e',
                  border: '1px solid #f03e3e',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Advance feedback */}
        {advanceSuccess && (
          <div
            style={{
              backgroundColor: '#d3f9d8',
              color: '#37b24d',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {advanceSuccess}
          </div>
        )}
        {advanceError && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            {advanceError}
          </div>
        )}

        {/* Main grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 320px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Order Items */}
            <Card>
              <SectionTitle>Order Items</SectionTitle>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                      {['Product', 'SKU', 'Qty', 'Unit Price', 'Total'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '8px 12px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#868e96',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ padding: '24px 12px', textAlign: 'center', color: '#868e96' }}
                        >
                          No items
                        </td>
                      </tr>
                    ) : (
                      items.map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '12px 12px' }}>
                            <div style={{ fontWeight: '500', color: '#212529' }}>
                              {item.product_name || item.name || '—'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 12px' }}>
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                                fontSize: '12px',
                                color: '#495057',
                              }}
                            >
                              {item.sku_code || item.sku || '—'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 12px', color: '#495057' }}>
                            {item.quantity ?? item.qty ?? '—'}
                          </td>
                          <td style={{ padding: '12px 12px', color: '#495057' }}>
                            ₹{Number(item.unit_price || item.price || 0).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td style={{ padding: '12px 12px', color: '#212529', fontWeight: '500' }}>
                            ₹{Number(
                              item.total_price ||
                                item.total ||
                                (item.unit_price || item.price || 0) * (item.quantity || item.qty || 1),
                              0
                            ).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div
                style={{
                  marginTop: '16px',
                  borderTop: '1px solid #e9ecef',
                  paddingTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  alignItems: 'flex-end',
                }}
              >
                {order.subtotal != null && (
                  <div style={{ fontSize: '14px', color: '#495057' }}>
                    Subtotal: ₹{Number(order.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
                {order.discount_amount != null && order.discount_amount > 0 && (
                  <div style={{ fontSize: '14px', color: '#37b24d' }}>
                    Discount: −₹{Number(order.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
                {order.shipping_amount != null && (
                  <div style={{ fontSize: '14px', color: '#495057' }}>
                    Shipping: ₹{Number(order.shipping_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#212529',
                    borderTop: '1px solid #e9ecef',
                    paddingTop: '8px',
                    minWidth: '160px',
                    textAlign: 'right',
                  }}
                >
                  Total: ₹{Number(order.total_amount ?? order.total ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <SectionTitle>Order Timeline</SectionTitle>
              {timeline.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#868e96', margin: 0 }}>No timeline events yet.</p>
              ) : (
                <div>
                  {timeline.map((event, idx) => (
                    <TimelineItem
                      key={event.id || idx}
                      event={event}
                      isLast={idx === timeline.length - 1}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Refunds */}
            {refunds.length > 0 && (
              <Card>
                <SectionTitle>Refunds</SectionTitle>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                      {['Refund ID', 'Amount', 'Status', 'Date'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '8px 0',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#868e96',
                            paddingRight: '16px',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map((refund, idx) => (
                      <tr key={refund.id || idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td
                          style={{
                            padding: '10px 0',
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '13px',
                            paddingRight: '16px',
                          }}
                        >
                          #{refund.id}
                        </td>
                        <td style={{ padding: '10px 0', paddingRight: '16px', fontWeight: '500' }}>
                          ₹{Number(refund.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '10px 0', paddingRight: '16px' }}>
                          <StatusBadge status={refund.status} />
                        </td>
                        <td style={{ padding: '10px 0', color: '#868e96', fontSize: '13px' }}>
                          {refund.created_at
                            ? new Date(refund.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {/* Return Request Review */}
            {hasReturnRequest && (
              <Card>
                <SectionTitle>Return Request Review</SectionTitle>
                {returnSuccess && (
                  <div
                    style={{
                      backgroundColor: '#d3f9d8',
                      color: '#37b24d',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      marginBottom: '16px',
                      fontSize: '14px',
                    }}
                  >
                    {returnSuccess}
                  </div>
                )}
                {returnError && (
                  <div
                    style={{
                      backgroundColor: '#ffe3e3',
                      color: '#f03e3e',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      marginBottom: '16px',
                      fontSize: '14px',
                    }}
                  >
                    {returnError}
                  </div>
                )}
                {order.return_request && (
                  <div style={{ marginBottom: '16px' }}>
                    <InfoRow label="Reason" value={order.return_request.reason} />
                    <InfoRow label="Requested on" value={order.return_request.created_at
                      ? new Date(order.return_request.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#495057',
                        marginBottom: '6px',
                      }}
                    >
                      Decision
                    </label>
                    <select
                      value={returnDecision}
                      onChange={(e) => setReturnDecision(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '14px',
                        borderRadius: '6px',
                        border: '1px solid #868e96',
                        color: '#212529',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">Select decision…</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#495057',
                        marginBottom: '6px',
                      }}
                    >
                      Note (optional)
                    </label>
                    <textarea
                      value={returnNote}
                      onChange={(e) => setReturnNote(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '14px',
                        borderRadius: '6px',
                        border: '1px solid #868e96',
                        color: '#212529',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: "inherit",
                        boxSizing: 'border-box',
                      }}
                      placeholder="Add a note to the customer…"
                    />
                  </div>
                  <button
                    onClick={handleReturnReview}
                    disabled={reviewingReturn}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: reviewingReturn ? '#e9ecef' : '#4c6ef5',
                      color: reviewingReturn ? '#adb5bd' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: reviewingReturn ? 'not-allowed' : 'pointer',
                      minHeight: '44px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {reviewingReturn ? 'Submitting…' : 'Submit Decision'}
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Order summary */}
            <Card>
              <SectionTitle>Order Summary</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <InfoRow
                  label="Order ID"
                  value={
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                        fontSize: '13px',
                      }}
                    >
                      #{order.id || order.order_id}
                    </span>
                  }
                />
                <InfoRow label="Status" value={<StatusBadge status={order.status} />} />
                <InfoRow
                  label="Payment Status"
                  value={
                    order.payment_status ? (
                      <StatusBadge status={order.payment_status} />
                    ) : (
                      '—'
                    )
                  }
                />
                <InfoRow
                  label="Payment Method"
                  value={order.payment_method || order.payment?.method || '—'}
                />
                {order.promo_code && (
                  <InfoRow
                    label="Promo Code"
                    value={
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          fontSize: '13px',
                        }}
                      >
                        {order.promo_code}
                      </span>
                    }
                  />
                )}
              </div>
            </Card>

            {/* Customer info */}
            <Card>
              <SectionTitle>Customer</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <InfoRow
                  label="Name"
                  value={
                    order.customer_name ||
                    (order.user && (order.user.name || `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim())) ||
                    '—'
                  }
                />
                <InfoRow
                  label="Email"
                  value={order.customer_email || order.user?.email || '—'}
                />
                <InfoRow
                  label="Phone"
                  value={order.customer_phone || order.user?.phone || '—'}
                />
                {order.user?.id && (
                  <div style={{ marginTop: '12px' }}>
                    <Link
                      to={`/admin/users/${order.user.id}`}
                      style={{
                        fontSize: '14px',
                        color: '#4c6ef5',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                    >
                      View customer profile →
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Shipping address */}
            {address && (
              <Card>
                <SectionTitle>Shipping Address</SectionTitle>
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#212529' }}>
                  {address.full_name && (
                    <div style={{ fontWeight: '500' }}>{address.full_name}</div>
                  )}
                  {address.line1 && <div>{address.line1}</div>}
                  {address.line2 && <div>{address.line2}</div>}
                  <div>
                    {[address.city, address.state, address.pincode]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  {address.country && <div>{address.country}</div>}
                  {address.phone && (
                    <div style={{ marginTop: '6px', color: '#868e96' }}>{address.phone}</div>
                  )}
                </div>
              </Card>
            )}

            {/* Tracking info */}
            {order.tracking && (
              <Card>
                <SectionTitle>Tracking</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {order.tracking.carrier && (
                    <InfoRow label="Carrier" value={order.tracking.carrier} />
                  )}
                  {order.tracking.tracking_number && (
                    <InfoRow
                      label="Tracking #"
                      value={
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '13px',
                          }}
                        >
                          {order.tracking.tracking_number}
                        </span>
                      }
                    />
                  )}
                  {order.tracking.url && (
                    <div style={{ marginTop: '10px' }}>
                      <a
                        href={order.tracking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '14px',
                          color: '#4c6ef5',
                          fontWeight: '500',
                          textDecoration: 'none',
                        }}
                      >
                        Track shipment →
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(33,37,41,0.48)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCancelModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 8px 32px rgba(33,37,41,0.18)',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: '#212529',
              }}
            >
              Cancel Order
            </h2>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 20px 0' }}>
              This action cannot be undone. Please provide a reason for cancellation.
            </p>

            {cancelError && (
              <div
                style={{
                  backgroundColor: '#ffe3e3',
                  color: '#f03e3e',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px',
                }}
              >
                {cancelError}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#495057',
                  marginBottom: '6px',
                }}
              >
                Reason (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  border: '1px solid #868e96',
                  color: '#212529',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                placeholder="Enter reason for cancellation…"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelError(null);
                  setCancelReason('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  color: '#495057',
                  border: '1px solid #868e96',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  padding: '10px 20px',
                  backgroundColor: cancelling ? '#e9ecef' : '#f03e3e',
                  color: cancelling ? '#adb5bd' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                }}
              >
                {cancelling ? 'Cancelling…' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

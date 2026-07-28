import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_BASE = '/api';

const STATUS_COLORS = {
  pending:   { bg: '#fff4e6', color: '#fd7e14', label: 'Pending' },
  approved:  { bg: '#d3f9d8', color: '#37b24d', label: 'Approved' },
  rejected:  { bg: '#ffe3e3', color: '#f03e3e', label: 'Rejected' },
  processed: { bg: '#e8ecfd', color: '#4c6ef5', label: 'Processed' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057', label: status };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: '9999px',
        backgroundColor: cfg.bg,
        color: cfg.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
      }}
    >
      {cfg.label}
    </span>
  );
}

function DetailCard({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #868e96',
        borderRadius: '10px',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#212529',
            margin: '0 0 16px 0',
            paddingBottom: '12px',
            borderBottom: '1px solid #e9ecef',
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function LabelValue({ label, value, mono }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <span
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#495057',
          marginBottom: '4px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#343a40',
          fontFamily: mono
            ? "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            : "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function AdminReturnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const [adminNotes, setAdminNotes]       = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // 'approve' | 'reject'

  const fetchReturnRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/return-requests/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to load return request: ${res.status}`);
      const data = await res.json();
      setReturnRequest(data.returnRequest || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReturnRequest();
  }, [fetchReturnRequest]);

  const handleReview = async (decision) => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/return-requests/${id}/review`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, adminNotes: adminNotes.trim() || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Action failed: ${res.status}`);
      }
      const data = await res.json();
      setReturnRequest(data.returnRequest || data);
      setActionSuccess(
        decision === 'approve'
          ? 'Return request approved successfully.'
          : 'Return request rejected successfully.'
      );
      setAdminNotes('');
      setConfirmAction(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const isPending = returnRequest?.status === 'pending';

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
          color: '#495057',
          fontSize: '16px',
        }}
      >
        Loading return request…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          padding: '32px 24px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Link
            to="/admin/returns"
            style={{ color: '#4c6ef5', textDecoration: 'none', fontSize: '14px' }}
          >
            ← Back to Return Requests
          </Link>
          <div
            style={{
              marginTop: '24px',
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              border: '1px solid #f03e3e',
              borderRadius: '6px',
              padding: '16px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!returnRequest) return null;

  const rr = returnRequest;

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
        <nav style={{ marginBottom: '24px' }}>
          <Link
            to="/admin/returns"
            style={{
              color: '#4c6ef5',
              textDecoration: 'none',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← Back to Return Requests
          </Link>
        </nav>

        {/* Page title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                lineHeight: '32px',
                margin: '0 0 8px 0',
                color: '#212529',
              }}
            >
              Return Request
            </h1>
            <span
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                fontSize: '14px',
                color: '#495057',
              }}
            >
              #{rr.id || rr.returnRequestId || id}
            </span>
          </div>
          <StatusBadge status={rr.status || 'pending'} />
        </div>

        {/* Success alert */}
        {actionSuccess && (
          <div
            style={{
              backgroundColor: '#d3f9d8',
              color: '#37b24d',
              border: '1px solid #37b24d',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{actionSuccess}</span>
            <button
              onClick={() => setActionSuccess(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#37b24d',
                fontSize: '18px',
                lineHeight: 1,
                padding: '0 4px',
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Action error */}
        {actionError && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              border: '1px solid #f03e3e',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#f03e3e',
                fontSize: '18px',
                lineHeight: 1,
                padding: '0 4px',
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 380px)',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div>
            {/* Return Info */}
            <DetailCard title="Return Information">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0 24px',
                }}
              >
                <LabelValue label="Return ID" value={rr.id || rr.returnRequestId || id} mono />
                <LabelValue
                  label="Order ID"
                  value={
                    rr.orderId ? (
                      <Link
                        to={`/admin/orders/${rr.orderId}`}
                        style={{ color: '#4c6ef5', textDecoration: 'none', fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}
                      >
                        {rr.orderId}
                      </Link>
                    ) : '—'
                  }
                />
                <LabelValue
                  label="Requested On"
                  value={rr.createdAt ? new Date(rr.createdAt).toLocaleString() : '—'}
                />
                <LabelValue
                  label="Updated At"
                  value={rr.updatedAt ? new Date(rr.updatedAt).toLocaleString() : '—'}
                />
              </div>

              <LabelValue label="Reason" value={rr.reason || '—'} />

              {rr.description && (
                <div style={{ marginBottom: '12px' }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#495057',
                      marginBottom: '4px',
                    }}
                  >
                    Description
                  </span>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#343a40',
                      lineHeight: '1.5',
                      margin: 0,
                    }}
                  >
                    {rr.description}
                  </p>
                </div>
              )}

              {rr.adminNotes && (
                <div
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '6px',
                    padding: '12px',
                    marginTop: '8px',
                  }}
                >
                  <span
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
                    Admin Notes
                  </span>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#343a40',
                      lineHeight: '1.5',
                      margin: 0,
                    }}
                  >
                    {rr.adminNotes}
                  </p>
                </div>
              )}
            </DetailCard>

            {/* Customer Info */}
            {(rr.user || rr.customerName || rr.customerEmail) && (
              <DetailCard title="Customer">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0 24px',
                  }}
                >
                  <LabelValue
                    label="Name"
                    value={rr.user?.name || rr.customerName || '—'}
                  />
                  <LabelValue
                    label="Email"
                    value={rr.user?.email || rr.customerEmail || '—'}
                  />
                </div>
              </DetailCard>
            )}

            {/* Return Items */}
            {Array.isArray(rr.items) && rr.items.length > 0 && (
              <DetailCard title="Items">
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '14px',
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                        {['Product', 'SKU', 'Qty', 'Reason'].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: '8px 12px',
                              textAlign: 'left',
                              fontSize: '12px',
                              fontWeight: '600',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              color: '#495057',
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rr.items.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          style={{ borderBottom: '1px solid #e9ecef' }}
                        >
                          <td style={{ padding: '10px 12px', color: '#343a40' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={item.imageUrl || '/src/assets/images/placeholder-product.svg'}
                                alt={item.productName || 'Product'}
                                width={40}
                                height={40}
                                style={{
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  border: '1px solid #e9ecef',
                                  flexShrink: 0,
                                }}
                              />
                              <span>{item.productName || item.name || '—'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span
                              style={{
                                fontFamily:
                                  "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                                fontSize: '13px',
                                color: '#495057',
                              }}
                            >
                              {item.skuCode || item.sku || '—'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#343a40' }}>
                            {item.quantity || item.qty || '—'}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#495057' }}>
                            {item.reason || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DetailCard>
            )}

            {/* Images / evidence */}
            {Array.isArray(rr.images) && rr.images.length > 0 && (
              <DetailCard title="Evidence Images">
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  {rr.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img.url || img}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={img.url || img}
                        alt={`Evidence ${idx + 1}`}
                        width={100}
                        height={100}
                        style={{
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #868e96',
                        }}
                      />
                    </a>
                  ))}
                </div>
              </DetailCard>
            )}
          </div>

          {/* Right column — action panel */}
          <div>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #868e96',
                borderRadius: '10px',
                padding: '24px',
                position: 'sticky',
                top: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#212529',
                  margin: '0 0 16px 0',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #e9ecef',
                }}
              >
                Review Decision
              </h2>

              {!isPending ? (
                <div
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    padding: '16px',
                    fontSize: '14px',
                    color: '#495057',
                    textAlign: 'center',
                  }}
                >
                  This return request has already been{' '}
                  <strong style={{ color: '#212529' }}>{rr.status}</strong>. No further action
                  required.
                </div>
              ) : (
                <>
                  {/* Confirm overlay inside card */}
                  {confirmAction ? (
                    <div>
                      <div
                        style={{
                          backgroundColor:
                            confirmAction === 'approve' ? '#d3f9d8' : '#ffe3e3',
                          border: `1px solid ${confirmAction === 'approve' ? '#37b24d' : '#f03e3e'}`,
                          borderRadius: '6px',
                          padding: '12px 16px',
                          marginBottom: '16px',
                          fontSize: '14px',
                          color: confirmAction === 'approve' ? '#37b24d' : '#f03e3e',
                        }}
                      >
                        Are you sure you want to{' '}
                        <strong>{confirmAction === 'approve' ? 'approve' : 'reject'}</strong> this
                        return request?
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => handleReview(confirmAction)}
                          disabled={actionLoading}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            backgroundColor:
                              confirmAction === 'approve' ? '#37b24d' : '#f03e3e',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                            opacity: actionLoading ? 0.7 : 1,
                            minHeight: '44px',
                          }}
                        >
                          {actionLoading
                            ? 'Processing…'
                            : `Yes, ${confirmAction === 'approve' ? 'Approve' : 'Reject'}`}
                        </button>
                        <button
                          onClick={() => setConfirmAction(null)}
                          disabled={actionLoading}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            backgroundColor: '#ffffff',
                            color: '#212529',
                            border: '1px solid #868e96',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                            minHeight: '44px',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: '20px' }}>
                        <label
                          htmlFor="admin-notes"
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
                          Admin Notes (optional)
                        </label>
                        <textarea
                          id="admin-notes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add internal notes about this decision…"
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #868e96',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#212529',
                            resize: 'vertical',
                            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                          onClick={() => setConfirmAction('approve')}
                          style={{
                            padding: '12px 20px',
                            backgroundColor: '#37b24d',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <img src="/src/assets/icons/check.svg" alt="" width={16} height={16} />
                          Approve Return
                        </button>

                        <button
                          onClick={() => setConfirmAction('reject')}
                          style={{
                            padding: '12px 20px',
                            backgroundColor: '#ffffff',
                            color: '#f03e3e',
                            border: '1px solid #f03e3e',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          Reject Return
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Link to order */}
              {rr.orderId && (
                <div
                  style={{
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e9ecef',
                  }}
                >
                  <Link
                    to={`/admin/orders/${rr.orderId}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#4c6ef5',
                      textDecoration: 'none',
                      fontSize: '14px',
                    }}
                  >
                    <img
                      src="/src/assets/icons/external-link.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                    View Order #{rr.orderId}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

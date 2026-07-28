import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

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
        padding: '2px 10px',
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

export default function AdminReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [page, setPage]     = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 20;

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`${API_BASE}/return-requests?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setReturns(data.data || data.returnRequests || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

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
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <Link
              to="/admin"
              style={{
                color: '#4c6ef5',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '8px',
              }}
            >
              <img src="/src/assets/icons/chevron-left.svg" alt="" width={16} height={16} />
              Back to Dashboard
            </Link>
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
              Return Requests
            </h1>
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label
              htmlFor="status-filter"
              style={{ fontSize: '14px', color: '#495057', fontWeight: '500' }}
            >
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilter}
              style={{
                padding: '8px 12px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#212529',
                backgroundColor: '#ffffff',
                minHeight: '44px',
                cursor: 'pointer',
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="processed">Processed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              border: '1px solid #f03e3e',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #868e96',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#495057',
                fontSize: '14px',
              }}
            >
              Loading return requests…
            </div>
          ) : returns.length === 0 ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#495057',
                fontSize: '14px',
              }}
            >
              <img
                src="/src/assets/images/empty-state.svg"
                alt="No returns"
                width={80}
                style={{ marginBottom: '16px', opacity: 0.6 }}
              />
              <p style={{ margin: 0 }}>No return requests found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid #868e96',
                    }}
                  >
                    {['Return ID', 'Order ID', 'Customer', 'Reason', 'Status', 'Requested On', ''].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#495057',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {returns.map((req, idx) => (
                    <tr
                      key={req.id || req.returnRequestId || idx}
                      style={{
                        borderBottom: '1px solid #e9ecef',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f8f9fa')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '13px',
                            color: '#343a40',
                          }}
                        >
                          {req.id || req.returnRequestId || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '13px',
                            color: '#343a40',
                          }}
                        >
                          {req.orderId || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#343a40' }}>
                        {req.customerName || req.user?.name || '—'}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#495057',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {req.reason || '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={req.status || 'pending'} />
                      </td>
                      <td style={{ padding: '14px 16px', color: '#495057' }}>
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link
                          to={`/admin/returns/${req.id || req.returnRequestId}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 14px',
                            backgroundColor: '#4c6ef5',
                            color: '#ffffff',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: '500',
                            minHeight: '32px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                backgroundColor: page === 1 ? '#e9ecef' : '#ffffff',
                color: page === 1 ? '#adb5bd' : '#212529',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                minHeight: '44px',
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: '14px', color: '#495057', padding: '0 8px' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '8px 16px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                backgroundColor: page === totalPages ? '#e9ecef' : '#ffffff',
                color: page === totalPages ? '#adb5bd' : '#212529',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                minHeight: '44px',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

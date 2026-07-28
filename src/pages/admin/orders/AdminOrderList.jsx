import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Return Requested', value: 'return_requested' },
  { label: 'Returned', value: 'returned' },
];

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

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
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

function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} style={{ padding: '16px 12px' }}>
          <div
            style={{
              height: '16px',
              borderRadius: '6px',
              backgroundColor: '#e9ecef',
              width: i === 0 ? '120px' : i === 1 ? '160px' : i === 2 ? '80px' : i === 3 ? '90px' : i === 4 ? '70px' : '60px',
            }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function AdminOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '');

  const statusFilter = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', '20');

      const token = localStorage.getItem('token');
      const res = await fetch(`/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.data || data.orders || []);
      setPagination({
        page: data.page || page,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleStatusChange(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('status', value);
    else next.delete('status');
    next.set('page', '1');
    setSearchParams(next);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (inputValue) next.set('search', inputValue);
    else next.delete('search');
    next.set('page', '1');
    setSearch(inputValue);
    setSearchParams(next);
  }

  function handlePage(newPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
  }

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
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                lineHeight: '40px',
                margin: '0 0 4px 0',
                color: '#212529',
              }}
            >
              Orders
            </h1>
            <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>
              Manage and advance customer orders
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ flex: '1 1 240px' }}>
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
                Search
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Order ID, customer name…"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  border: '1px solid #868e96',
                  outline: 'none',
                  color: '#212529',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4c6ef5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '44px',
                minWidth: '44px',
              }}
            >
              Search
            </button>
            {(search || inputValue) && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  setSearch('');
                  const next = new URLSearchParams(searchParams);
                  next.delete('search');
                  next.set('page', '1');
                  setSearchParams(next);
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  color: '#495057',
                  border: '1px solid #868e96',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Clear
              </button>
            )}
          </form>

          {/* Status Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '16px',
              flexWrap: 'wrap',
            }}
          >
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleStatusChange(f.value)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minHeight: '32px',
                  backgroundColor: statusFilter === f.value ? '#4c6ef5' : '#e9ecef',
                  color: statusFilter === f.value ? '#ffffff' : '#495057',
                  transition: 'background-color 0.15s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
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
            {error}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
            overflow: 'hidden',
          }}
        >
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
                    borderBottom: '2px solid #e9ecef',
                  }}
                >
                  {['Order ID', 'Customer', 'Status', 'Total', 'Items', 'Date'].map((h) => (
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
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: '64px 24px',
                        textAlign: 'center',
                        color: '#868e96',
                      }}
                    >
                      <img
                        src="/src/assets/images/empty-state.svg"
                        alt=""
                        style={{ width: '80px', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }}
                      />
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#495057', margin: '0 0 4px' }}>
                        No orders found
                      </p>
                      <p style={{ fontSize: '14px', color: '#868e96', margin: 0 }}>
                        Try adjusting your filters or search term.
                      </p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr
                      key={order.id || order.order_id || idx}
                      style={{
                        borderBottom: '1px solid #e9ecef',
                        transition: 'background-color 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <Link
                          to={`/admin/orders/${order.id || order.order_id}`}
                          style={{
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '13px',
                            color: '#4c6ef5',
                            textDecoration: 'none',
                            fontWeight: '500',
                          }}
                        >
                          #{order.id || order.order_id}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#212529' }}>
                        <div style={{ fontWeight: '500' }}>
                          {order.customer_name ||
                            (order.user && (order.user.name || order.user.email)) ||
                            '—'}
                        </div>
                        {order.user?.email && (
                          <div style={{ fontSize: '12px', color: '#868e96' }}>{order.user.email}</div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ padding: '14px 16px', color: '#212529', fontWeight: '500' }}>
                        ₹{Number(order.total_amount ?? order.total ?? 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#495057' }}>
                        {order.item_count ?? order.items?.length ?? '—'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#495057', whiteSpace: 'nowrap' }}>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderTop: '1px solid #e9ecef',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '14px', color: '#495057' }}>
                Page {pagination.page} of {pagination.totalPages}
                {pagination.total ? ` · ${pagination.total} orders` : ''}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handlePage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #868e96',
                    backgroundColor: pagination.page <= 1 ? '#e9ecef' : '#ffffff',
                    color: pagination.page <= 1 ? '#adb5bd' : '#212529',
                    cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    minHeight: '44px',
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #868e96',
                    backgroundColor: pagination.page >= pagination.totalPages ? '#e9ecef' : '#ffffff',
                    color: pagination.page >= pagination.totalPages ? '#adb5bd' : '#212529',
                    cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    minHeight: '44px',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #868e96',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    margin: 0,
  },
  headerNav: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  navLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4c6ef5',
    textDecoration: 'none',
    lineHeight: '20px',
  },
  navLinkActive: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b5bdb',
    textDecoration: 'underline',
    lineHeight: '20px',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0 0 32px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    border: '1px solid #e9ecef',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    lineHeight: '16px',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '4px',
  },
  statChange: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
    color: '#495057',
  },
  statChangePositive: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
    color: '#37b24d',
  },
  statChangeNegative: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
    color: '#f03e3e',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    margin: '0 0 16px 0',
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  tile: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    border: '1px solid #e9ecef',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textDecoration: 'none',
    color: '#212529',
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
    cursor: 'pointer',
  },
  tileIconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: '#e8ecfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIcon: {
    width: '22px',
    height: '22px',
  },
  tileTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
  },
  tileDesc: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
  },
  tileArrow: {
    fontSize: '14px',
    color: '#4c6ef5',
    fontWeight: '500',
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  recentSection: {
    marginBottom: '40px',
  },
  tableWrap: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    lineHeight: '20px',
  },
  thead: {
    backgroundColor: '#f8f9fa',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    borderBottom: '1px solid #e9ecef',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    color: '#212529',
    verticalAlign: 'middle',
  },
  tdMono: {
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    color: '#212529',
    verticalAlign: 'middle',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '13px',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
  },
  badgePending: {
    backgroundColor: '#fff4e6',
    color: '#fd7e14',
  },
  badgeSuccess: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
  },
  badgeError: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
  },
  badgeInfo: {
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
  },
  loadingWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: '#495057',
    fontSize: '14px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#f03e3e',
    fontSize: '14px',
    marginBottom: '24px',
  },
};

const ORDER_STATUS_BADGE = {
  pending: styles.badgePending,
  placed: styles.badgeInfo,
  confirmed: styles.badgeInfo,
  shipped: styles.badgeInfo,
  delivered: styles.badgeSuccess,
  cancelled: styles.badgeError,
  returned: styles.badgeError,
};

const QUICK_ACCESS_TILES = [
  {
    to: '/admin/reports',
    title: 'Reports',
    desc: 'View consolidated business reports and analytics.',
    icon: null,
    iconLabel: '📊',
  },
  {
    to: '/admin/orders',
    title: 'Orders',
    desc: 'Manage and process all customer orders.',
    icon: null,
    iconLabel: '📦',
  },
  {
    to: '/admin/products',
    title: 'Products',
    desc: 'Add, edit, and manage product catalogue.',
    icon: null,
    iconLabel: '🛍️',
  },
  {
    to: '/admin/categories',
    title: 'Categories',
    desc: 'Organise product categories and hierarchies.',
    icon: null,
    iconLabel: '🗂️',
  },
  {
    to: '/admin/promo-codes',
    title: 'Promo Codes',
    desc: 'Create and manage promotional discounts.',
    icon: null,
    iconLabel: '🏷️',
  },
  {
    to: '/admin/returns',
    title: 'Returns',
    desc: 'Review and process return requests.',
    icon: null,
    iconLabel: '↩️',
  },
];

function formatCurrency(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusBadge({ status }) {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';
  const extra = ORDER_STATUS_BADGE[status] || styles.badgeInfo;
  return (
    <span style={{ ...styles.badge, ...extra }}>{label}</span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [reportsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/reports', { headers }),
          fetch('/api/orders?limit=10&sort=created_at:desc', { headers }),
        ]);

        if (!reportsRes.ok) throw new Error('Failed to load admin reports.');
        if (!ordersRes.ok) throw new Error('Failed to load recent orders.');

        const reportsData = await reportsRes.json();
        const ordersData = await ordersRes.json();

        if (!cancelled) {
          setStats(reportsData.data || reportsData);
          setRecentOrders(
            (ordersData.data || ordersData.orders || []).slice(0, 10)
          );
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'An error occurred.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboardData();
    return () => { cancelled = true; };
  }, []);

  const summaryStats = [
    {
      label: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue ?? stats.total_revenue) : '—',
      change: null,
    },
    {
      label: 'Total Orders',
      value: stats ? (stats.totalOrders ?? stats.total_orders ?? '—') : '—',
      change: null,
    },
    {
      label: 'Pending Orders',
      value: stats ? (stats.pendingOrders ?? stats.pending_orders ?? '—') : '—',
      change: null,
    },
    {
      label: 'Total Users',
      value: stats ? (stats.totalUsers ?? stats.total_users ?? '—') : '—',
      change: null,
    },
    {
      label: 'Return Requests',
      value: stats ? (stats.openReturnRequests ?? stats.open_return_requests ?? '—') : '—',
      change: null,
    },
    {
      label: 'Active Promo Codes',
      value: stats ? (stats.activePromoCodes ?? stats.active_promo_codes ?? '—') : '—',
      change: null,
    },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <nav style={styles.headerNav}>
          <Link to="/admin" style={styles.navLinkActive}>Dashboard</Link>
          <Link to="/admin/reports" style={styles.navLink}>Reports</Link>
          <Link to="/" style={styles.navLink}>← Storefront</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <h2 style={styles.pageTitle}>Admin Dashboard</h2>

        {error && (
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingWrap} aria-live="polite">Loading dashboard…</div>
        ) : (
          <>
            <section aria-labelledby="stats-heading">
              <h3 id="stats-heading" style={styles.sectionTitle}>Overview</h3>
              <div style={styles.statsGrid}>
                {summaryStats.map((stat) => (
                  <div key={stat.label} style={styles.statCard}>
                    <div style={styles.statLabel}>{stat.label}</div>
                    <div style={styles.statValue}>{stat.value}</div>
                    {stat.change != null && (
                      <div
                        style={
                          stat.change > 0
                            ? styles.statChangePositive
                            : stat.change < 0
                            ? styles.statChangeNegative
                            : styles.statChange
                        }
                      >
                        {stat.change > 0 ? '+' : ''}{stat.change}% vs last period
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="quick-access-heading" style={{ marginBottom: '40px' }}>
              <h3 id="quick-access-heading" style={styles.sectionTitle}>Quick Access</h3>
              <div style={styles.tilesGrid}>
                {QUICK_ACCESS_TILES.map((tile) => (
                  <Link
                    key={tile.to}
                    to={tile.to}
                    style={styles.tile}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(76,110,245,0.15)';
                      e.currentTarget.style.borderColor = '#4c6ef5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(33,37,41,0.08)';
                      e.currentTarget.style.borderColor = '#e9ecef';
                    }}
                  >
                    <div style={styles.tileIconWrap} aria-hidden="true">
                      <span style={{ fontSize: '20px' }}>{tile.iconLabel}</span>
                    </div>
                    <div style={styles.tileTitle}>{tile.title}</div>
                    <div style={styles.tileDesc}>{tile.desc}</div>
                    <div style={styles.tileArrow}>Go to {tile.title} →</div>
                  </Link>
                ))}
              </div>
            </section>

            <section style={styles.recentSection} aria-labelledby="recent-orders-heading">
              <h3 id="recent-orders-heading" style={styles.sectionTitle}>Recent Orders</h3>
              <div style={styles.tableWrap}>
                {recentOrders.length === 0 ? (
                  <div style={styles.loadingWrap}>No recent orders found.</div>
                ) : (
                  <table style={styles.table} aria-label="Recent orders">
                    <thead style={styles.thead}>
                      <tr>
                        <th style={styles.th}>Order ID</th>
                        <th style={styles.th}>Customer</th>
                        <th style={styles.th}>Total</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, idx) => (
                        <tr
                          key={order.id || order.order_id || idx}
                          style={idx === recentOrders.length - 1 ? { ...styles.td, borderBottom: 'none' } : {}}
                        >
                          <td style={styles.tdMono}>
                            {order.id || order.order_id || '—'}
                          </td>
                          <td style={styles.td}>
                            {order.user?.name ||
                              order.customer_name ||
                              order.user?.email ||
                              '—'}
                          </td>
                          <td style={styles.td}>
                            {formatCurrency(order.total_amount ?? order.total)}
                          </td>
                          <td style={styles.td}>
                            <StatusBadge status={order.status} />
                          </td>
                          <td style={styles.td}>
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString('en-IN', {
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
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

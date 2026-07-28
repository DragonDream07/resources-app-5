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
    margin: '0 0 8px 0',
  },
  pageSubtitle: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    color: '#495057',
    margin: '0 0 32px 0',
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'flex-end',
    marginBottom: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    border: '1px solid #e9ecef',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '160px',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#212529',
    backgroundColor: '#ffffff',
    minHeight: '44px',
    cursor: 'pointer',
    outline: 'none',
  },
  filterInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#212529',
    backgroundColor: '#ffffff',
    minHeight: '44px',
    outline: 'none',
  },
  btnPrimary: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s ease',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    margin: '0 0 16px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    border: '1px solid #e9ecef',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '36px',
    color: '#212529',
  },
  statValueHighlight: {
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '36px',
    color: '#4c6ef5',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    border: '1px solid #e9ecef',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    margin: '0 0 16px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  tableWrap: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    border: '1px solid #e9ecef',
    overflow: 'auto',
    marginBottom: '40px',
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
  thRight: {
    padding: '12px 16px',
    textAlign: 'right',
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
  tdRight: {
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    color: '#212529',
    verticalAlign: 'middle',
    textAlign: 'right',
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
  badgeSuccess: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
  },
  badgeWarning: {
    backgroundColor: '#fff4e6',
    color: '#fd7e14',
  },
  badgeError: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
  },
  badgeInfo: {
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  barLabel: {
    fontSize: '13px',
    color: '#495057',
    minWidth: '120px',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  barTrack: {
    flex: 1,
    height: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  barFill: {
    height: '10px',
    backgroundColor: '#4c6ef5',
    borderRadius: '9999px',
    transition: 'width 0.4s ease',
  },
  barValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#212529',
    minWidth: '64px',
    textAlign: 'right',
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#495057',
    fontSize: '14px',
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

function formatCurrency(value) {
  if (value == null || value === '') return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN').format(value);
}

function StatusBadge({ status }) {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';
  const map = {
    active: styles.badgeSuccess,
    inactive: styles.badgeError,
    expired: styles.badgeError,
    pending: styles.badgeWarning,
    approved: styles.badgeSuccess,
    rejected: styles.badgeError,
  };
  const extra = map[status?.toLowerCase()] || styles.badgeInfo;
  return <span style={{ ...styles.badge, ...extra }}>{label}</span>;
}

function BarChart({ rows, valueFormatter }) {
  if (!rows || rows.length === 0) {
    return <div style={styles.emptyState}>No data available.</div>;
  }
  const max = Math.max(...rows.map((r) => r.value || 0), 1);
  return (
    <div>
      {rows.map((row, i) => (
        <div key={i} style={styles.barRow}>
          <span style={styles.barLabel} title={row.label}>{row.label}</span>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                width: `${Math.round((row.value / max) * 100)}%`,
              }}
            />
          </div>
          <span style={styles.barValue}>
            {valueFormatter ? valueFormatter(row.value) : formatNumber(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

const PERIODS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'This year', value: '1y' },
];

export default function AdminReports() {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`/api/admin/reports?period=${period}`, { headers });
        if (!res.ok) throw new Error('Failed to load reports.');
        const json = await res.json();

        if (!cancelled) {
          setData(json.data || json);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'An error occurred.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReports();
    return () => { cancelled = true; };
  }, [period]);

  const summaryStats = data
    ? [
        {
          label: 'Total Revenue',
          value: formatCurrency(data.totalRevenue ?? data.total_revenue),
          highlight: true,
        },
        {
          label: 'Total Orders',
          value: formatNumber(data.totalOrders ?? data.total_orders),
          highlight: false,
        },
        {
          label: 'Avg Order Value',
          value: formatCurrency(data.avgOrderValue ?? data.avg_order_value),
          highlight: false,
        },
        {
          label: 'Total Users',
          value: formatNumber(data.totalUsers ?? data.total_users),
          highlight: false,
        },
        {
          label: 'Return Requests',
          value: formatNumber(data.totalReturns ?? data.total_returns ?? data.openReturnRequests ?? data.open_return_requests),
          highlight: false,
        },
        {
          label: 'Active Promos',
          value: formatNumber(data.activePromoCodes ?? data.active_promo_codes),
          highlight: false,
        },
      ]
    : [];

  const topProducts = data?.topProducts ?? data?.top_products ?? [];
  const topCategories = data?.topCategories ?? data?.top_categories ?? [];
  const ordersByStatus = data?.ordersByStatus ?? data?.orders_by_status ?? [];
  const revenueByPeriod = data?.revenueByPeriod ?? data?.revenue_by_period ?? [];
  const recentReturnRequests = data?.recentReturnRequests ?? data?.recent_return_requests ?? [];
  const promoCodes = data?.promoCodes ?? data?.promo_codes ?? [];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <nav style={styles.headerNav}>
          <Link to="/admin" style={styles.navLink}>Dashboard</Link>
          <Link to="/admin/reports" style={styles.navLinkActive}>Reports</Link>
          <Link to="/" style={styles.navLink}>← Storefront</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <h2 style={styles.pageTitle}>Business Reports</h2>
        <p style={styles.pageSubtitle}>Consolidated view of business performance and key metrics.</p>

        {error && (
          <div style={styles.errorBanner} role="alert">{error}</div>
        )}

        <div style={styles.filtersRow}>
          <div style={styles.filterGroup}>
            <label htmlFor="period-filter" style={styles.filterLabel}>Period</label>
            <select
              id="period-filter"
              style={styles.filterSelect}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <button
            style={styles.btnPrimary}
            onClick={() => setPeriod(period)}
            aria-label="Refresh reports"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingWrap} aria-live="polite">Loading reports…</div>
        ) : (
          <>
            <section aria-labelledby="summary-heading">
              <h3 id="summary-heading" style={styles.sectionTitle}>Summary</h3>
              <div style={styles.statsGrid}>
                {summaryStats.map((stat) => (
                  <div key={stat.label} style={styles.statCard}>
                    <div style={styles.statLabel}>{stat.label}</div>
                    <div style={stat.highlight ? styles.statValueHighlight : styles.statValue}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div style={styles.twoCol}>
              <div style={styles.card}>
                <h4 style={styles.cardTitle}>Top Products by Revenue</h4>
                {topProducts.length === 0 ? (
                  <div style={styles.emptyState}>No data available.</div>
                ) : (
                  <BarChart
                    rows={topProducts.map((p) => ({
                      label: p.name || p.product_name || 'Product',
                      value: p.revenue ?? p.total_revenue ?? 0,
                    }))}
                    valueFormatter={formatCurrency}
                  />
                )}
              </div>

              <div style={styles.card}>
                <h4 style={styles.cardTitle}>Top Categories by Orders</h4>
                {topCategories.length === 0 ? (
                  <div style={styles.emptyState}>No data available.</div>
                ) : (
                  <BarChart
                    rows={topCategories.map((c) => ({
                      label: c.name || c.category_name || 'Category',
                      value: c.orders ?? c.total_orders ?? 0,
                    }))}
                    valueFormatter={formatNumber}
                  />
                )}
              </div>
            </div>

            <section aria-labelledby="orders-status-heading" style={{ marginBottom: '40px' }}>
              <h3 id="orders-status-heading" style={styles.sectionTitle}>Orders by Status</h3>
              <div style={styles.tableWrap}>
                {ordersByStatus.length === 0 ? (
                  <div style={styles.emptyState}>No data available.</div>
                ) : (
                  <table style={styles.table} aria-label="Orders by status">
                    <thead style={styles.thead}>
                      <tr>
                        <th style={styles.th}>Status</th>
                        <th style={styles.thRight}>Count</th>
                        <th style={styles.thRight}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersByStatus.map((row, idx) => (
                        <tr key={row.status || idx}>
                          <td style={styles.td}>
                            <StatusBadge status={row.status} />
                          </td>
                          <td style={styles.tdRight}>{formatNumber(row.count)}</td>
                          <td style={styles.tdRight}>{formatCurrency(row.revenue ?? row.total_revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {revenueByPeriod.length > 0 && (
              <section aria-labelledby="revenue-trend-heading" style={{ marginBottom: '40px' }}>
                <h3 id="revenue-trend-heading" style={styles.sectionTitle}>Revenue Trend</h3>
                <div style={styles.card}>
                  <BarChart
                    rows={revenueByPeriod.map((r) => ({
                      label: r.period || r.date || r.label || '',
                      value: r.revenue ?? r.total ?? 0,
                    }))}
                    valueFormatter={formatCurrency}
                  />
                </div>
              </section>
            )}

            <section aria-labelledby="returns-heading" style={{ marginBottom: '40px' }}>
              <h3 id="returns-heading" style={styles.sectionTitle}>Recent Return Requests</h3>
              <div style={styles.tableWrap}>
                {recentReturnRequests.length === 0 ? (
                  <div style={styles.emptyState}>No return requests found.</div>
                ) : (
                  <table style={styles.table} aria-label="Recent return requests">
                    <thead style={styles.thead}>
                      <tr>
                        <th style={styles.th}>Return ID</th>
                        <th style={styles.th}>Order ID</th>
                        <th style={styles.th}>Reason</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReturnRequests.map((req, idx) => (
                        <tr key={req.id || idx}>
                          <td style={styles.tdMono}>{req.id || '—'}</td>
                          <td style={styles.tdMono}>{req.order_id || req.orderId || '—'}</td>
                          <td style={styles.td}>{req.reason || '—'}</td>
                          <td style={styles.td}><StatusBadge status={req.status} /></td>
                          <td style={styles.td}>
                            {req.created_at
                              ? new Date(req.created_at).toLocaleDateString('en-IN', {
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

            <section aria-labelledby="promos-heading" style={{ marginBottom: '40px' }}>
              <h3 id="promos-heading" style={styles.sectionTitle}>Promo Codes</h3>
              <div style={styles.tableWrap}>
                {promoCodes.length === 0 ? (
                  <div style={styles.emptyState}>No promo codes found.</div>
                ) : (
                  <table style={styles.table} aria-label="Promo codes">
                    <thead style={styles.thead}>
                      <tr>
                        <th style={styles.th}>Code</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.thRight}>Value</th>
                        <th style={styles.thRight}>Uses</th>
                        <th style={styles.th}>Expires</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map((promo, idx) => (
                        <tr key={promo.id || promo.code || idx}>
                          <td style={styles.tdMono}>{promo.code || '—'}</td>
                          <td style={styles.td}>{promo.type || promo.discount_type || '—'}</td>
                          <td style={styles.tdRight}>
                            {promo.type === 'percentage' || promo.discount_type === 'percentage'
                              ? `${promo.value ?? promo.discount_value ?? '—'}%`
                              : formatCurrency(promo.value ?? promo.discount_value)}
                          </td>
                          <td style={styles.tdRight}>
                            {formatNumber(promo.usageCount ?? promo.usage_count)}
                            {(promo.usageLimit ?? promo.usage_limit) != null
                              ? ` / ${formatNumber(promo.usageLimit ?? promo.usage_limit)}`
                              : ''}
                          </td>
                          <td style={styles.td}>
                            {promo.expires_at || promo.expiresAt
                              ? new Date(
                                  promo.expires_at || promo.expiresAt
                                ).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </td>
                          <td style={styles.td}>
                            <StatusBadge status={promo.status ?? (promo.is_active ? 'active' : 'inactive')} />
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

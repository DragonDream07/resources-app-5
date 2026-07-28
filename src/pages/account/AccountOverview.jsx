import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '8px',
  },
  subtext: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '8px',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: '#4c6ef5',
    flexShrink: 0,
  },
  profileName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
  },
  profileEmail: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  tilesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  tile: {
    flex: '1',
    minWidth: '140px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
    textDecoration: 'none',
    transition: 'box-shadow 0.15s ease',
  },
  tileTitleText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
  },
  tileMuted: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  tileCount: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4c6ef5',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    borderBottom: '1px solid #868e96',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '16px 20px',
    fontSize: '16px',
    color: '#4c6ef5',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    marginLeft: '8px',
  },
  skeletonLine: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    height: '16px',
    marginBottom: '8px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

export default function AccountOverview() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    Promise.all([
      fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([userData, ordersData, notifData]) => {
        setUser(userData);
        setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
        setNotifications(Array.isArray(notifData.notifications) ? notifData.notifications : []);
      })
      .catch(() => setError('Unable to load account information.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card }}>
            <div style={{ ...styles.skeletonLine, width: '40%' }} />
            <div style={{ ...styles.skeletonLine, width: '60%' }} />
            <div style={{ ...styles.skeletonLine, width: '30%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card, borderLeft: '4px solid #f03e3e', backgroundColor: '#ffe3e3' }}>
            <p style={{ color: '#f03e3e', margin: 0 }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const initials = user
    ? `${(user.first_name || '?')[0]}${(user.last_name || '')[0] || ''}`.toUpperCase()
    : '?';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>My Account</h1>
        <p style={styles.subtext}>
          Save your details for faster checkout and access your full order history anytime.
        </p>

        {/* Profile summary */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>Profile</div>
          <div style={styles.profileRow}>
            <div style={styles.avatar}>{initials}</div>
            <div>
              <p style={styles.profileName}>
                {user?.first_name} {user?.last_name}
              </p>
              <p style={styles.profileEmail}>{user?.email}</p>
            </div>
          </div>
          <Link
            to="/account/profile"
            style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}
          >
            Edit profile →
          </Link>
        </div>

        {/* Quick stat tiles */}
        <div style={styles.tilesGrid}>
          <div
            style={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/account/orders')}
            onKeyDown={e => e.key === 'Enter' && navigate('/account/orders')}
          >
            <span style={styles.sectionLabel}>Orders</span>
            <span style={styles.tileCount}>{orders.length}</span>
            <span style={styles.tileMuted}>Track your orders and view order history</span>
          </div>

          <div
            style={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/account/addresses')}
            onKeyDown={e => e.key === 'Enter' && navigate('/account/addresses')}
          >
            <span style={styles.sectionLabel}>Addresses</span>
            <span style={styles.tileCount}>{user?.address_count ?? 0}</span>
            <span style={styles.tileMuted}>Saved addresses</span>
          </div>

          <div
            style={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/account/notifications')}
            onKeyDown={e => e.key === 'Enter' && navigate('/account/notifications')}
          >
            <span style={styles.sectionLabel}>Notifications</span>
            <span style={styles.tileCount}>{unreadCount}</span>
            <span style={styles.tileMuted}>Unread notifications</span>
          </div>
        </div>

        {/* Quick links */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>Quick Links</div>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <button style={styles.navBtn} onClick={() => navigate('/account/orders')}>
                Order history
              </button>
            </li>
            <li style={styles.navItem}>
              <button style={styles.navBtn} onClick={() => navigate('/account/addresses')}>
                Saved addresses
              </button>
            </li>
            <li style={{ ...styles.navItem, borderBottom: 'none' }}>
              <button style={styles.navBtn} onClick={() => navigate('/account/notifications')}>
                Notifications
                {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

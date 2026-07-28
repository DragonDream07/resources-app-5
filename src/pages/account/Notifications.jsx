import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bellIcon from '@/assets/icons/bell.svg';
import emptyStateImg from '@/assets/images/empty-state.svg';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  container: { maxWidth: '720px', margin: '0 auto', padding: '32px 16px' },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' },
  heading: { fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '40px', color: '#212529', margin: 0 },
  btnGhost: { minHeight: '44px', padding: '0 20px', backgroundColor: 'transparent', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", whiteSpace: 'nowrap' },
  notifCard: (read) => ({
    backgroundColor: read ? '#ffffff' : '#f0f4ff',
    borderRadius: '10px',
    padding: '16px 20px',
    marginBottom: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    borderLeft: read ? '4px solid transparent' : '4px solid #4c6ef5',
    transition: 'background 0.15s',
  }),
  notifTitle: { fontSize: '16px', fontWeight: '600', color: '#212529', margin: '0 0 4px' },
  notifBody: { fontSize: '16px', color: '#212529', lineHeight: '1.625', margin: '0 0 6px' },
  notifMeta: { fontSize: '12px', color: '#495057', margin: 0 },
  unreadDot: { display: 'inline-block', width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#4c6ef5', marginLeft: '8px', verticalAlign: 'middle' },
  emptyState: { textAlign: 'center', padding: '64px 24px' },
  errorBanner: { backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' },
  retryBtn: { minHeight: '36px', padding: '0 16px', backgroundColor: '#f03e3e', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", flexShrink: 0 },
  backLink: { display: 'inline-block', marginBottom: '16px', color: '#4c6ef5', fontSize: '14px', textDecoration: 'none' },
  skeleton: { backgroundColor: '#e9ecef', borderRadius: '10px', height: '80px', marginBottom: '12px' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    setError(null);
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setNotifications(Array.isArray(data.notifications) ? data.notifications : Array.isArray(data) ? data : []))
      .catch(() => setError('Unable to load notifications. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (notifId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/notifications/${notifId}/read`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch {
      // silent fail; notification stays unread
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/notifications/read-all', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {
      // silent fail
    } finally {
      setMarkingAll(false);
    }
  };

  const hasUnread = notifications.some(n => !n.read);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={{ ...styles.heading, marginBottom: '24px' }}>Notifications</h1>
          {[1, 2, 3].map(i => <div key={i} style={styles.skeleton} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <div style={styles.headerRow}>
          <h1 style={styles.heading}>Notifications</h1>
          {hasUnread && (
            <button style={styles.btnGhost} onClick={markAllRead} disabled={markingAll}>
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <img src={bellIcon} alt="" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{error}</span>
            <button style={styles.retryBtn} onClick={fetchNotifications}>Retry</button>
          </div>
        )}

        {!error && notifications.length === 0 && (
          <div style={styles.emptyState}>
            <img src={emptyStateImg} alt="No notifications" style={{ width: '120px', height: '120px', marginBottom: '16px' }} />
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#212529', margin: '0 0 8px' }}>You&apos;re all caught up</p>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 24px' }}>No notifications yet.</p>
            <Link to="/" style={{ color: '#4c6ef5', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}>Browse products</Link>
          </div>
        )}

        {notifications.map(notif => (
          <div
            key={notif.id}
            style={styles.notifCard(notif.read)}
            onClick={() => !notif.read && markRead(notif.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && !notif.read && markRead(notif.id)}
            aria-label={notif.read ? notif.title : `Unread: ${notif.title}`}
          >
            <p style={styles.notifTitle}>
              {notif.title}
              {!notif.read && <span style={styles.unreadDot} aria-label="Unread" />}
            </p>
            <p style={styles.notifBody}>{notif.body || notif.message}</p>
            <p style={styles.notifMeta}>
              {notif.created_at ? new Date(notif.created_at).toLocaleString() : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

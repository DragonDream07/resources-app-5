import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
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
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  addressText: {
    fontSize: '16px',
    color: '#212529',
    margin: 0,
    lineHeight: '1.5',
  },
  addressMeta: {
    fontSize: '14px',
    color: '#495057',
    margin: '4px 0 0',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  btnEdit: {
    minHeight: '44px',
    padding: '0 16px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnDelete: {
    minHeight: '44px',
    padding: '0 16px',
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnPrimary: {
    minHeight: '44px',
    padding: '0 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    color: '#495057',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  defaultBadge: {
    display: 'inline-block',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '2px 6px',
    marginLeft: '8px',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '16px',
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
  },
};

export default function AccountAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    fetch('/api/users/me/addresses', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setAddresses(Array.isArray(data.addresses) ? data.addresses : Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load addresses. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/users/me/addresses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch {
      setError('Failed to delete address. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          {[1, 2].map(i => (
            <div key={i} style={{ ...styles.card, flexDirection: 'column' }}>
              <div style={{ backgroundColor: '#e9ecef', borderRadius: '6px', height: '16px', width: '60%', marginBottom: '8px' }} />
              <div style={{ backgroundColor: '#e9ecef', borderRadius: '6px', height: '16px', width: '40%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <div style={styles.headerRow}>
          <h1 style={{ ...styles.heading, marginBottom: 0 }}>Saved addresses</h1>
          <Link to="/account/addresses/new" style={styles.btnPrimary}>
            + Add new address
          </Link>
        </div>

        {error && (
          <div style={styles.errorBanner}>{error}</div>
        )}

        {addresses.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#212529' }}>No saved addresses</p>
            <p style={{ margin: '0 0 24px', fontSize: '14px' }}>Add an address for faster checkout.</p>
            <Link to="/account/addresses/new" style={styles.btnPrimary}>Add address</Link>
          </div>
        ) : (
          addresses.map(addr => (
            <div key={addr.id} style={styles.card}>
              <div>
                <p style={styles.addressText}>
                  {addr.full_name || `${addr.first_name || ''} ${addr.last_name || ''}`.trim()}
                  {addr.is_default && <span style={styles.defaultBadge}>Default</span>}
                </p>
                <p style={styles.addressMeta}>
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                  {addr.city}, {addr.state} {addr.postal_code}<br />
                  {addr.country}
                </p>
                {addr.phone && <p style={styles.addressMeta}>{addr.phone}</p>}
              </div>
              <div style={styles.actionRow}>
                <button style={styles.btnEdit} onClick={() => navigate(`/account/addresses/${addr.id}/edit`)}>
                  Edit
                </button>
                <button style={styles.btnDelete} onClick={() => handleDelete(addr.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

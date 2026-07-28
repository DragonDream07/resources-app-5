import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import checkIcon from '@/assets/icons/check.svg';

const RETURN_REASONS = [
  'Item arrived damaged',
  'Wrong item received',
  'Item not as described',
  'Changed my mind',
  'Defective / not working',
  'Other',
];

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  container: { maxWidth: '720px', margin: '0 auto', padding: '32px 16px' },
  heading: { fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '40px', color: '#212529', marginBottom: '8px' },
  subheading: { fontSize: '14px', color: '#495057', marginBottom: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '24px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#212529', marginBottom: '16px', marginTop: 0 },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '6px' },
  input: { display: 'block', width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '16px', color: '#212529', backgroundColor: '#ffffff', border: '1px solid #868e96', borderRadius: '6px', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", outline: 'none' },
  inputError: { borderColor: '#f03e3e' },
  errorText: { fontSize: '12px', color: '#f03e3e', marginTop: '4px' },
  select: { display: 'block', width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '16px', color: '#212529', backgroundColor: '#ffffff', border: '1px solid #868e96', borderRadius: '6px', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", outline: 'none', appearance: 'none' },
  textarea: { display: 'block', width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '16px', color: '#212529', backgroundColor: '#ffffff', border: '1px solid #868e96', borderRadius: '6px', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", outline: 'none', resize: 'vertical', minHeight: '100px' },
  fieldGroup: { marginBottom: '20px' },
  checkboxRow: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '6px', marginBottom: '8px', cursor: 'pointer', border: '1px solid #e9ecef', backgroundColor: '#f8f9fa' },
  btnPrimary: { minHeight: '44px', padding: '0 24px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  btnGhost: { minHeight: '44px', padding: '0 20px', backgroundColor: 'transparent', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  btnRow: { display: 'flex', gap: '12px' },
  errorBanner: { backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' },
  backLink: { display: 'inline-block', marginBottom: '16px', color: '#4c6ef5', fontSize: '14px', textDecoration: 'none' },
  successCard: { backgroundColor: '#ffffff', borderRadius: '10px', padding: '48px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' },
  successIcon: { width: '48px', height: '48px', marginBottom: '16px' },
  successHeading: { fontSize: '24px', fontWeight: '700', color: '#212529', margin: '0 0 8px' },
  successText: { fontSize: '14px', color: '#495057', margin: '0 0 24px' },
};

export default function ReturnRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setOrder(data))
      .catch(() => setError('Failed to load order details.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const toggleItem = itemId => {
    setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    setFieldErrors(prev => ({ ...prev, items: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = {};
    const chosenItems = Object.entries(selectedItems).filter(([, v]) => v).map(([k]) => k);
    if (chosenItems.length === 0) errs.items = 'Please select at least one item to return.';
    if (!reason) errs.reason = 'Please select a reason for your return.';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${id}/return-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: chosenItems, reason, notes }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError('Failed to submit return request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ backgroundColor: '#e9ecef', borderRadius: '10px', height: '200px' }} />
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successCard}>
            <img src={checkIcon} alt="Success" style={styles.successIcon} />
            <h2 style={styles.successHeading}>Return request submitted</h2>
            <p style={styles.successText}>Our team will review your request within 1–2 business days.</p>
            <Link to={`/account/orders/${id}`} style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>
              ← Back to order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to={`/account/orders/${id}`} style={styles.backLink}>← Back to order</Link>
        <h1 style={styles.heading}>Return request</h1>
        <p style={styles.subheading}>Select the items you wish to return and provide a reason.</p>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Item selection */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Select items to return</h2>
            {(order?.items || []).map(item => (
              <div
                key={item.id}
                style={{ ...styles.checkboxRow, backgroundColor: selectedItems[item.id] ? '#e8ecfd' : '#f8f9fa', borderColor: selectedItems[item.id] ? '#4c6ef5' : '#e9ecef' }}
                onClick={() => toggleItem(item.id)}
              >
                <input
                  type="checkbox"
                  checked={!!selectedItems[item.id]}
                  onChange={() => toggleItem(item.id)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
                  aria-label={`Select ${item.name}`}
                />
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#212529', margin: '0 0 2px' }}>{item.name}</p>
                  <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            {fieldErrors.items && <p style={styles.errorText}>{fieldErrors.items}</p>}
          </div>

          {/* Reason */}
          <div style={styles.card}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="reason">Reason for return</label>
              <select
                id="reason"
                value={reason}
                onChange={e => { setReason(e.target.value); setFieldErrors(prev => ({ ...prev, reason: null })); }}
                style={{ ...styles.select, ...(fieldErrors.reason ? styles.inputError : {}) }}
              >
                <option value="">Select a reason</option>
                {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {fieldErrors.reason && <p style={styles.errorText}>{fieldErrors.reason}</p>}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="notes">Additional notes (optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any additional details about your return..."
                style={styles.textarea}
              />
            </div>
          </div>

          <div style={styles.btnRow}>
            <button type="submit" style={styles.btnPrimary} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit return request'}
            </button>
            <button type="button" style={styles.btnGhost} onClick={() => navigate(`/account/orders/${id}`)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  input: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    outline: 'none',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  btnPrimary: {
    minHeight: '44px',
    padding: '0 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnGhost: {
    minHeight: '44px',
    padding: '0 20px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '16px',
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    height: '16px',
    marginBottom: '8px',
  },
};

export default function AddressEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: '', phone: '', is_default: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch(`/api/users/me/addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('not_found'); return r.json(); })
      .then(data => setForm({
        full_name: data.full_name || '',
        line1: data.line1 || '',
        line2: data.line2 || '',
        city: data.city || '',
        state: data.state || '',
        postal_code: data.postal_code || '',
        country: data.country || '',
        phone: data.phone || '',
        is_default: data.is_default || false,
      }))
      .catch(() => setError('Address not found or could not be loaded.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.line1.trim()) errs.line1 = 'Address line 1 is required.';
    if (!form.city.trim()) errs.city = 'City is required.';
    if (!form.state.trim()) errs.state = 'State is required.';
    if (!form.postal_code.trim()) errs.postal_code = 'Postal code is required.';
    if (!form.country.trim()) errs.country = 'Country is required.';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/me/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccessMsg('Address updated successfully.');
    } catch {
      setError('Failed to update address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            {[1, 2, 3].map(i => <div key={i} style={{ ...styles.skeleton, width: `${40 + i * 10}%` }} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account/addresses" style={styles.backLink}>← Back to addresses</Link>
        <h1 style={styles.heading}>Edit address</h1>
        {error && <div style={styles.errorBanner}>{error}</div>}
        {successMsg && <div style={styles.successBanner}>{successMsg}</div>}
        <div style={styles.card}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="full_name">Full name</label>
              <input id="full_name" name="full_name" type="text" value={form.full_name} onChange={handleChange}
                style={{ ...styles.input, ...(fieldErrors.full_name ? styles.inputError : {}) }} />
              {fieldErrors.full_name && <p style={styles.errorText}>{fieldErrors.full_name}</p>}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="line1">Address line 1</label>
              <input id="line1" name="line1" type="text" value={form.line1} onChange={handleChange}
                style={{ ...styles.input, ...(fieldErrors.line1 ? styles.inputError : {}) }} />
              {fieldErrors.line1 && <p style={styles.errorText}>{fieldErrors.line1}</p>}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="line2">Address line 2 (optional)</label>
              <input id="line2" name="line2" type="text" value={form.line2} onChange={handleChange} style={styles.input} />
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '140px' }}>
                <label style={styles.label} htmlFor="city">City</label>
                <input id="city" name="city" type="text" value={form.city} onChange={handleChange}
                  style={{ ...styles.input, ...(fieldErrors.city ? styles.inputError : {}) }} />
                {fieldErrors.city && <p style={styles.errorText}>{fieldErrors.city}</p>}
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '140px' }}>
                <label style={styles.label} htmlFor="state">State / Province</label>
                <input id="state" name="state" type="text" value={form.state} onChange={handleChange}
                  style={{ ...styles.input, ...(fieldErrors.state ? styles.inputError : {}) }} />
                {fieldErrors.state && <p style={styles.errorText}>{fieldErrors.state}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '140px' }}>
                <label style={styles.label} htmlFor="postal_code">Postal code</label>
                <input id="postal_code" name="postal_code" type="text" value={form.postal_code} onChange={handleChange}
                  style={{ ...styles.input, ...(fieldErrors.postal_code ? styles.inputError : {}) }} />
                {fieldErrors.postal_code && <p style={styles.errorText}>{fieldErrors.postal_code}</p>}
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '140px' }}>
                <label style={styles.label} htmlFor="country">Country</label>
                <input id="country" name="country" type="text" value={form.country} onChange={handleChange}
                  style={{ ...styles.input, ...(fieldErrors.country ? styles.inputError : {}) }} />
                {fieldErrors.country && <p style={styles.errorText}>{fieldErrors.country}</p>}
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.checkboxRow}>
              <input id="is_default" name="is_default" type="checkbox" checked={form.is_default} onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="is_default" style={{ fontSize: '14px', color: '#212529', cursor: 'pointer' }}>Set as default address</label>
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account/addresses')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

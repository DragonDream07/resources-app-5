import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    marginBottom: '24px',
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '20px',
    marginTop: 0,
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
    padding: '0 20px',
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
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
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
  navBtnRow: {
    marginBottom: '24px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    color: '#4c6ef5',
    fontSize: '14px',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
};

export default function AccountProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '' });
  const [passwordFields, setPasswordFields] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwdMsg, setPwdMsg] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setProfile({ first_name: data.first_name || '', last_name: data.last_name || '', email: data.email || '' }))
      .catch(() => setProfileMsg({ type: 'error', text: 'Failed to load profile.' }))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleProfileChange = e => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleProfileSave = async e => {
    e.preventDefault();
    const errs = {};
    if (!profile.first_name.trim()) errs.first_name = 'First name is required.';
    if (!profile.email.trim()) errs.email = 'Email is required.';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setSaving(true);
    setProfileMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ first_name: profile.first_name, last_name: profile.last_name, email: profile.email }),
      });
      if (!res.ok) throw new Error();
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePwdChange = e => {
    setPasswordFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handlePasswordSave = async e => {
    e.preventDefault();
    const errs = {};
    if (!passwordFields.current_password) errs.current_password = 'Current password is required.';
    if (!passwordFields.new_password) errs.new_password = 'New password is required.';
    if (passwordFields.new_password !== passwordFields.confirm_password) errs.confirm_password = 'Passwords do not match.';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setChangingPwd(true);
    setPwdMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: passwordFields.current_password, new_password: passwordFields.new_password }),
      });
      if (!res.ok) throw new Error();
      setPwdMsg({ type: 'success', text: 'Password changed successfully.' });
      setPasswordFields({ current_password: '', new_password: '', confirm_password: '' });
    } catch {
      setPwdMsg({ type: 'error', text: 'Failed to change password. Please check your current password.' });
    } finally {
      setChangingPwd(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={{ backgroundColor: '#e9ecef', borderRadius: '6px', height: '16px', marginBottom: '8px', width: '40%' }} />
            <div style={{ backgroundColor: '#e9ecef', borderRadius: '6px', height: '16px', marginBottom: '8px', width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <h1 style={styles.heading}>Account profile</h1>

        {/* Profile info */}
        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Personal information</h2>
          {profileMsg && (
            <div style={profileMsg.type === 'success' ? styles.successBanner : styles.errorBanner}>
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={handleProfileSave} noValidate>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '140px' }}>
                <label style={styles.label} htmlFor="first_name">First name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={profile.first_name}
                  onChange={handleProfileChange}
                  style={{ ...styles.input, ...(fieldErrors.first_name ? styles.inputError : {}) }}
                />
                {fieldErrors.first_name && <p style={styles.errorText}>{fieldErrors.first_name}</p>}
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1, minWidth: '140px' }}>
                <label style={styles.label} htmlFor="last_name">Last name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={profile.last_name}
                  onChange={handleProfileChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                style={{ ...styles.input, ...(fieldErrors.email ? styles.inputError : {}) }}
              />
              {fieldErrors.email && <p style={styles.errorText}>{fieldErrors.email}</p>}
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account')}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Password change */}
        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Change password</h2>
          {pwdMsg && (
            <div style={pwdMsg.type === 'success' ? styles.successBanner : styles.errorBanner}>
              {pwdMsg.text}
            </div>
          )}
          <form onSubmit={handlePasswordSave} noValidate>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="current_password">Current password</label>
              <input
                id="current_password"
                name="current_password"
                type="password"
                value={passwordFields.current_password}
                onChange={handlePwdChange}
                style={{ ...styles.input, ...(fieldErrors.current_password ? styles.inputError : {}) }}
              />
              {fieldErrors.current_password && <p style={styles.errorText}>{fieldErrors.current_password}</p>}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="new_password">New password</label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                value={passwordFields.new_password}
                onChange={handlePwdChange}
                style={{ ...styles.input, ...(fieldErrors.new_password ? styles.inputError : {}) }}
              />
              {fieldErrors.new_password && <p style={styles.errorText}>{fieldErrors.new_password}</p>}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="confirm_password">Confirm new password</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={passwordFields.confirm_password}
                onChange={handlePwdChange}
                style={{ ...styles.input, ...(fieldErrors.confirm_password ? styles.inputError : {}) }}
              />
              {fieldErrors.confirm_password && <p style={styles.errorText}>{fieldErrors.confirm_password}</p>}
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary} disabled={changingPwd}>
                {changingPwd ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </form>
        </div>

        {/* Navigation */}
        <div style={styles.card}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button style={styles.navBtn} onClick={() => navigate('/account/notifications')}>Notifications</button>
            <button style={styles.navBtn} onClick={() => navigate('/account/orders')}>Order history</button>
            <button style={styles.navBtn} onClick={() => navigate('/account/addresses')}>Addresses</button>
          </div>
        </div>
      </div>
    </div>
  );
}

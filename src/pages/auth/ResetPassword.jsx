import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 2px 16px rgba(33,37,41,0.10)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    textAlign: 'center',
    marginBottom: '8px',
    marginTop: '0',
  },
  subtext: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
    letterSpacing: '0.02em',
    lineHeight: '16px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    lineHeight: '1.5',
  },
  inputError: {
    border: '1px solid #f03e3e',
  },
  fieldError: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#f03e3e',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    marginTop: '8px',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  signinLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginTop: '20px',
    fontSize: '14px',
    color: '#495057',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
  },
  successWrapper: {
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    color: '#37b24d',
  },
  successHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '8px',
    lineHeight: '28px',
  },
  successText: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  invalidTokenWrapper: {
    textAlign: 'center',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#212529',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    zIndex: 9999,
    maxWidth: '400px',
    textAlign: 'center',
  },
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [succeeded, setSucceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.password || form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (form.password !== form.confirm) {
      newErrors.confirm = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      setBanner('Invalid or missing reset token. Please request a new password reset.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      });

      if (res.status === 429) {
        showToast('Too many attempts. Please wait before trying again.');
        return;
      }
      if (res.status === 400 || res.status === 401) {
        setBanner('This reset link is invalid or has expired. Please request a new one.');
        return;
      }
      if (!res.ok) {
        showToast('Something went wrong. Please try again.');
        return;
      }
      setSucceeded(true);
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) =>
    errors[field] ? { ...styles.input, ...styles.inputError } : styles.input;

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.invalidTokenWrapper}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={styles.heading}>Invalid reset link</h1>
            <p style={{ fontSize: '14px', color: '#495057', marginBottom: '24px', lineHeight: '1.5', textAlign: 'center' }}>
              This password reset link is invalid or missing a token. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#4c6ef5',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Request new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {!succeeded ? (
          <>
            <h1 style={styles.heading}>Reset password</h1>
            <p style={styles.subtext}>Enter your new password below.</p>

            <form onSubmit={handleSubmit} noValidate>
              {banner && (
                <div style={styles.errorBanner} role="alert">
                  {banner}
                </div>
              )}

              <div style={styles.fieldGroup}>
                <label htmlFor="reset-password" style={styles.label}>New password</label>
                <input
                  id="reset-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  style={inputStyle('password')}
                  placeholder="At least 8 characters"
                  required
                />
                {errors.password && <div style={styles.fieldError}>{errors.password}</div>}
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="reset-confirm" style={styles.label}>Confirm new password</label>
                <input
                  id="reset-confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={handleChange}
                  style={inputStyle('confirm')}
                  placeholder="Re-enter new password"
                  required
                />
                {errors.confirm && <div style={styles.fieldError}>{errors.confirm}</div>}
              </div>

              <button
                type="submit"
                style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Updating…' : 'Reset password'}
              </button>
            </form>

            <div style={styles.signinLink}>
              <span>Remember your password?</span>
              <Link to="/login" style={{ ...styles.link, marginLeft: '4px' }}>Sign in</Link>
            </div>
          </>
        ) : (
          <div style={styles.successWrapper}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successHeading}>Password reset successfully</h2>
            <p style={styles.successText}>
              Your password has been updated. Please sign in with your new password.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#4c6ef5',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                minHeight: '44px',
                lineHeight: '20px',
              }}
            >
              Go to sign in
            </Link>
          </div>
        )}
      </div>

      {toast && <div style={styles.toast} role="status">{toast}</div>}
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '16px',
    paddingTop: '40px',
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
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
    fontSize: '14px',
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

function validateEmail(val) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(val) && val.length <= 320;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email || !validateEmail(email)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) {
        showToast('Too many attempts. Please wait before trying again.');
        return;
      }
      // Per design: always show success message regardless of whether email exists
      setSubmitted(true);
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {!submitted ? (
          <>
            <h1 style={styles.heading}>Forgot password</h1>
            <p style={styles.subtext}>
              Enter the email address associated with your account and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.fieldGroup}>
                <label htmlFor="forgot-email" style={styles.label}>Email address</label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  style={emailError ? { ...styles.input, ...styles.inputError } : styles.input}
                  placeholder="you@example.com"
                  required
                />
                {emailError && <div style={styles.fieldError}>{emailError}</div>}
              </div>

              <button
                type="submit"
                style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Reset password'}
              </button>
            </form>

            <div style={styles.footer}>
              <Link to="/login" style={styles.link}>Sign in</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </div>
          </>
        ) : (
          <div style={styles.successWrapper}>
            <div style={styles.successIcon}>✉️</div>
            <h2 style={styles.successHeading}>Check your inbox</h2>
            <p style={styles.successText}>
              If that address is registered, a reset link is on its way.
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
              Back to sign in
            </Link>
          </div>
        )}
      </div>

      {toast && <div style={styles.toast} role="status">{toast}</div>}
    </div>
  );
}

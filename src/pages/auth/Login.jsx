import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  forgotLink: {
    display: 'block',
    textAlign: 'right',
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    marginTop: '4px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  divider: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    margin: '20px 0',
  },
  link: {
    color: '#4c6ef5',
    fontWeight: '500',
    textDecoration: 'none',
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

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val) && val.length <= 320;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner('');

    if (!validateEmail(email)) {
      setErrorBanner('Enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorBanner('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setErrorBanner('Too many login attempts. Please try again later.');
        return;
      }
      if (res.status === 401 || res.status === 400) {
        setErrorBanner('Incorrect email or password.');
        return;
      }
      if (!res.ok) {
        showToast('Something went wrong. Try again.');
        return;
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      navigate('/');
    } catch {
      showToast('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subtext}>Sign in to your account to continue.</p>

        <form onSubmit={handleSubmit} noValidate>
          {errorBanner && (
            <div style={styles.errorBanner} role="alert">
              <span aria-hidden="true">&#9888;</span>
              <span>{errorBanner}</span>
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label htmlFor="login-email" style={styles.label}>Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label htmlFor="login-password" style={{ ...styles.label, marginBottom: '0' }}>Password</label>
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={styles.divider}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.link}>Register</Link>
        </div>
      </div>

      {toast && <div style={styles.toast} role="status">{toast}</div>}
    </div>
  );
}

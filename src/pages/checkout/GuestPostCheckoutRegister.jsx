import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '48px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    maxWidth: '480px',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '32px 28px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
  },
  logo: {
    display: 'block',
    margin: '0 auto 24px',
    height: '36px',
    width: 'auto',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    lineHeight: '32px',
    marginBottom: '8px',
  },
  sub: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    lineHeight: '20px',
    marginBottom: '28px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
  },
  input: (hasError) => ({
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#f03e3e' : '#868e96'}`,
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    outline: 'none',
    backgroundColor: '#ffffff',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: '24px',
    minHeight: '44px',
    boxSizing: 'border-box',
    width: '100%',
  }),
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '2px',
    lineHeight: '16px',
  },
  primaryBtn: (disabled) => ({
    width: '100%',
    padding: '14px 24px',
    backgroundColor: disabled ? '#adb5bd' : '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
    marginTop: '8px',
  }),
  skipLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'underline',
    cursor: 'pointer',
    lineHeight: '20px',
  },
  alertBox: (type) => ({
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    backgroundColor: type === 'error' ? '#ffe3e3' : '#d3f9d8',
    color: type === 'error' ? '#f03e3e' : '#37b24d',
    marginBottom: '16px',
  }),
  successState: {
    textAlign: 'center',
    padding: '16px 0',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '32px',
  },
  successHeading: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#212529',
    lineHeight: '28px',
    marginBottom: '8px',
  },
  successSub: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '24px',
  },
  benefits: {
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
  },
  benefitItem: {
    fontSize: '13px',
    color: '#495057',
    lineHeight: '22px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  passwordStrength: (strength) => ({
    height: '4px',
    borderRadius: '9999px',
    marginTop: '6px',
    backgroundColor:
      strength === 'strong'
        ? '#37b24d'
        : strength === 'medium'
        ? '#fd7e14'
        : strength === 'weak'
        ? '#f03e3e'
        : '#e9ecef',
    width:
      strength === 'strong'
        ? '100%'
        : strength === 'medium'
        ? '60%'
        : strength === 'weak'
        ? '30%'
        : '0%',
    transition: 'width 0.3s, background-color 0.3s',
  }),
  passwordStrengthLabel: (strength) => ({
    fontSize: '11px',
    marginTop: '3px',
    color:
      strength === 'strong'
        ? '#37b24d'
        : strength === 'medium'
        ? '#fd7e14'
        : strength === 'weak'
        ? '#f03e3e'
        : '#adb5bd',
    lineHeight: '16px',
  }),
};

function getPasswordStrength(password) {
  if (!password) return '';
  if (password.length < 6) return 'weak';
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const score = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  if (password.length >= 10 && score >= 3) return 'strong';
  if (password.length >= 8 && score >= 2) return 'medium';
  return 'weak';
}

const BENEFITS = [
  '📦 Track your order anytime',
  '🕐 Faster checkout next time',
  '📜 View complete order history',
  '🔔 Get delivery notifications',
];

export default function GuestPostCheckoutRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const passwordStrength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError('');
    try {
      const orderId = localStorage.getItem('lastOrderId');
      const r = await fetch('/api/auth/guest-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          orderId: orderId || undefined,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        setApiError(data.message || 'Registration failed. Please try again.');
        return;
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      setSuccess(true);
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.successState}>
              <div style={styles.successIcon}>✓</div>
              <div style={styles.successHeading}>Account Created!</div>
              <div style={styles.successSub}>
                Welcome! Your account is ready. You can now track your order and enjoy faster checkouts.
              </div>
              <button
                style={styles.primaryBtn(false)}
                onClick={() => navigate('/orders')}
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <img src="/assets/images/logo.svg" alt="Logo" style={styles.logo} />
          <h1 style={styles.heading}>Create Your Account</h1>
          <p style={styles.sub}>
            Your order is confirmed! Save your details to track this order and check out faster next time.
          </p>

          <div style={styles.benefits}>
            {BENEFITS.map((b) => (
              <div key={b} style={styles.benefitItem}>
                {b}
              </div>
            ))}
          </div>

          {apiError && <div style={styles.alertBox('error')}>{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="guest-name">Full Name *</label>
              <input
                id="guest-name"
                style={styles.input(!!errors.name)}
                name="name"
                value={form.name}
                onChange={handleField}
                placeholder="John Doe"
                autoComplete="name"
                type="text"
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="guest-email">Email Address *</label>
              <input
                id="guest-email"
                style={styles.input(!!errors.email)}
                name="email"
                value={form.email}
                onChange={handleField}
                placeholder="john@example.com"
                autoComplete="email"
                type="email"
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="guest-password">Password *</label>
              <input
                id="guest-password"
                style={styles.input(!!errors.password)}
                name="password"
                value={form.password}
                onChange={handleField}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                type="password"
              />
              {form.password && (
                <>
                  <div style={styles.passwordStrength(passwordStrength)} />
                  <div style={styles.passwordStrengthLabel(passwordStrength)}>
                    {passwordStrength === 'strong' && 'Strong password'}
                    {passwordStrength === 'medium' && 'Medium strength'}
                    {passwordStrength === 'weak' && 'Weak password'}
                  </div>
                </>
              )}
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="guest-confirm">Confirm Password *</label>
              <input
                id="guest-confirm"
                style={styles.input(!!errors.confirmPassword)}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleField}
                placeholder="Repeat password"
                autoComplete="new-password"
                type="password"
              />
              {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              style={styles.primaryBtn(submitting)}
              disabled={submitting}
            >
              {submitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <Link to="/" style={styles.skipLink}>
            No thanks, continue as guest
          </Link>
        </div>
      </div>
    </div>
  );
}

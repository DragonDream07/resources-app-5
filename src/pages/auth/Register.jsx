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
    maxWidth: '480px',
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
  warningBanner: {
    backgroundColor: '#fff4e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#343a40',
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
    margin: '20px 0 0',
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

function validateEmail(val) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(val) && val.length <= 320;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState({ type: '', message: '' });
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
    if (form.full_name && form.full_name.length > 255) {
      newErrors.full_name = 'Full name must not exceed 255 characters.';
    }
    if (!form.email || !validateEmail(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (form.phone && form.phone.length > 30) {
      newErrors.phone = 'Enter a valid phone number.';
    }
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
    setBanner({ type: '', message: '' });
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
      };
      if (form.full_name) payload.full_name = form.full_name;
      if (form.phone) payload.phone = form.phone;

      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 429) {
        setBanner({ type: 'warning', message: 'Too many attempts. Please wait before trying again.' });
        return;
      }
      if (res.status === 409 || (res.status === 400 && data?.message?.toLowerCase().includes('already'))) {
        setBanner({ type: 'error', message: 'email_exists' });
        return;
      }
      if (!res.ok) {
        showToast('Something went wrong. Please try again.');
        return;
      }
      navigate('/');
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) =>
    errors[field] ? { ...styles.input, ...styles.inputError } : styles.input;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subtext}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {banner.type === 'warning' && (
            <div style={styles.warningBanner} role="alert">
              {banner.message}
            </div>
          )}
          {banner.type === 'error' && banner.message === 'email_exists' && (
            <div style={styles.errorBanner} role="alert">
              An account with this email already exists.{' '}
              <Link to="/login" style={{ color: '#f03e3e', fontWeight: '600' }}>Log in instead?</Link>
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label htmlFor="reg-full-name" style={styles.label}>Full name</label>
            <input
              id="reg-full-name"
              name="full_name"
              type="text"
              autoComplete="name"
              value={form.full_name}
              onChange={handleChange}
              style={inputStyle('full_name')}
              placeholder="Jane Doe"
            />
            {errors.full_name && <div style={styles.fieldError}>{errors.full_name}</div>}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="reg-email" style={styles.label}>Email address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle('email')}
              placeholder="you@example.com"
              required
            />
            {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="reg-phone" style={styles.label}>Phone number <span style={{ fontWeight: '400', color: '#495057' }}>(optional)</span></label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle('phone')}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <div style={styles.fieldError}>{errors.phone}</div>}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="reg-password" style={styles.label}>Password</label>
            <input
              id="reg-password"
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
            <label htmlFor="reg-confirm" style={styles.label}>Confirm password</label>
            <input
              id="reg-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              style={inputStyle('confirm')}
              placeholder="Re-enter password"
              required
            />
            {errors.confirm && <div style={styles.fieldError}>{errors.confirm}</div>}
          </div>

          <button
            type="submit"
            style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={styles.divider}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </div>
      </div>

      {toast && <div style={styles.toast} role="status">{toast}</div>}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '32px 16px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '8px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepCircle: (active, done) => ({
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: done ? '#37b24d' : active ? '#4c6ef5' : '#e9ecef',
    color: done || active ? '#ffffff' : '#495057',
  }),
  stepLabel: (active) => ({
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    color: active ? '#212529' : '#495057',
  }),
  stepDivider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#868e96',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '20px',
    lineHeight: '28px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldGroupFull: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    gridColumn: '1 / -1',
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
  pinRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  pinInputWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  checkBtn: {
    padding: '10px 16px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minHeight: '44px',
    alignSelf: 'flex-end',
    marginBottom: '0px',
  },
  serviceabilityMsg: (ok) => ({
    marginTop: '6px',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: ok ? '#d3f9d8' : '#ffe3e3',
    color: ok ? '#37b24d' : '#f03e3e',
    lineHeight: '20px',
  }),
  savedAddressesTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
    lineHeight: '24px',
  },
  addressCard: (selected) => ({
    border: `2px solid ${selected ? '#4c6ef5' : '#868e96'}`,
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '10px',
    cursor: 'pointer',
    backgroundColor: selected ? '#e8ecfd' : '#ffffff',
  }),
  addressCardName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '20px',
  },
  addressCardText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  divider: {
    borderTop: '1px solid #e9ecef',
    margin: '20px 0',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  primaryBtn: (disabled) => ({
    padding: '12px 24px',
    backgroundColor: disabled ? '#adb5bd' : '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
  }),
  alertBox: (type) => ({
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    backgroundColor: type === 'error' ? '#ffe3e3' : '#d3f9d8',
    color: type === 'error' ? '#f03e3e' : '#37b24d',
    marginBottom: '16px',
  }),
};

const STEPS = ['Address', 'Payment', 'Review'];

function CheckoutStepper({ current }) {
  return (
    <div style={styles.stepper}>
      {STEPS.map((label, idx) => (
        <>
          <div key={label} style={styles.stepItem}>
            <div style={styles.stepCircle(idx === current, idx < current)}>
              {idx < current ? '✓' : idx + 1}
            </div>
            <span style={styles.stepLabel(idx === current)}>{label}</span>
          </div>
          {idx < STEPS.length - 1 && <div key={`div-${idx}`} style={styles.stepDivider} />}
        </>
      ))}
    </div>
  );
}

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNew, setUseNew] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [errors, setErrors] = useState({});
  const [pinCheckStatus, setPinCheckStatus] = useState(null); // null | 'ok' | 'fail'
  const [pinChecking, setPinChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/users/me/addresses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSavedAddresses(data);
        else if (data && Array.isArray(data.addresses)) setSavedAddresses(data.addresses);
      })
      .catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^[0-9]{10}$/.test(form.phone.trim())) e.phone = 'Phone must be 10 digits.';
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address line 1 is required.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (!form.state.trim()) e.state = 'State is required.';
    if (!form.pinCode.trim()) e.pinCode = 'PIN code is required.';
    else if (!/^[0-9]{6}$/.test(form.pinCode.trim())) e.pinCode = 'PIN code must be 6 digits.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckPin = async () => {
    if (!/^[0-9]{6}$/.test(form.pinCode.trim())) {
      setErrors((prev) => ({ ...prev, pinCode: 'PIN code must be 6 digits.' }));
      return;
    }
    setPinChecking(true);
    setPinCheckStatus(null);
    try {
      const r = await fetch(`/api/serviceability?pinCode=${form.pinCode.trim()}`);
      const data = await r.json();
      setPinCheckStatus(data.serviceable ? 'ok' : 'fail');
    } catch {
      setPinCheckStatus('fail');
    } finally {
      setPinChecking(false);
    }
  };

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === 'pinCode') setPinCheckStatus(null);
  };

  const handleSubmitSaved = async () => {
    if (!selectedAddressId) return;
    setSubmitting(true);
    setApiError('');
    try {
      const token = localStorage.getItem('token');
      const r = await fetch('/api/checkout/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ addressId: selectedAddressId }),
      });
      if (!r.ok) {
        const d = await r.json();
        setApiError(d.message || 'Failed to save address.');
        return;
      }
      navigate('/checkout/payment');
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitNew = async () => {
    if (!validate()) return;
    if (pinCheckStatus !== 'ok') {
      setApiError('Please verify your PIN code is serviceable before continuing.');
      return;
    }
    setSubmitting(true);
    setApiError('');
    try {
      const token = localStorage.getItem('token');
      const r = await fetch('/api/checkout/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          addressLine1: form.addressLine1.trim(),
          addressLine2: form.addressLine2.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pinCode: form.pinCode.trim(),
        }),
      });
      if (!r.ok) {
        const d = await r.json();
        setApiError(d.message || 'Failed to save address.');
        return;
      }
      navigate('/checkout/payment');
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showNewForm = useNew || savedAddresses.length === 0;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <CheckoutStepper current={0} />
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '24px', lineHeight: '32px' }}>
          Delivery Address
        </h1>

        {apiError && <div style={styles.alertBox('error')}>{apiError}</div>}

        {savedAddresses.length > 0 && (
          <div style={styles.card}>
            <div style={styles.savedAddressesTitle}>Saved Addresses</div>
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                style={styles.addressCard(!useNew && selectedAddressId === addr.id)}
                onClick={() => {
                  setSelectedAddressId(addr.id);
                  setUseNew(false);
                }}
                role="radio"
                aria-checked={!useNew && selectedAddressId === addr.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedAddressId(addr.id);
                    setUseNew(false);
                  }
                }}
              >
                <div style={styles.addressCardName}>{addr.fullName}</div>
                <div style={styles.addressCardText}>
                  {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                </div>
                <div style={styles.addressCardText}>
                  {addr.city}, {addr.state} — {addr.pinCode}
                </div>
                <div style={styles.addressCardText}>Ph: {addr.phone}</div>
              </div>
            ))}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#4c6ef5',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 0',
                textDecoration: 'underline',
              }}
              onClick={() => { setUseNew(true); setSelectedAddressId(null); }}
            >
              + Add a new address
            </button>
          </div>
        )}

        {showNewForm && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Enter Delivery Address</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  style={styles.input(!!errors.fullName)}
                  name="fullName"
                  value={form.fullName}
                  onChange={handleField}
                  placeholder="John Doe"
                  autoComplete="name"
                />
                {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  style={styles.input(!!errors.phone)}
                  name="phone"
                  value={form.phone}
                  onChange={handleField}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  maxLength={10}
                />
                {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
              </div>
              <div style={styles.fieldGroupFull}>
                <label style={styles.label}>Address Line 1 *</label>
                <input
                  style={styles.input(!!errors.addressLine1)}
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleField}
                  placeholder="House / Flat no., Building, Street"
                  autoComplete="address-line1"
                />
                {errors.addressLine1 && <span style={styles.errorText}>{errors.addressLine1}</span>}
              </div>
              <div style={styles.fieldGroupFull}>
                <label style={styles.label}>Address Line 2</label>
                <input
                  style={styles.input(false)}
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleField}
                  placeholder="Area, Landmark (optional)"
                  autoComplete="address-line2"
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>City *</label>
                <input
                  style={styles.input(!!errors.city)}
                  name="city"
                  value={form.city}
                  onChange={handleField}
                  placeholder="City"
                  autoComplete="address-level2"
                />
                {errors.city && <span style={styles.errorText}>{errors.city}</span>}
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>State *</label>
                <input
                  style={styles.input(!!errors.state)}
                  name="state"
                  value={form.state}
                  onChange={handleField}
                  placeholder="State"
                  autoComplete="address-level1"
                />
                {errors.state && <span style={styles.errorText}>{errors.state}</span>}
              </div>
              <div style={{ ...styles.fieldGroupFull }}>
                <label style={styles.label}>PIN Code *</label>
                <div style={styles.pinRow}>
                  <div style={styles.pinInputWrap}>
                    <input
                      style={styles.input(!!errors.pinCode)}
                      name="pinCode"
                      value={form.pinCode}
                      onChange={handleField}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      autoComplete="postal-code"
                    />
                    {errors.pinCode && <span style={styles.errorText}>{errors.pinCode}</span>}
                  </div>
                  <button
                    style={styles.checkBtn}
                    onClick={handleCheckPin}
                    disabled={pinChecking}
                    type="button"
                  >
                    {pinChecking ? 'Checking…' : 'Check PIN'}
                  </button>
                </div>
                {pinCheckStatus === 'ok' && (
                  <div style={styles.serviceabilityMsg(true)}>✓ This PIN code is serviceable.</div>
                )}
                {pinCheckStatus === 'fail' && (
                  <div style={styles.serviceabilityMsg(false)}>✗ Sorry, this PIN code is not serviceable.</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={styles.btnRow}>
          {showNewForm ? (
            <button
              style={styles.primaryBtn(submitting)}
              onClick={handleSubmitNew}
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Continue to Payment'}
            </button>
          ) : (
            <button
              style={styles.primaryBtn(submitting || !selectedAddressId)}
              onClick={handleSubmitSaved}
              disabled={submitting || !selectedAddressId}
            >
              {submitting ? 'Saving…' : 'Deliver to Selected Address'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

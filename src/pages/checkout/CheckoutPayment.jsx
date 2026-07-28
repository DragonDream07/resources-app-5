import { useState } from 'react';
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
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  radioOption: (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    border: `2px solid ${selected ? '#4c6ef5' : '#868e96'}`,
    borderRadius: '10px',
    cursor: 'pointer',
    backgroundColor: selected ? '#e8ecfd' : '#ffffff',
  }),
  radioCircle: (selected) => ({
    width: '18px',
    height: '18px',
    borderRadius: '9999px',
    border: `2px solid ${selected ? '#4c6ef5' : '#868e96'}`,
    backgroundColor: selected ? '#4c6ef5' : '#ffffff',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  radioInner: {
    width: '7px',
    height: '7px',
    borderRadius: '9999px',
    backgroundColor: '#ffffff',
  },
  radioLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#212529',
  },
  radioSub: {
    fontSize: '13px',
    color: '#495057',
    marginTop: '2px',
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
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  mockBanner: {
    padding: '10px 14px',
    backgroundColor: '#fff4e6',
    color: '#fd7e14',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '20px',
    lineHeight: '20px',
  },
  testCardHint: {
    padding: '10px 14px',
    backgroundColor: '#e8ecfd',
    color: '#3b5bdb',
    borderRadius: '6px',
    fontSize: '13px',
    marginTop: '12px',
    lineHeight: '20px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
  },
  outlineBtn: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    color: '#4c6ef5',
    border: '2px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
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

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay' },
  { id: 'upi', label: 'UPI', sub: 'GPay, PhonePe, Paytm' },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
];

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

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upi, setUpi] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateCard = () => {
    const e = {};
    if (!card.number.replace(/\s/g, '').match(/^[0-9]{16}$/)) e.number = 'Enter a valid 16-digit card number.';
    if (!card.expiry.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) e.expiry = 'Enter expiry as MM/YY.';
    if (!card.cvv.match(/^[0-9]{3,4}$/)) e.cvv = 'Enter a valid CVV (3-4 digits).';
    if (!card.name.trim()) e.name = 'Cardholder name is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateUpi = () => {
    const e = {};
    if (!upi.trim().match(/^[a-zA-Z0-9._+-]+@[a-zA-Z]+$/)) e.upi = 'Enter a valid UPI ID (e.g. name@upi).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCardField = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'number') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
      if (formatted.length > 2) formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }
    if (name === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }
    setCard((prev) => ({ ...prev, [name]: formatted }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleContinue = async () => {
    if (method === 'card' && !validateCard()) return;
    if (method === 'upi' && !validateUpi()) return;
    setSubmitting(true);
    setApiError('');
    try {
      const token = localStorage.getItem('token');
      const body = { method };
      if (method === 'card') body.card = { number: card.number.replace(/\s/g, ''), expiry: card.expiry, cvv: card.cvv, name: card.name };
      if (method === 'upi') body.upi = { vpa: upi };
      const r = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const d = await r.json();
        setApiError(d.message || 'Payment initiation failed.');
        return;
      }
      navigate('/checkout/review');
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <CheckoutStepper current={1} />
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '24px', lineHeight: '32px' }}>
          Payment
        </h1>

        <div style={styles.mockBanner}>
          ⚠ Test Mode — No real charges will be made. Use test card details below.
        </div>

        {apiError && <div style={styles.alertBox('error')}>{apiError}</div>}

        <div style={styles.card}>
          <div style={styles.cardTitle}>Select Payment Method</div>
          <div style={styles.radioGroup}>
            {PAYMENT_METHODS.map((pm) => (
              <div
                key={pm.id}
                style={styles.radioOption(method === pm.id)}
                onClick={() => { setMethod(pm.id); setErrors({}); }}
                role="radio"
                aria-checked={method === pm.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { setMethod(pm.id); setErrors({}); }
                }}
              >
                <div style={styles.radioCircle(method === pm.id)}>
                  {method === pm.id && <div style={styles.radioInner} />}
                </div>
                <div>
                  <div style={styles.radioLabel}>{pm.label}</div>
                  <div style={styles.radioSub}>{pm.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {method === 'card' && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Card Details</div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Card Number *</label>
              <input
                style={styles.input(!!errors.number)}
                name="number"
                value={card.number}
                onChange={handleCardField}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                autoComplete="cc-number"
              />
              {errors.number && <span style={styles.errorText}>{errors.number}</span>}
            </div>
            <div style={styles.grid2}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Expiry Date *</label>
                <input
                  style={styles.input(!!errors.expiry)}
                  name="expiry"
                  value={card.expiry}
                  onChange={handleCardField}
                  placeholder="MM/YY"
                  maxLength={5}
                  autoComplete="cc-exp"
                />
                {errors.expiry && <span style={styles.errorText}>{errors.expiry}</span>}
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>CVV *</label>
                <input
                  style={styles.input(!!errors.cvv)}
                  name="cvv"
                  value={card.cvv}
                  onChange={handleCardField}
                  placeholder="123"
                  maxLength={4}
                  autoComplete="cc-csc"
                  type="password"
                />
                {errors.cvv && <span style={styles.errorText}>{errors.cvv}</span>}
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Cardholder Name *</label>
              <input
                style={styles.input(!!errors.name)}
                name="name"
                value={card.name}
                onChange={handleCardField}
                placeholder="Name as on card"
                autoComplete="cc-name"
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>
            <div style={styles.testCardHint}>
              Test card: 4111 1111 1111 1111 | Expiry: 12/26 | CVV: 123
            </div>
          </div>
        )}

        {method === 'upi' && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>UPI Details</div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>UPI ID *</label>
              <input
                style={styles.input(!!errors.upi)}
                name="upi"
                value={upi}
                onChange={(e) => { setUpi(e.target.value); setErrors({}); }}
                placeholder="yourname@upi"
                autoComplete="off"
              />
              {errors.upi && <span style={styles.errorText}>{errors.upi}</span>}
            </div>
            <div style={styles.testCardHint}>
              Test UPI: success@mockupi
            </div>
          </div>
        )}

        {method === 'cod' && (
          <div style={styles.card}>
            <div style={{ fontSize: '14px', color: '#495057', lineHeight: '20px' }}>
              You will pay in cash when your order is delivered. A small convenience fee may apply.
            </div>
          </div>
        )}

        <div style={styles.btnRow}>
          <button style={styles.outlineBtn} onClick={() => navigate('/checkout/address')}>
            ← Back
          </button>
          <button
            style={styles.primaryBtn(submitting)}
            onClick={handleContinue}
            disabled={submitting}
          >
            {submitting ? 'Processing…' : 'Review Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const PIN_REGEX = /^[1-9][0-9]{5}$/;

const INITIAL_FIELDS = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pinCode: '',
  isDefault: false,
};

function AddressForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [fields, setFields] = useState({ ...INITIAL_FIELDS, ...initialValues });
  const [errors, setErrors] = useState({});
  const [serviceability, setServiceability] = useState(null);
  const [pinCheckLoading, setPinCheckLoading] = useState(false);

  useEffect(() => {
    setFields({ ...INITIAL_FIELDS, ...initialValues });
  }, [initialValues]);

  const validate = (data) => {
    const e = {};
    if (!data.fullName.trim()) e.fullName = 'Full name is required.';
    if (!data.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^[6-9]\d{9}$/.test(data.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number.';
    if (!data.addressLine1.trim()) e.addressLine1 = 'Address line 1 is required.';
    if (!data.city.trim()) e.city = 'City is required.';
    if (!data.state.trim()) e.state = 'State is required.';
    if (!data.pinCode.trim()) e.pinCode = 'PIN code is required.';
    else if (!PIN_REGEX.test(data.pinCode.trim())) e.pinCode = 'Enter a valid 6-digit PIN code.';
    return e;
  };

  const checkServiceability = useCallback(async (pin) => {
    if (!PIN_REGEX.test(pin)) {
      setServiceability(null);
      return;
    }
    setPinCheckLoading(true);
    try {
      const res = await fetch(`/api/serviceability?pinCode=${encodeURIComponent(pin)}`);
      if (res.ok) {
        const data = await res.json();
        setServiceability(data.serviceable ? 'serviceable' : 'not_serviceable');
      } else {
        setServiceability(null);
      }
    } catch {
      setServiceability(null);
    } finally {
      setPinCheckLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFields((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === 'pinCode') {
      setServiceability(null);
      if (PIN_REGEX.test(value.trim())) {
        checkServiceability(value.trim());
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(fields);
  };

  return (
    <form className="address-form" onSubmit={handleSubmit} noValidate>
      <div className="address-form__row">
        <div className="address-form__field">
          <label htmlFor="af-fullName" className="address-form__label">Full Name *</label>
          <input
            id="af-fullName"
            name="fullName"
            type="text"
            className={`address-form__input${errors.fullName ? ' address-form__input--error' : ''}`}
            value={fields.fullName}
            onChange={handleChange}
            autoComplete="name"
            placeholder="Rajan Mehta"
          />
          {errors.fullName && <p className="address-form__error">{errors.fullName}</p>}
        </div>
        <div className="address-form__field">
          <label htmlFor="af-phone" className="address-form__label">Phone *</label>
          <input
            id="af-phone"
            name="phone"
            type="tel"
            className={`address-form__input${errors.phone ? ' address-form__input--error' : ''}`}
            value={fields.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="9876543210"
            maxLength={10}
          />
          {errors.phone && <p className="address-form__error">{errors.phone}</p>}
        </div>
      </div>

      <div className="address-form__field">
        <label htmlFor="af-addressLine1" className="address-form__label">Address Line 1 *</label>
        <input
          id="af-addressLine1"
          name="addressLine1"
          type="text"
          className={`address-form__input${errors.addressLine1 ? ' address-form__input--error' : ''}`}
          value={fields.addressLine1}
          onChange={handleChange}
          autoComplete="address-line1"
          placeholder="Flat / House No, Street"
        />
        {errors.addressLine1 && <p className="address-form__error">{errors.addressLine1}</p>}
      </div>

      <div className="address-form__field">
        <label htmlFor="af-addressLine2" className="address-form__label">Address Line 2</label>
        <input
          id="af-addressLine2"
          name="addressLine2"
          type="text"
          className="address-form__input"
          value={fields.addressLine2}
          onChange={handleChange}
          autoComplete="address-line2"
          placeholder="Locality, Landmark (optional)"
        />
      </div>

      <div className="address-form__row">
        <div className="address-form__field">
          <label htmlFor="af-city" className="address-form__label">City *</label>
          <input
            id="af-city"
            name="city"
            type="text"
            className={`address-form__input${errors.city ? ' address-form__input--error' : ''}`}
            value={fields.city}
            onChange={handleChange}
            autoComplete="address-level2"
            placeholder="Mumbai"
          />
          {errors.city && <p className="address-form__error">{errors.city}</p>}
        </div>
        <div className="address-form__field">
          <label htmlFor="af-state" className="address-form__label">State *</label>
          <input
            id="af-state"
            name="state"
            type="text"
            className={`address-form__input${errors.state ? ' address-form__input--error' : ''}`}
            value={fields.state}
            onChange={handleChange}
            autoComplete="address-level1"
            placeholder="Maharashtra"
          />
          {errors.state && <p className="address-form__error">{errors.state}</p>}
        </div>
      </div>

      <div className="address-form__field address-form__field--pin">
        <label htmlFor="af-pinCode" className="address-form__label">PIN Code *</label>
        <div className="address-form__pin-wrapper">
          <input
            id="af-pinCode"
            name="pinCode"
            type="text"
            className={`address-form__input${errors.pinCode ? ' address-form__input--error' : ''}`}
            value={fields.pinCode}
            onChange={handleChange}
            autoComplete="postal-code"
            placeholder="400001"
            maxLength={6}
          />
          {pinCheckLoading && (
            <span className="address-form__pin-status address-form__pin-status--loading">
              Checking…
            </span>
          )}
          {!pinCheckLoading && serviceability === 'serviceable' && (
            <span className="address-form__pin-status address-form__pin-status--ok">
              ✓ Delivery available
            </span>
          )}
          {!pinCheckLoading && serviceability === 'not_serviceable' && (
            <span className="address-form__pin-status address-form__pin-status--fail">
              ✗ Not serviceable in this area
            </span>
          )}
        </div>
        {errors.pinCode && <p className="address-form__error">{errors.pinCode}</p>}
      </div>

      <div className="address-form__field address-form__field--checkbox">
        <label className="address-form__checkbox-label">
          <input
            name="isDefault"
            type="checkbox"
            checked={fields.isDefault}
            onChange={handleChange}
          />
          <span>Set as default address</span>
        </label>
      </div>

      <div className="address-form__actions">
        {onCancel && (
          <button
            type="button"
            className="address-form__btn address-form__btn--secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="address-form__btn address-form__btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Save & Continue'}
        </button>
      </div>

      <style>{`
        .address-form { display: flex; flex-direction: column; gap: 1rem; }
        .address-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 480px) { .address-form__row { grid-template-columns: 1fr; } }
        .address-form__field { display: flex; flex-direction: column; gap: 0.25rem; }
        .address-form__label { font-size: 0.875rem; font-weight: 500; color: #374151; }
        .address-form__input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .address-form__input:focus { border-color: #2563eb; box-shadow: 0 0 0 2px #bfdbfe; }
        .address-form__input--error { border-color: #dc2626; }
        .address-form__error { font-size: 0.8125rem; color: #dc2626; margin: 0; }
        .address-form__pin-wrapper { display: flex; align-items: center; gap: 0.75rem; }
        .address-form__pin-wrapper .address-form__input { flex: 0 0 9rem; }
        .address-form__pin-status { font-size: 0.8125rem; font-weight: 500; }
        .address-form__pin-status--loading { color: #6b7280; }
        .address-form__pin-status--ok { color: #16a34a; }
        .address-form__pin-status--fail { color: #dc2626; }
        .address-form__field--checkbox { flex-direction: row; align-items: center; }
        .address-form__checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #374151; cursor: pointer; }
        .address-form__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
        .address-form__btn {
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background 0.15s;
        }
        .address-form__btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .address-form__btn--primary { background: #2563eb; color: #fff; }
        .address-form__btn--primary:hover:not(:disabled) { background: #1d4ed8; }
        .address-form__btn--secondary { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
        .address-form__btn--secondary:hover:not(:disabled) { background: #e5e7eb; }
      `}</style>
    </form>
  );
}

AddressForm.propTypes = {
  initialValues: PropTypes.shape({
    fullName: PropTypes.string,
    phone: PropTypes.string,
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pinCode: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

AddressForm.defaultProps = {
  initialValues: {},
  onCancel: null,
  isSubmitting: false,
};

export default AddressForm;

import React, { useState, useEffect } from 'react';

const PromoCodeForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_order_amount: '',
    max_uses: '',
    expiry_date: '',
    is_active: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        code: '',
        type: 'percentage',
        value: '',
        min_order_amount: '',
        max_uses: '',
        expiry_date: '',
        is_active: true,
        ...initialData,
        expiry_date: initialData.expiry_date
          ? initialData.expiry_date.split('T')[0]
          : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="promo-code-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="promo-code-form__error">{error}</div>}

      <div className="promo-code-form__field">
        <label htmlFor="promo-code">Code</label>
        <input
          id="promo-code"
          name="code"
          type="text"
          value={form.code}
          onChange={handleChange}
          required
          style={{ textTransform: 'uppercase' }}
        />
      </div>

      <div className="promo-code-form__field">
        <label htmlFor="promo-type">Discount Type</label>
        <select
          id="promo-type"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="percentage">Percentage (%)</option>
          <option value="flat">Flat Amount</option>
        </select>
      </div>

      <div className="promo-code-form__field">
        <label htmlFor="promo-value">
          {form.type === 'percentage' ? 'Discount (%)' : 'Discount Amount'}
        </label>
        <input
          id="promo-value"
          name="value"
          type="number"
          min="0"
          step={form.type === 'percentage' ? '1' : '0.01'}
          max={form.type === 'percentage' ? '100' : undefined}
          value={form.value}
          onChange={handleChange}
          required
        />
      </div>

      <div className="promo-code-form__field">
        <label htmlFor="promo-min-order">Minimum Order Amount</label>
        <input
          id="promo-min-order"
          name="min_order_amount"
          type="number"
          min="0"
          step="0.01"
          value={form.min_order_amount}
          onChange={handleChange}
        />
      </div>

      <div className="promo-code-form__field">
        <label htmlFor="promo-max-uses">Max Uses</label>
        <input
          id="promo-max-uses"
          name="max_uses"
          type="number"
          min="0"
          value={form.max_uses}
          onChange={handleChange}
        />
      </div>

      <div className="promo-code-form__field">
        <label htmlFor="promo-expiry">Expiry Date</label>
        <input
          id="promo-expiry"
          name="expiry_date"
          type="date"
          value={form.expiry_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="promo-code-form__field promo-code-form__field--checkbox">
        <label htmlFor="promo-active">
          <input
            id="promo-active"
            name="is_active"
            type="checkbox"
            checked={!!form.is_active}
            onChange={handleChange}
          />
          Active
        </label>
      </div>

      <div className="promo-code-form__actions">
        {onCancel && (
          <button type="button" className="promo-code-form__cancel-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="promo-code-form__submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Promo Code'}
        </button>
      </div>
    </form>
  );
};

export default PromoCodeForm;

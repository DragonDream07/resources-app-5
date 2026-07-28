import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const INITIAL_FORM = {
  code: '',
  type: 'percentage',
  discount_value: '',
  min_order_value: '',
  max_uses: '',
  expires_at: '',
  is_active: true,
};

export default function AdminPromotionNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!form.code.trim()) errors.code = 'Code is required.';
    if (!form.discount_value) errors.discount_value = 'Discount value is required.';
    if (Number(form.discount_value) <= 0) errors.discount_value = 'Discount value must be greater than 0.';
    if (form.type === 'percentage' && Number(form.discount_value) > 100) {
      errors.discount_value = 'Percentage discount cannot exceed 100.';
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        discount_value: Number(form.discount_value),
        is_active: form.is_active,
      };
      if (form.min_order_value) payload.min_order_value = Number(form.min_order_value);
      if (form.max_uses) payload.max_uses = Number(form.max_uses);
      if (form.expires_at) payload.expires_at = form.expires_at;

      const res = await fetch('/api/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create promo code');
      }
      navigate('/admin/promotions');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <Link to="/admin/promotions" className="admin-page__back-link">
          <img src="/src/assets/icons/chevron-left.svg" alt="" />
          Back to Promo Codes
        </Link>
        <h1 className="admin-page__title">New Promo Code</h1>
      </div>

      <div className="admin-form-card">
        {error && <p className="admin-form__error admin-form__error--global">{error}</p>}

        <form onSubmit={handleSubmit} noValidate className="admin-form">
          <div className="admin-form__group">
            <label htmlFor="code" className="admin-form__label">
              Code <span className="admin-form__required">*</span>
            </label>
            <input
              id="code"
              name="code"
              type="text"
              className={`admin-form__input${fieldErrors.code ? ' admin-form__input--error' : ''}`}
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. SUMMER20"
              autoComplete="off"
            />
            {fieldErrors.code && (
              <p className="admin-form__field-error">{fieldErrors.code}</p>
            )}
          </div>

          <div className="admin-form__group">
            <label htmlFor="type" className="admin-form__label">
              Type <span className="admin-form__required">*</span>
            </label>
            <select
              id="type"
              name="type"
              className="admin-form__select"
              value={form.type}
              onChange={handleChange}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="admin-form__group">
            <label htmlFor="discount_value" className="admin-form__label">
              Discount Value <span className="admin-form__required">*</span>
            </label>
            <input
              id="discount_value"
              name="discount_value"
              type="number"
              min="0"
              step={form.type === 'percentage' ? '1' : '0.01'}
              className={`admin-form__input${fieldErrors.discount_value ? ' admin-form__input--error' : ''}`}
              value={form.discount_value}
              onChange={handleChange}
              placeholder={form.type === 'percentage' ? 'e.g. 20' : 'e.g. 10.00'}
            />
            {fieldErrors.discount_value && (
              <p className="admin-form__field-error">{fieldErrors.discount_value}</p>
            )}
          </div>

          <div className="admin-form__group">
            <label htmlFor="min_order_value" className="admin-form__label">
              Minimum Order Value
            </label>
            <input
              id="min_order_value"
              name="min_order_value"
              type="number"
              min="0"
              step="0.01"
              className="admin-form__input"
              value={form.min_order_value}
              onChange={handleChange}
              placeholder="e.g. 50.00"
            />
          </div>

          <div className="admin-form__group">
            <label htmlFor="max_uses" className="admin-form__label">
              Maximum Uses
            </label>
            <input
              id="max_uses"
              name="max_uses"
              type="number"
              min="1"
              step="1"
              className="admin-form__input"
              value={form.max_uses}
              onChange={handleChange}
              placeholder="Leave blank for unlimited"
            />
          </div>

          <div className="admin-form__group">
            <label htmlFor="expires_at" className="admin-form__label">
              Expiry Date
            </label>
            <input
              id="expires_at"
              name="expires_at"
              type="date"
              className="admin-form__input"
              value={form.expires_at}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form__group admin-form__group--checkbox">
            <label className="admin-form__checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                className="admin-form__checkbox"
                checked={form.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="admin-form__actions">
            <Link to="/admin/promotions" className="admin-form__btn admin-form__btn--secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="admin-form__btn admin-form__btn--primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Promo Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

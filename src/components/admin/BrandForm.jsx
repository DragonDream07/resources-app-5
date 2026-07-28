import React, { useState, useEffect } from 'react';

const BrandForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo_url: '',
    is_active: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setForm({ name: '', description: '', logo_url: '', is_active: true, ...initialData });
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
    <form className="brand-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="brand-form__error">{error}</div>}

      <div className="brand-form__field">
        <label htmlFor="brand-name">Name</label>
        <input
          id="brand-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="brand-form__field">
        <label htmlFor="brand-description">Description</label>
        <textarea
          id="brand-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="brand-form__field">
        <label htmlFor="brand-logo">Logo URL</label>
        <input
          id="brand-logo"
          name="logo_url"
          type="url"
          value={form.logo_url}
          onChange={handleChange}
          placeholder="https://"
        />
      </div>

      <div className="brand-form__field brand-form__field--checkbox">
        <label htmlFor="brand-active">
          <input
            id="brand-active"
            name="is_active"
            type="checkbox"
            checked={!!form.is_active}
            onChange={handleChange}
          />
          Active
        </label>
      </div>

      <div className="brand-form__actions">
        {onCancel && (
          <button type="button" className="brand-form__cancel-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="brand-form__submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Brand'}
        </button>
      </div>
    </form>
  );
};

export default BrandForm;

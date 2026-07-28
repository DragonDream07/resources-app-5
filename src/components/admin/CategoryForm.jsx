import React, { useState, useEffect } from 'react';

const CategoryForm = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    parent_id: '',
    is_active: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setForm({ name: '', description: '', parent_id: '', is_active: true, ...initialData });
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

  const availableParents = (categories || []).filter(
    (cat) => !initialData?.id || cat.id !== initialData.id
  );

  return (
    <form className="category-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="category-form__error">{error}</div>}

      <div className="category-form__field">
        <label htmlFor="category-name">Name</label>
        <input
          id="category-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="category-form__field">
        <label htmlFor="category-description">Description</label>
        <textarea
          id="category-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="category-form__field">
        <label htmlFor="category-parent">Parent Category</label>
        <select
          id="category-parent"
          name="parent_id"
          value={form.parent_id}
          onChange={handleChange}
        >
          <option value="">None (top-level)</option>
          {availableParents.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="category-form__field category-form__field--checkbox">
        <label htmlFor="category-active">
          <input
            id="category-active"
            name="is_active"
            type="checkbox"
            checked={!!form.is_active}
            onChange={handleChange}
          />
          Active
        </label>
      </div>

      <div className="category-form__actions">
        {onCancel && (
          <button type="button" className="category-form__cancel-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="category-form__submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;

import React, { useState, useEffect } from 'react';

const emptyVariant = () => ({
  id: null,
  sku_code: '',
  size: '',
  color: '',
  price: '',
  stock: '',
  is_active: true,
});

const ProductForm = ({
  initialData,
  categories,
  brands,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    is_active: true,
    ...initialData,
  });

  const [variants, setVariants] = useState(
    initialData?.skus?.length ? initialData.skus : [emptyVariant()]
  );

  useEffect(() => {
    if (initialData) {
      setForm({ name: '', description: '', category_id: '', brand_id: '', is_active: true, ...initialData });
      setVariants(initialData.skus?.length ? initialData.skus : [emptyVariant()]);
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: type === 'checkbox' ? checked : value };
      return updated;
    });
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, skus: variants });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="product-form__error">{error}</div>}

      <div className="product-form__field">
        <label htmlFor="product-name">Name</label>
        <input
          id="product-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="product-form__field">
        <label htmlFor="product-description">Description</label>
        <textarea
          id="product-description"
          name="description"
          value={form.description}
          onChange={handleFormChange}
          rows={4}
        />
      </div>

      <div className="product-form__field">
        <label htmlFor="product-category">Category</label>
        <select
          id="product-category"
          name="category_id"
          value={form.category_id}
          onChange={handleFormChange}
          required
        >
          <option value="">Select category</option>
          {(categories || []).map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="product-form__field">
        <label htmlFor="product-brand">Brand</label>
        <select
          id="product-brand"
          name="brand_id"
          value={form.brand_id}
          onChange={handleFormChange}
        >
          <option value="">Select brand</option>
          {(brands || []).map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="product-form__field product-form__field--checkbox">
        <label htmlFor="product-active">
          <input
            id="product-active"
            name="is_active"
            type="checkbox"
            checked={!!form.is_active}
            onChange={handleFormChange}
          />
          Active
        </label>
      </div>

      <section className="product-form__variants">
        <div className="product-form__variants-header">
          <h3>SKU Variants</h3>
          <button type="button" className="product-form__add-variant-btn" onClick={addVariant}>
            + Add Variant
          </button>
        </div>

        {variants.map((variant, index) => (
          <div key={index} className="product-form__variant">
            <div className="product-form__variant-fields">
              <div className="product-form__field">
                <label>SKU Code</label>
                <input
                  name="sku_code"
                  type="text"
                  value={variant.sku_code}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="product-form__field">
                <label>Size</label>
                <input
                  name="size"
                  type="text"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, e)}
                />
              </div>
              <div className="product-form__field">
                <label>Color</label>
                <input
                  name="color"
                  type="text"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, e)}
                />
              </div>
              <div className="product-form__field">
                <label>Price</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="product-form__field">
                <label>Stock</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="product-form__field product-form__field--checkbox">
                <label>
                  <input
                    name="is_active"
                    type="checkbox"
                    checked={!!variant.is_active}
                    onChange={(e) => handleVariantChange(index, e)}
                  />
                  Active
                </label>
              </div>
            </div>
            {variants.length > 1 && (
              <button
                type="button"
                className="product-form__remove-variant-btn"
                onClick={() => removeVariant(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </section>

      <div className="product-form__actions">
        {onCancel && (
          <button type="button" className="product-form__cancel-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="product-form__submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

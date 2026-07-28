import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { status: res.status, body };
  }
  return res.json();
}

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057' };
const inputStyle = { padding: '10px 12px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', outline: 'none', background: '#fff', color: '#212529', width: '100%', boxSizing: 'border-box', minHeight: '44px' };
const errorTextStyle = { fontSize: '12px', color: '#f03e3e' };

export default function AdminProductNew() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [refLoading, setRefLoading] = useState(true);
  const [catError, setCatError] = useState(false);
  const [brandError, setBrandError] = useState(false);

  const [form, setForm] = useState({
    name: '', slug: '', description: '', category_id: '', brand_id: '',
    base_price: '', tax_rate: '', is_active: true,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReferenceData();
  }, []);

  async function loadReferenceData() {
    setRefLoading(true);
    const [catRes, brandRes] = await Promise.allSettled([
      apiFetch('/categories'),
      apiFetch('/brands'),
    ]);
    if (catRes.status === 'fulfilled') {
      setCategories(catRes.value.categories || catRes.value.data || []);
      setCatError(false);
    } else {
      setCatError(true);
    }
    if (brandRes.status === 'fulfilled') {
      setBrands(brandRes.value.brands || brandRes.value.data || []);
      setBrandError(false);
    } else {
      setBrandError(true);
    }
    setRefLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.base_price || isNaN(Number(form.base_price)) || Number(form.base_price) < 0) errs.base_price = 'A valid base price is required.';
    if (form.tax_rate === '' || isNaN(Number(form.tax_rate)) || Number(form.tax_rate) < 0) errs.tax_rate = 'A valid tax rate is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim() || undefined,
        category_id: form.category_id || undefined,
        brand_id: form.brand_id || undefined,
        base_price: Number(form.base_price),
        tax_rate: Number(form.tax_rate),
        is_active: form.is_active,
      };
      const data = await apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) });
      const newId = data.product?.id || data.id;
      navigate(`/admin/catalogue/products/${newId}/edit`, { state: { successToast: 'Product created successfully.' } });
    } catch (err) {
      const body = err.body || {};
      if (body.errors) {
        const fe = {};
        (body.errors || []).forEach(e => { if (e.field) fe[e.field] = e.message; });
        setFieldErrors(fe);
      }
      if (body.message?.toLowerCase().includes('slug')) {
        setFieldErrors(prev => ({ ...prev, slug: body.message }));
      }
      setSubmitError('Product could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", color: '#212529', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <a href="/admin/catalogue/products" style={{ fontSize: '14px', color: '#4c6ef5', textDecoration: 'none' }}>← Products</a>
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: '8px 0 0' }}>New Product</h1>
        </div>

        {submitError && (
          <div style={{ background: '#ffe3e3', color: '#f03e3e', border: '1px solid #f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.name ? '#f03e3e' : '#868e96' }} placeholder="Product name" />
              {fieldErrors.name && <span style={errorTextStyle}>{fieldErrors.name}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.slug ? '#f03e3e' : '#868e96', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace" }} placeholder="auto-generated if blank" />
              {fieldErrors.slug && <span style={errorTextStyle}>{fieldErrors.slug}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} style={{ ...inputStyle, minHeight: 'unset', resize: 'vertical' }} placeholder="Product description" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Category</label>
                {refLoading ? (
                  <div style={{ ...inputStyle, background: '#e9ecef', color: '#adb5bd' }}>Loading…</div>
                ) : catError ? (
                  <div style={{ fontSize: '14px', color: '#f03e3e' }}>Could not load options — <button type="button" onClick={loadReferenceData} style={{ color: '#4c6ef5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>retry</button></div>
                ) : (
                  <select name="category_id" value={form.category_id} onChange={handleChange} style={inputStyle}>
                    <option value="">— None —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Brand</label>
                {refLoading ? (
                  <div style={{ ...inputStyle, background: '#e9ecef', color: '#adb5bd' }}>Loading…</div>
                ) : brandError ? (
                  <div style={{ fontSize: '14px', color: '#f03e3e' }}>Could not load options — <button type="button" onClick={loadReferenceData} style={{ color: '#4c6ef5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>retry</button></div>
                ) : (
                  <select name="brand_id" value={form.brand_id} onChange={handleChange} style={inputStyle}>
                    <option value="">— None —</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Base Price (₹) *</label>
                <input name="base_price" type="number" min="0" step="0.01" value={form.base_price} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.base_price ? '#f03e3e' : '#868e96' }} placeholder="0.00" />
                {fieldErrors.base_price && <span style={errorTextStyle}>{fieldErrors.base_price}</span>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tax Rate (%) *</label>
                <input name="tax_rate" type="number" min="0" step="0.01" value={form.tax_rate} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.tax_rate ? '#f03e3e' : '#868e96' }} placeholder="0" />
                {fieldErrors.tax_rate && <span style={errorTextStyle}>{fieldErrors.tax_rate}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="is_active" style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Active (visible to customers)</label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <a href="/admin/catalogue/products" style={{ padding: '10px 20px', border: '1px solid #868e96', borderRadius: '10px', background: '#fff', color: '#212529', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px' }}>Cancel</a>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', background: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', minHeight: '44px' }}>
              {submitting ? 'Saving…' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

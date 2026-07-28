import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import plusIcon from '@/assets/icons/plus.svg';
import trashIcon from '@/assets/icons/trash.svg';

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

const emptySku = () => ({ id: null, sku_code: '', size: '', color: '', stock: '', price_modifier: '' });

export default function AdminProductEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [refLoading, setRefLoading] = useState(true);
  const [catError, setCatError] = useState(false);
  const [brandError, setBrandError] = useState(false);

  const [form, setForm] = useState(null);
  const [skus, setSkus] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState(location.state?.successToast || null);

  const [skuErrors, setSkuErrors] = useState([]);
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    loadAll();
  }, [id]);

  async function loadAll() {
    setLoadingProduct(true);
    setProductError(null);
    const [refRes, prodRes, skuRes, imgRes] = await Promise.allSettled([
      loadReferenceData(),
      apiFetch(`/products/${id}`),
      apiFetch(`/products/${id}/skus`),
      apiFetch(`/products/${id}/images`),
    ]);
    if (prodRes.status === 'fulfilled') {
      const p = prodRes.value.product || prodRes.value;
      setForm({
        name: p.name || '',
        slug: p.slug || '',
        description: p.description || '',
        category_id: p.category_id ? String(p.category_id) : '',
        brand_id: p.brand_id ? String(p.brand_id) : '',
        base_price: p.base_price !== undefined ? String(p.base_price) : '',
        tax_rate: p.tax_rate !== undefined ? String(p.tax_rate) : '',
        is_active: p.is_active !== undefined ? p.is_active : true,
      });
    } else {
      setProductError('Could not load product.');
    }
    if (skuRes.status === 'fulfilled') {
      const list = skuRes.value.skus || skuRes.value.data || [];
      setSkus(list.map(s => ({ id: s.id, sku_code: s.sku_code || '', size: s.size || '', color: s.color || '', stock: String(s.stock ?? ''), price_modifier: String(s.price_modifier ?? '') })));
    }
    if (imgRes.status === 'fulfilled') {
      setImages(imgRes.value.images || imgRes.value.data || []);
    }
    setLoadingProduct(false);
  }

  async function loadReferenceData() {
    setRefLoading(true);
    const [catRes, brandRes] = await Promise.allSettled([
      apiFetch('/categories'),
      apiFetch('/brands'),
    ]);
    if (catRes.status === 'fulfilled') { setCategories(catRes.value.categories || catRes.value.data || []); setCatError(false); } else { setCatError(true); }
    if (brandRes.status === 'fulfilled') { setBrands(brandRes.value.brands || brandRes.value.data || []); setBrandError(false); } else { setBrandError(true); }
    setRefLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleSkuChange(idx, field, value) {
    setSkus(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    setSkuErrors(prev => { const next = [...prev]; if (next[idx]) next[idx] = { ...next[idx], [field]: undefined }; return next; });
  }

  function addSku() {
    setSkus(prev => [...prev, emptySku()]);
  }

  function removeSku(idx) {
    setSkus(prev => prev.filter((_, i) => i !== idx));
    setSkuErrors(prev => prev.filter((_, i) => i !== idx));
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
      await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

      const skuErrs = [];
      for (let i = 0; i < skus.length; i++) {
        const s = skus[i];
        if (!s.sku_code.trim()) {
          skuErrs[i] = { ...(skuErrs[i] || {}), sku_code: 'SKU code is required.' };
        }
      }
      if (skuErrs.some(Boolean)) { setSkuErrors(skuErrs); setSubmitting(false); return; }

      for (const s of skus) {
        const sp = { sku_code: s.sku_code.trim(), size: s.size || undefined, color: s.color || undefined, stock: s.stock !== '' ? Number(s.stock) : 0, price_modifier: s.price_modifier !== '' ? Number(s.price_modifier) : 0 };
        if (s.id) {
          await apiFetch(`/products/${id}/skus/${s.id}`, { method: 'PUT', body: JSON.stringify(sp) }).catch(() => {});
        } else {
          await apiFetch(`/products/${id}/skus`, { method: 'POST', body: JSON.stringify(sp) }).catch(() => {});
        }
      }

      setToast('Product saved successfully.');
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

  async function handleImageUpload(e) {
    e.preventDefault();
    if (!imageFile) return;
    setImageUploading(true);
    setImageError(null);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('image', imageFile);
      const res = await fetch(`${API_BASE}/products/${id}/images`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages(prev => [...prev, ...(data.images || [data.image] || [])]);
      setImageFile(null);
    } catch {
      setImageError('Image upload failed.');
    } finally {
      setImageUploading(false);
    }
  }

  if (loadingProduct) return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '48px', textAlign: 'center', color: '#495057' }}>Loading product…</div>
  );
  if (productError) return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '48px', textAlign: 'center', color: '#f03e3e' }}>{productError}</div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", color: '#212529', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {toast && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#37b24d', color: '#fff', borderRadius: '10px', padding: '14px 22px', fontSize: '14px', fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.16)' }}>
            {toast}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <a href="/admin/catalogue/products" style={{ fontSize: '14px', color: '#4c6ef5', textDecoration: 'none' }}>← Products</a>
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: '8px 0 0' }}>Edit Product</h1>
        </div>

        {submitError && (
          <div style={{ background: '#ffe3e3', color: '#f03e3e', border: '1px solid #f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Product Details</h2>

            <div style={fieldStyle}>
              <label style={labelStyle}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.name ? '#f03e3e' : '#868e96' }} />
              {fieldErrors.name && <span style={errorTextStyle}>{fieldErrors.name}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.slug ? '#f03e3e' : '#868e96', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace" }} />
              {fieldErrors.slug && <span style={errorTextStyle}>{fieldErrors.slug}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} style={{ ...inputStyle, minHeight: 'unset', resize: 'vertical' }} />
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
                <input name="base_price" type="number" min="0" step="0.01" value={form.base_price} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.base_price ? '#f03e3e' : '#868e96' }} />
                {fieldErrors.base_price && <span style={errorTextStyle}>{fieldErrors.base_price}</span>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tax Rate (%) *</label>
                <input name="tax_rate" type="number" min="0" step="0.01" value={form.tax_rate} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.tax_rate ? '#f03e3e' : '#868e96' }} />
                {fieldErrors.tax_rate && <span style={errorTextStyle}>{fieldErrors.tax_rate}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input id="is_active_edit" name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="is_active_edit" style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Active (visible to customers)</label>
            </div>
          </div>

          {/* SKUs */}
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>SKUs</h2>
              <button type="button" onClick={addSku} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e8ecfd', color: '#4c6ef5', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', minHeight: '36px' }}>
                <img src={plusIcon} alt="" style={{ width: '14px', height: '14px' }} /> Add SKU
              </button>
            </div>
            {skus.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No SKUs yet. Add one above.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {skus.map((s, idx) => (
                  <div key={idx} style={{ border: '1px solid #e9ecef', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#495057' }}>SKU #{idx + 1}</span>
                      <button type="button" onClick={() => removeSku(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f03e3e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                        <img src={trashIcon} alt="" style={{ width: '14px', height: '14px' }} /> Remove
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>SKU Code *</label>
                        <input value={s.sku_code} onChange={e => handleSkuChange(idx, 'sku_code', e.target.value)} style={{ ...inputStyle, fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", borderColor: skuErrors[idx]?.sku_code ? '#f03e3e' : '#868e96' }} />
                        {skuErrors[idx]?.sku_code && <span style={errorTextStyle}>{skuErrors[idx].sku_code}</span>}
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Size</label>
                        <input value={s.size} onChange={e => handleSkuChange(idx, 'size', e.target.value)} style={inputStyle} />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Color</label>
                        <input value={s.color} onChange={e => handleSkuChange(idx, 'color', e.target.value)} style={inputStyle} />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Stock</label>
                        <input type="number" min="0" value={s.stock} onChange={e => handleSkuChange(idx, 'stock', e.target.value)} style={inputStyle} />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Price Modifier (₹)</label>
                        <input type="number" step="0.01" value={s.price_modifier} onChange={e => handleSkuChange(idx, 'price_modifier', e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>Images</h2>
            {images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                {images.map((img, i) => (
                  <img key={img.id || i} src={img.url || img.image_url} alt={`Product image ${i + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e9ecef' }} />
                ))}
              </div>
            )}
            {imageError && <div style={{ fontSize: '13px', color: '#f03e3e', marginBottom: '8px' }}>{imageError}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '14px' }} />
              <button type="button" onClick={handleImageUpload} disabled={!imageFile || imageUploading} style={{ padding: '8px 16px', background: '#4c6ef5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: (!imageFile || imageUploading) ? 'not-allowed' : 'pointer', opacity: (!imageFile || imageUploading) ? 0.6 : 1, minHeight: '36px' }}>
                {imageUploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <a href="/admin/catalogue/products" style={{ padding: '10px 20px', border: '1px solid #868e96', borderRadius: '10px', background: '#fff', color: '#212529', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px' }}>Cancel</a>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', background: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', minHeight: '44px' }}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

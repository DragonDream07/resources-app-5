import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

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

export default function AdminCategoryEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);

  const [form, setForm] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(location.state?.successToast || null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => { loadAll(); }, [id]);

  async function loadAll() {
    setLoadingCategory(true);
    setCategoryError(null);
    const [catListRes, catRes] = await Promise.allSettled([
      apiFetch('/categories'),
      apiFetch(`/categories/${id}`),
    ]);
    if (catListRes.status === 'fulfilled') {
      const list = (catListRes.value.categories || catListRes.value.data || []).filter(c => String(c.id) !== String(id));
      setCategories(list);
      setCatError(false);
    } else {
      setCatError(true);
    }
    if (catRes.status === 'fulfilled') {
      const c = catRes.value.category || catRes.value;
      setForm({ name: c.name || '', slug: c.slug || '', description: c.description || '', parent_id: c.parent_id ? String(c.parent_id) : '', is_active: c.is_active !== undefined ? c.is_active : true });
    } else {
      setCategoryError('Could not load category.');
    }
    setLoadingCategory(false);
    setCatLoading(false);
  }

  async function reloadCategories() {
    setCatLoading(true);
    try {
      const data = await apiFetch('/categories');
      setCategories((data.categories || data.data || []).filter(c => String(c.id) !== String(id)));
      setCatError(false);
    } catch {
      setCatError(true);
    } finally {
      setCatLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
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
        parent_id: form.parent_id || undefined,
        is_active: form.is_active,
      };
      await apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setToast('Category saved successfully.');
    } catch (err) {
      const body = err.body || {};
      if (body.errors) {
        const fe = {};
        (body.errors || []).forEach(e => { if (e.field) fe[e.field] = e.message; });
        setFieldErrors(fe);
      }
      setSubmitError('Category could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCategory) return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '48px', textAlign: 'center', color: '#495057' }}>Loading category…</div>
  );
  if (categoryError) return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '48px', textAlign: 'center', color: '#f03e3e' }}>{categoryError}</div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", color: '#212529', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {toast && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#37b24d', color: '#fff', borderRadius: '10px', padding: '14px 22px', fontSize: '14px', fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.16)' }}>
            {toast}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <a href="/admin/catalogue/categories" style={{ fontSize: '14px', color: '#4c6ef5', textDecoration: 'none' }}>← Categories</a>
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: '8px 0 0' }}>Edit Category</h1>
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
              <input name="name" value={form.name} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.name ? '#f03e3e' : '#868e96' }} />
              {fieldErrors.name && <span style={errorTextStyle}>{fieldErrors.name}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} style={{ ...inputStyle, fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", borderColor: fieldErrors.slug ? '#f03e3e' : '#868e96' }} />
              {fieldErrors.slug && <span style={errorTextStyle}>{fieldErrors.slug}</span>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle, minHeight: 'unset', resize: 'vertical' }} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Parent Category</label>
              {catLoading ? (
                <div style={{ ...inputStyle, background: '#e9ecef', color: '#adb5bd' }}>Loading…</div>
              ) : catError ? (
                <div style={{ fontSize: '14px', color: '#f03e3e' }}>Could not load options — <button type="button" onClick={reloadCategories} style={{ color: '#4c6ef5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>retry</button></div>
              ) : (
                <select name="parent_id" value={form.parent_id} onChange={handleChange} style={inputStyle}>
                  <option value="">— None (top-level) —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input id="cat_edit_is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="cat_edit_is_active" style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Active</label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <a href="/admin/catalogue/categories" style={{ padding: '10px 20px', border: '1px solid #868e96', borderRadius: '10px', background: '#fff', color: '#212529', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px' }}>Cancel</a>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', background: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', minHeight: '44px' }}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

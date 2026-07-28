import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

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

export default function AdminBrandEdit() {
  const { id } = useParams();
  const location = useLocation();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

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

  useEffect(() => { loadBrand(); }, [id]);

  async function loadBrand() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await apiFetch(`/brands/${id}`);
      const b = data.brand || data;
      setForm({
        name: b.name || '',
        slug: b.slug || '',
        description: b.description || '',
        website: b.website || '',
        logo_url: b.logo_url || '',
      });
    } catch {
      setLoadError('Could not load brand.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (form.website && !/^https?:\/\//i.test(form.website.trim())) errs.website = 'Website must be a valid URL starting with http:// or https://';
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
        website: form.website.trim() || undefined,
        logo_url: form.logo_url.trim() || undefined,
      };
      await apiFetch(`/brands/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setToast('Brand saved successfully.');
    } catch (err) {
      const body = err.body || {};
      if (body.errors) {
        const fe = {};
        (body.errors || []).forEach(e => { if (e.field) fe[e.field] = e.message; });
        setFieldErrors(fe);
      }
      setSubmitError('Brand could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '48px', textAlign: 'center', color: '#495057' }}>Loading brand…</div>
  );
  if (loadError) return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '48px', textAlign: 'center', color: '#f03e3e' }}>{loadError}</div>
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
          <a href="/admin/catalogue/brands" style={{ fontSize: '14px', color: '#4c6ef5', textDecoration: 'none' }}>← Brands</a>
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: '8px 0 0' }}>Edit Brand</h1>
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
              <input name="slug" value={form.slug} onChange={handleChange} style={{ ...inputStyle, fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace" }} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle, minHeight: 'unset', resize: 'vertical' }} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Website URL</label>
              <input name="website" type="url" value={form.website} onChange={handleChange} style={{ ...inputStyle, borderColor: fieldErrors.website ? '#f03e3e' : '#868e96' }} placeholder="https://" />
              {fieldErrors.website && <span style={errorTextStyle}>{fieldErrors.website}</span>}
            </div>

            {form.logo_url && (
              <div style={{ marginBottom: '4px' }}>
                <img src={form.logo_url} alt="Brand logo" style={{ height: '48px', objectFit: 'contain', border: '1px solid #e9ecef', borderRadius: '6px', padding: '4px' }} />
              </div>
            )}
            <div style={fieldStyle}>
              <label style={labelStyle}>Logo URL</label>
              <input name="logo_url" type="url" value={form.logo_url} onChange={handleChange} style={inputStyle} placeholder="https://" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <a href="/admin/catalogue/brands" style={{ padding: '10px 20px', border: '1px solid #868e96', borderRadius: '10px', background: '#fff', color: '#212529', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px' }}>Cancel</a>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', background: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', minHeight: '44px' }}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

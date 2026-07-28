import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import plusIcon from '@/assets/icons/plus.svg';
import searchIcon from '@/assets/icons/search.svg';

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
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AdminBrandList() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchBrands(); }, []);

  async function fetchBrands() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/brands');
      setBrands(data.brands || data.data || []);
    } catch {
      setError('Could not load brands.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = brands.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", color: '#212529', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 }}>Brands</h1>
          <button onClick={() => navigate('/admin/catalogue/brands/new')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', minHeight: '44px' }}>
            <img src={plusIcon} alt="" style={{ width: '16px', height: '16px' }} /> New Brand
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '16px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', maxWidth: '360px' }}>
            <img src={searchIcon} alt="" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', opacity: 0.5 }} />
            <input type="search" placeholder="Search brands…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#495057' }}>Loading brands…</div>
          ) : error ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#f03e3e' }}>
              {error}
              <button onClick={fetchBrands} style={{ marginLeft: '12px', color: '#4c6ef5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#495057' }}>No brands found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e9ecef', background: '#f8f9fa' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Slug</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Website</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#495057' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{b.name}</td>
                    <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", fontSize: '13px', color: '#495057' }}>{b.slug || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      {b.website ? (
                        <a href={b.website} target="_blank" rel="noopener noreferrer" style={{ color: '#4c6ef5', textDecoration: 'none' }}>{b.website}</a>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Link to={`/admin/catalogue/brands/${b.id}/edit`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #868e96', background: '#fff' }} title="Edit">
                        <img src={editIcon} alt="Edit" style={{ width: '14px', height: '14px' }} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

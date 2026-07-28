import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';
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

export default function AdminProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('q', search);
      const data = await apiFetch(`/products?${params}`);
      setProducts(data.products || data.data || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch {
      setError('Could not load products.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product? This action cannot be undone.')) return;
    setDeleteId(id);
    setDeleteError(null);
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      setDeleteError('Could not delete product.');
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", color: '#212529', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 }}>Products</h1>
          <button
            onClick={() => navigate('/admin/catalogue/products/new')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', minHeight: '44px' }}
          >
            <img src={plusIcon} alt="" style={{ width: '16px', height: '16px' }} />
            New Product
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '16px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', maxWidth: '360px' }}>
            <img src={searchIcon} alt="" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', opacity: 0.5 }} />
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {deleteError && (
          <div style={{ background: '#ffe3e3', color: '#f03e3e', border: '1px solid #f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' }}>
            {deleteError}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#495057' }}>Loading products…</div>
          ) : error ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#f03e3e' }}>
              {error}
              <button onClick={fetchProducts} style={{ marginLeft: '12px', color: '#4c6ef5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#495057' }}>No products found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e9ecef', background: '#f8f9fa' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Slug</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Brand</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#495057' }}>Base Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#495057' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", fontSize: '13px', color: '#495057' }}>{p.slug}</td>
                    <td style={{ padding: '12px 16px', color: '#495057' }}>{p.brand_name || p.brand?.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#495057' }}>{p.category_name || p.category?.name || '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500 }}>{p.base_price !== undefined ? `₹${Number(p.base_price).toFixed(2)}` : '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Link
                          to={`/admin/catalogue/products/${p.id}/edit`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #868e96', background: '#fff' }}
                          title="Edit"
                        >
                          <img src={editIcon} alt="Edit" style={{ width: '14px', height: '14px' }} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleteId === p.id}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #f03e3e', background: '#fff', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <img src={trashIcon} alt="Delete" style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #868e96', background: '#fff', cursor: 'pointer', fontSize: '14px', minHeight: '44px' }}>Previous</button>
            <span style={{ fontSize: '14px', color: '#495057' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #868e96', background: '#fff', cursor: 'pointer', fontSize: '14px', minHeight: '44px' }}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

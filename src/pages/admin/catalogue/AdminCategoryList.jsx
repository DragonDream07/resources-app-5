import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';

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

function buildTree(categories) {
  const map = {};
  categories.forEach(c => { map[c.id] = { ...c, children: [] }; });
  const roots = [];
  categories.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
}

function CategoryRow({ cat, depth, onDelete, deleting }) {
  const indent = depth * 20;
  return (
    <>
      <tr style={{ borderBottom: '1px solid #e9ecef' }}>
        <td style={{ padding: '10px 16px', paddingLeft: `${16 + indent}px` }}>
          <span style={{ fontSize: '14px', fontWeight: depth === 0 ? 600 : 400 }}>{cat.name}</span>
        </td>
        <td style={{ padding: '10px 16px', fontSize: '13px', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", color: '#495057' }}>{cat.slug}</td>
        <td style={{ padding: '10px 16px', fontSize: '13px', color: '#495057' }}>{cat.parent_id ? 'Yes' : '—'}</td>
        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Link to={`/admin/catalogue/categories/${cat.id}/edit`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #868e96', background: '#fff' }} title="Edit">
              <img src={editIcon} alt="Edit" style={{ width: '14px', height: '14px' }} />
            </Link>
            <button onClick={() => onDelete(cat.id)} disabled={deleting === cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #f03e3e', background: '#fff', cursor: 'pointer' }} title="Delete">
              <img src={trashIcon} alt="Delete" style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </td>
      </tr>
      {cat.children && cat.children.map(child => (
        <CategoryRow key={child.id} cat={child} depth={depth + 1} onDelete={onDelete} deleting={deleting} />
      ))}
    </>
  );
}

export default function AdminCategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/categories');
      const list = data.categories || data.data || [];
      setCategories(list);
      setTree(buildTree(list));
    } catch {
      setError('Could not load categories.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this category? This action cannot be undone.')) return;
    setDeleting(id);
    setDeleteError(null);
    try {
      await apiFetch(`/categories/${id}`, { method: 'DELETE' });
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      setTree(buildTree(updated));
    } catch {
      setDeleteError('Could not delete category.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", color: '#212529', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 }}>Categories</h1>
          <button onClick={() => navigate('/admin/catalogue/categories/new')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', minHeight: '44px' }}>
            <img src={plusIcon} alt="" style={{ width: '16px', height: '16px' }} /> New Category
          </button>
        </div>

        {deleteError && (
          <div style={{ background: '#ffe3e3', color: '#f03e3e', border: '1px solid #f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' }}>{deleteError}</div>
        )}

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#495057' }}>Loading categories…</div>
          ) : error ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#f03e3e' }}>
              {error}
              <button onClick={fetchCategories} style={{ marginLeft: '12px', color: '#4c6ef5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
            </div>
          ) : tree.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#495057' }}>No categories yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e9ecef', background: '#f8f9fa' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Slug</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057' }}>Has Parent</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#495057' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tree.map(cat => (
                  <CategoryRow key={cat.id} cat={cat} depth={0} onDelete={handleDelete} deleting={deleting} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = '/api';

const ROLES = ['all', 'admin', 'customer'];

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '32px 24px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: 0,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#212529',
    cursor: 'pointer',
    outline: 'none',
    minHeight: '44px',
  },
  searchInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#212529',
    outline: 'none',
    minHeight: '44px',
    minWidth: '240px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#e8ecfd',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #868e96',
  },
  tr: {
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.15s',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#343a40',
    verticalAlign: 'middle',
  },
  userLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
  },
  badge: (role) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    backgroundColor: role === 'admin' ? '#e8ecfd' : '#d3f9d8',
    color: role === 'admin' ? '#3b5bdb' : '#2f9e44',
  }),
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px',
    borderTop: '1px solid #e9ecef',
  },
  pageBtn: (active) => ({
    minWidth: '44px',
    minHeight: '44px',
    padding: '0 12px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: active ? '#4c6ef5' : '#ffffff',
    color: active ? '#ffffff' : '#212529',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '16px',
  },
  error: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '16px',
  },
};

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', '20');
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
      const data = await res.json();
      setUsers(data.users || data.data || []);
      setTotalPages(data.totalPages || data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRowHover = (e, enter) => {
    e.currentTarget.style.backgroundColor = enter ? '#f8f9fa' : 'transparent';
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Users</h1>
        </div>

        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Filter by role:</span>
          <select
            style={styles.filterSelect}
            value={roleFilter}
            onChange={handleRoleChange}
            aria-label="Filter users by role"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>

          <input
            style={styles.searchInput}
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search users"
          />
        </div>

        {error && <div style={styles.error} role="alert">{error}</div>}

        <div style={styles.card}>
          {loading ? (
            <div style={styles.loading}>Loading users…</div>
          ) : users.length === 0 ? (
            <div style={styles.emptyState}>No users found.</div>
          ) : (
            <table style={styles.table} aria-label="Users table">
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role(s)</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    style={styles.tr}
                    onMouseEnter={(e) => handleRowHover(e, true)}
                    onMouseLeave={(e) => handleRowHover(e, false)}
                  >
                    <td style={styles.td}>
                      {user.firstName || user.first_name
                        ? `${user.firstName || user.first_name} ${user.lastName || user.last_name || ''}`
                        : user.name || '—'}
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      {(user.roles || []).length > 0
                        ? (user.roles || []).map((r) => (
                            <span key={r} style={{ ...styles.badge(r), marginRight: '4px' }}>
                              {r}
                            </span>
                          ))
                        : <span style={styles.badge('customer')}>customer</span>}
                    </td>
                    <td style={styles.td}>
                      {user.createdAt || user.created_at
                        ? new Date(user.createdAt || user.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td style={styles.td}>
                      <Link
                        to={`/admin/users/${user.id}`}
                        style={styles.userLink}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn(false)}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  style={styles.pageBtn(p === page)}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}
              <button
                style={styles.pageBtn(false)}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

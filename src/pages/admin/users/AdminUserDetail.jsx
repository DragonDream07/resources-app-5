import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = '/api';

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
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: '0 0 24px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.1)',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginTop: 0,
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: '14px',
    color: '#343a40',
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
    marginRight: '6px',
  }),
  sectionSubtitle: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '12px',
  },
  roleCheckboxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  roleCheckboxItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    minHeight: '44px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#4c6ef5',
  },
  roleLabel: {
    fontSize: '14px',
    color: '#343a40',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  saveBtn: {
    padding: '10px 24px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  saveBtnDisabled: {
    backgroundColor: '#adb5bd',
    cursor: 'not-allowed',
  },
  successMsg: {
    backgroundColor: '#d3f9d8',
    color: '#2f9e44',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    marginTop: '12px',
  },
  errorMsg: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '16px',
  },
  monoId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#343a40',
  },
};

const ALL_ROLES = ['admin', 'customer'];

export default function AdminUserDetail() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [availableRoles, setAvailableRoles] = useState(ALL_ROLES);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to load user (${res.status})`);
      const data = await res.json();
      const u = data.user || data;
      setUser(u);
      setSelectedRoles(u.roles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const roleNames = (data.roles || data || []).map((r) =>
          typeof r === 'string' ? r : r.name
        );
        if (roleNames.length > 0) setAvailableRoles(roleNames);
      }
    } catch {
      // fall back to default roles
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [fetchUser, fetchRoles]);

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSaveRoles = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}/roles`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: selectedRoles }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to update roles (${res.status})`);
      }
      setSaveSuccess(true);
      await fetchUser();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading user…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <Link to="/admin/users" style={styles.backLink}>← Back to Users</Link>
          <div style={styles.errorMsg} role="alert">{error}</div>
        </div>
      </div>
    );
  }

  const fullName = user
    ? `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() || user.name || 'Unknown'
    : 'Unknown';

  const userRoles = user?.roles || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin/users" style={styles.backLink}>← Back to Users</Link>

        <h1 style={styles.title}>{fullName}</h1>

        <div style={styles.grid}>
          {/* User Info Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>User Details</h2>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>User ID</span>
              <span style={styles.monoId}>{user?.id}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Full Name</span>
              <span style={styles.fieldValue}>{fullName}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Email</span>
              <span style={styles.fieldValue}>{user?.email}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Phone</span>
              <span style={styles.fieldValue}>
                {user?.phone || user?.phoneNumber || user?.phone_number || '—'}
              </span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Joined</span>
              <span style={styles.fieldValue}>
                {user?.createdAt || user?.created_at
                  ? new Date(user.createdAt || user.created_at).toLocaleString()
                  : '—'}
              </span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Current Roles</span>
              <div style={{ marginTop: '4px' }}>
                {userRoles.length > 0
                  ? userRoles.map((r) => (
                      <span key={r} style={styles.badge(r)}>{r}</span>
                    ))
                  : <span style={{ fontSize: '14px', color: '#495057' }}>No roles assigned</span>}
              </div>
            </div>
          </div>

          {/* Role Assignment Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Role Assignment</h2>
            <p style={styles.sectionSubtitle}>
              Select the roles to assign to this user. Changes take effect immediately on save.
            </p>

            {saveError && (
              <div style={styles.errorMsg} role="alert">{saveError}</div>
            )}

            <div style={styles.roleCheckboxList}>
              {availableRoles.map((role) => (
                <label key={role} style={styles.roleCheckboxItem}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    aria-label={`Assign role ${role}`}
                  />
                  <span style={styles.roleLabel}>{role}</span>
                </label>
              ))}
            </div>

            <button
              style={{
                ...styles.saveBtn,
                ...(saving ? styles.saveBtnDisabled : {}),
              }}
              onClick={handleSaveRoles}
              disabled={saving}
              aria-busy={saving}\n            >
              {saving ? 'Saving…' : 'Save Roles'}
            </button>

            {saveSuccess && (
              <div style={styles.successMsg} role="status">
                Roles updated successfully.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

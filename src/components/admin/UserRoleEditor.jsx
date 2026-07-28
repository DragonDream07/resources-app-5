import React, { useState, useEffect } from 'react';

const UserRoleEditor = ({
  userId,
  currentRoles,
  availableRoles,
  onUpdate,
  loading,
  error,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (currentRoles && currentRoles.length > 0) {
      setSelectedRoleId(String(currentRoles[0].id));
    } else {
      setSelectedRoleId('');
    }
  }, [currentRoles]);

  const handleSave = async () => {
    if (!selectedRoleId) return;
    setSubmitting(true);
    setLocalError(null);
    try {
      await onUpdate(userId, selectedRoleId);
    } catch (err) {
      setLocalError(err.message || 'Failed to update role.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = error || localError;

  return (
    <div className="user-role-editor">
      <label htmlFor={`role-select-${userId}`} className="user-role-editor__label">
        Assign Role
      </label>

      {displayError && (
        <div className="user-role-editor__error">{displayError}</div>
      )}

      <div className="user-role-editor__controls">
        <select
          id={`role-select-${userId}`}
          className="user-role-editor__select"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
          disabled={submitting || loading}
        >
          <option value="">Select a role</option>
          {(availableRoles || []).map((role) => (
            <option key={role.id} value={String(role.id)}>
              {role.name}
            </option>
          ))}
        </select>
        <button
          className="user-role-editor__save-btn"
          onClick={handleSave}
          disabled={!selectedRoleId || submitting || loading}
        >
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default UserRoleEditor;

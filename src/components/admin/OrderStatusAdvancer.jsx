import React, { useState } from 'react';

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const OrderStatusAdvancer = ({ orderId, currentStatus, userRole, onAdvance }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allowedRoles = ['admin', 'superadmin'];
  const isAllowed = allowedRoles.includes(userRole);

  if (!isAllowed) {
    return null;
  }

  const nextStatuses = STATUS_TRANSITIONS[currentStatus] || [];

  if (nextStatuses.length === 0) {
    return (
      <div className="order-status-advancer">
        <span className="order-status-advancer__terminal">No further status transitions available.</span>
      </div>
    );
  }

  const handleAdvance = async () => {
    if (!selectedStatus) return;
    setLoading(true);
    setError(null);
    try {
      await onAdvance(orderId, selectedStatus);
      setSelectedStatus('');
    } catch (err) {
      setError(err.message || 'Failed to advance order status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-status-advancer">
      <label htmlFor={`status-select-${orderId}`} className="order-status-advancer__label">
        Advance Status
      </label>
      <div className="order-status-advancer__controls">
        <select
          id={`status-select-${orderId}`}
          className="order-status-advancer__select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={loading}
        >
          <option value="">Select next status</option>
          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <button
          className="order-status-advancer__btn"
          onClick={handleAdvance}
          disabled={!selectedStatus || loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
      {error && <div className="order-status-advancer__error">{error}</div>}
    </div>
  );
};

export default OrderStatusAdvancer;

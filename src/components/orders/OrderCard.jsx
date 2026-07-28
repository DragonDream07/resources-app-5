import React from 'react';
import PropTypes from 'prop-types';

const STATUS_BADGE_STYLES = {
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

function StatusBadge({ status }) {
  const style = STATUS_BADGE_STYLES[status] || 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

function OrderCard({ order, onClick }) {
  const { orderId, createdAt, status, totalAmount, itemCount } = order;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
    : '—';

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(orderId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(orderId)}
      aria-label={`Order ${orderId}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-900 font-mono">
          #{orderId}
        </span>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{formattedDate}</span>
        <span>
          {typeof itemCount === 'number'
            ? `${itemCount} item${itemCount !== 1 ? 's' : ''}`
            : null}
        </span>
      </div>

      {typeof totalAmount === 'number' && (
        <div className="mt-3 text-right">
          <span className="text-base font-bold text-gray-800">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    createdAt: PropTypes.string,
    status: PropTypes.string.isRequired,
    totalAmount: PropTypes.number,
    itemCount: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
};

OrderCard.defaultProps = {
  onClick: null,
};

export default OrderCard;

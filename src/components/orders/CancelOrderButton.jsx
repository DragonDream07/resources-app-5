import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CancelOrderButton({ orderId, onCancel, isEligible, loading }) {
  const [showDialog, setShowDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');

  if (!isEligible) {
    return null;
  }

  function handleOpenDialog() {
    setShowDialog(true);
  }

  function handleCloseDialog() {
    if (cancelling) return;
    setShowDialog(false);
    setReason('');
  }

  async function handleConfirmCancel() {
    setCancelling(true);
    try {
      await onCancel(orderId, reason.trim() || undefined);
      setShowDialog(false);
      setReason('');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-red-500 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Cancel Order
      </button>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2
              id="cancel-dialog-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Cancel Order
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <div className="mb-4">
              <label
                htmlFor="cancel-reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason (optional)
              </label>
              <textarea
                id="cancel-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Let us know why you're cancelling..."
                disabled={cancelling}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none disabled:bg-gray-50"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDialog}
                disabled={cancelling}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-70 flex items-center gap-2"
              >
                {cancelling && (
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {cancelling ? 'Cancelling…' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

CancelOrderButton.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCancel: PropTypes.func.isRequired,
  isEligible: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
};

CancelOrderButton.defaultProps = {
  loading: false,
};

export default CancelOrderButton;

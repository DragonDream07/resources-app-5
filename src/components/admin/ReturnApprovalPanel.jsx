import React, { useState } from 'react';

const ReturnApprovalPanel = ({
  returnRequestId,
  currentStatus,
  onReview,
  loading,
  error,
}) => {
  const [refundNote, setRefundNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const isPending = currentStatus === 'pending' || currentStatus === 'requested';

  if (!isPending) {
    return (
      <div className="return-approval-panel">
        <p className="return-approval-panel__resolved">
          This return request has already been <strong>{currentStatus}</strong>.
        </p>
      </div>
    );
  }

  const handleAction = async (decision) => {
    setSubmitting(true);
    setLocalError(null);
    try {
      await onReview(returnRequestId, { decision, refund_note: refundNote });
    } catch (err) {
      setLocalError(err.message || 'Failed to process return request.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = error || localError;

  return (
    <div className="return-approval-panel">
      <h3 className="return-approval-panel__title">Review Return Request</h3>

      {displayError && (
        <div className="return-approval-panel__error">{displayError}</div>
      )}

      <div className="return-approval-panel__field">
        <label htmlFor={`refund-note-${returnRequestId}`}>
          Refund Note
        </label>
        <textarea
          id={`refund-note-${returnRequestId}`}
          className="return-approval-panel__textarea"
          value={refundNote}
          onChange={(e) => setRefundNote(e.target.value)}
          rows={3}
          placeholder="Optional note about the refund decision"
          disabled={submitting || loading}
        />
      </div>

      <div className="return-approval-panel__actions">
        <button
          className="return-approval-panel__btn return-approval-panel__btn--approve"
          onClick={() => handleAction('approved')}
          disabled={submitting || loading}
        >
          {submitting ? 'Processing...' : 'Approve'}
        </button>
        <button
          className="return-approval-panel__btn return-approval-panel__btn--reject"
          onClick={() => handleAction('rejected')}
          disabled={submitting || loading}
        >
          {submitting ? 'Processing...' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

export default ReturnApprovalPanel;

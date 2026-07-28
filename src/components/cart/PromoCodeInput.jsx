import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';

function PromoCodeInput({ onApply, appliedPromo, loading }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter a promo code.');
      return;
    }
    setError('');
    try {
      await onApply(trimmed);
    } catch (err) {
      setError(err?.message || 'Invalid promo code. Please try again.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (error) setError('');
  };

  return (
    <div className="promo-code-input">
      <p className="promo-code-input__label">Promo Code</p>

      {appliedPromo ? (
        <div className="promo-code-input__applied">
          <img src={checkIcon} alt="Applied" width={16} height={16} />
          <span className="promo-code-input__applied-code">{appliedPromo.code}</span>
          <span className="promo-code-input__applied-discount">
            −₹{Number(appliedPromo.discountAmount || 0).toFixed(2)} applied
          </span>
        </div>
      ) : (
        <>
          <div className="promo-code-input__row">
            <input
              className={`promo-code-input__field${error ? ' promo-code-input__field--error' : ''}`}
              type="text"
              value={code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter promo code"
              aria-label="Promo code"
              disabled={loading}
              maxLength={32}
            />
            <button
              className="promo-code-input__apply-btn"
              onClick={handleApply}
              disabled={loading || !code.trim()}
              aria-label="Apply promo code"
            >
              {loading ? 'Applying…' : 'Apply'}
            </button>
          </div>
          {error && (
            <p className="promo-code-input__error" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default PromoCodeInput;

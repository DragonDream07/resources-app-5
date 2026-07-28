/**
 * Formats a numeric amount as Indian Rupee (₹) with locale-aware decimals.
 * @param {number} amount - The numeric amount to format.
 * @param {object} [options] - Optional Intl.NumberFormat options overrides.
 * @returns {string} Formatted currency string, e.g. "₹1,299.00"
 */
export function formatCurrency(amount, options = {}) {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return '₹0.00';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(numericAmount);
}

/**
 * Formats a numeric amount as Indian Rupee without decimals when the value is whole.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrencyCompact(amount) {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return '₹0';
  }
  const fractionDigits = numericAmount % 1 === 0 ? 0 : 2;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numericAmount);
}

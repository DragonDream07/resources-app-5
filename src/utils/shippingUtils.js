/**
 * Free shipping threshold in INR.
 */
export const FREE_SHIPPING_THRESHOLD = 799;

/**
 * Standard shipping charge in INR when order total is below the free threshold.
 */
export const STANDARD_SHIPPING_CHARGE = 49;

/**
 * Computes the shipping charge based on the order total.
 * Returns ₹0 if the order total is ≥ ₹799, otherwise returns ₹49.
 * @param {number} orderTotal - The cart/order subtotal in INR.
 * @returns {number} Shipping charge (0 or 49).
 */
export function computeShippingCharge(orderTotal) {
  const total = Number(orderTotal);
  if (isNaN(total) || total >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return STANDARD_SHIPPING_CHARGE;
}

/**
 * Returns true if the given order total qualifies for free shipping.
 * @param {number} orderTotal
 * @returns {boolean}
 */
export function isFreeShipping(orderTotal) {
  return computeShippingCharge(orderTotal) === 0;
}

/**
 * Returns the amount still needed to reach free shipping.
 * Returns 0 if already eligible.
 * @param {number} orderTotal
 * @returns {number}
 */
export function amountToFreeShipping(orderTotal) {
  const total = Number(orderTotal);
  if (isNaN(total) || total >= FREE_SHIPPING_THRESHOLD) return 0;
  return Math.round((FREE_SHIPPING_THRESHOLD - total) * 100) / 100;
}

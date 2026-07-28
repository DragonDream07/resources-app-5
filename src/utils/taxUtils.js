/**
 * Default GST rate used across the application (18%).
 */
export const DEFAULT_GST_RATE = 0.18;

/**
 * Returns the GST-inclusive display price from a base (exclusive) price.
 * @param {number} basePrice - Price excluding GST.
 * @param {number} [gstRate] - GST rate as a decimal, e.g. 0.18 for 18%.
 * @returns {number} Price including GST, rounded to 2 decimal places.
 */
export function getInclusivePrice(basePrice, gstRate = DEFAULT_GST_RATE) {
  const price = Number(basePrice);
  if (isNaN(price) || price < 0) return 0;
  return Math.round(price * (1 + gstRate) * 100) / 100;
}

/**
 * Extracts the GST (tax) portion from a GST-inclusive price.
 * @param {number} inclusivePrice - Price already including GST.
 * @param {number} [gstRate] - GST rate as a decimal, e.g. 0.18 for 18%.
 * @returns {number} The tax amount, rounded to 2 decimal places.
 */
export function extractTaxFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const price = Number(inclusivePrice);
  if (isNaN(price) || price < 0) return 0;
  const tax = price - price / (1 + gstRate);
  return Math.round(tax * 100) / 100;
}

/**
 * Extracts the base (pre-tax) amount from a GST-inclusive price.
 * @param {number} inclusivePrice - Price already including GST.
 * @param {number} [gstRate] - GST rate as a decimal, e.g. 0.18 for 18%.
 * @returns {number} The base amount before tax, rounded to 2 decimal places.
 */
export function extractBaseFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const price = Number(inclusivePrice);
  if (isNaN(price) || price < 0) return 0;
  const base = price / (1 + gstRate);
  return Math.round(base * 100) / 100;
}

/**
 * Builds a tax breakdown object for display in order/cart summaries.
 * @param {number} inclusivePrice - Total price including GST.
 * @param {number} [gstRate] - GST rate as a decimal.
 * @returns {{ base: number, tax: number, total: number, gstRatePercent: number }}
 */
export function getTaxBreakdown(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const price = Number(inclusivePrice);
  const base = extractBaseFromInclusive(price, gstRate);
  const tax = extractTaxFromInclusive(price, gstRate);
  return {
    base,
    tax,
    total: price,
    gstRatePercent: Math.round(gstRate * 100),
  };
}

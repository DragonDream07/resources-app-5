/**
 * Formats an ISO 8601 date string or Date object to a human-readable display string.
 * Default format: "12 Jan 2024"
 * @param {string|Date} isoDate - ISO date string or Date object.
 * @param {object} [options] - Optional Intl.DateTimeFormat options overrides.
 * @returns {string} Formatted date string.
 */
export function formatDate(isoDate, options = {}) {
  if (!isoDate) return '';
  const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date);
}

/**
 * Formats an ISO date string to a date-time display string.
 * Default format: "12 Jan 2024, 3:45 PM"
 * @param {string|Date} isoDate
 * @param {object} [options]
 * @returns {string}
 */
export function formatDateTime(isoDate, options = {}) {
  if (!isoDate) return '';
  const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options,
  }).format(date);
}

/**
 * Returns a relative time string such as "2 days ago" or "in 3 hours".
 * @param {string|Date} isoDate
 * @returns {string}
 */
export function formatRelativeTime(isoDate) {
  if (!isoDate) return '';
  const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' });
  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];
  for (const { unit, seconds } of units) {
    if (Math.abs(diffSec) >= seconds || unit === 'second') {
      return rtf.format(Math.round(diffSec / seconds), unit);
    }
  }
  return '';
}

/**
 * Default fallback message when no specific message can be extracted.
 */
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Maps HTTP status codes to user-friendly messages.
 */
const HTTP_STATUS_MESSAGES = {
  400: 'The request was invalid. Please check your input.',
  401: 'You are not logged in. Please log in and try again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. The resource may already exist.',
  422: 'The submitted data is invalid. Please review and try again.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'An internal server error occurred. Please try again later.',
  502: 'The server is temporarily unavailable. Please try again later.',
  503: 'The service is currently unavailable. Please try again later.',
};

/**
 * Parses an API error response into a user-facing message string.
 * Handles Axios errors, fetch Response objects, plain Error instances,
 * and raw API error payload objects.
 *
 * Priority order:
 * 1. response.data.message (Axios-style)
 * 2. response.data.error
 * 3. response.data.errors array (joined)
 * 4. HTTP status code message
 * 5. error.message
 * 6. DEFAULT_ERROR_MESSAGE
 *
 * @param {unknown} error - The error value caught in a try/catch or .catch().
 * @returns {string} A user-facing error message.
 */
export function parseApiError(error) {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  // Axios error shape: error.response.data
  if (error.response) {
    const { data, status } = error.response;
    if (data) {
      if (typeof data.message === 'string' && data.message.trim()) {
        return data.message.trim();
      }
      if (typeof data.error === 'string' && data.error.trim()) {
        return data.error.trim();
      }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const messages = data.errors
          .map((e) => (typeof e === 'string' ? e : e?.message ?? ''))
          .filter(Boolean);
        if (messages.length > 0) return messages.join(' ');
      }
    }
    if (status && HTTP_STATUS_MESSAGES[status]) {
      return HTTP_STATUS_MESSAGES[status];
    }
  }

  // Fetch Response object
  if (error instanceof Response || (error.status && error.statusText !== undefined)) {
    const status = error.status;
    if (status && HTTP_STATUS_MESSAGES[status]) {
      return HTTP_STATUS_MESSAGES[status];
    }
  }

  // Plain Error with a message
  if (error instanceof Error && error.message) {
    return error.message;
  }

  // Raw object with message/error field
  if (typeof error === 'object') {
    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message.trim();
    }
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error.trim();
    }
  }

  // String error
  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Parses field-level validation errors from an API response into a map
 * of field name → error message, suitable for use with form libraries.
 *
 * @param {unknown} error - The error value caught in a try/catch.
 * @returns {Record<string, string>} Map of field names to error messages.
 */
export function parseFieldErrors(error) {
  const fieldErrors = {};

  if (!error) return fieldErrors;

  const data = error?.response?.data;
  if (!data) return fieldErrors;

  // Format: { errors: [{ field: 'email', message: '...' }] }
  if (Array.isArray(data.errors)) {
    for (const err of data.errors) {
      if (err && typeof err.field === 'string' && typeof err.message === 'string') {
        fieldErrors[err.field] = err.message;
      }
    }
  }

  // Format: { fieldErrors: { email: 'Already in use.' } }
  if (data.fieldErrors && typeof data.fieldErrors === 'object') {
    for (const [field, message] of Object.entries(data.fieldErrors)) {
      if (typeof message === 'string') {
        fieldErrors[field] = message;
      }
    }
  }

  return fieldErrors;
}

/**
 * Returns true if the error represents an unauthenticated (401) response.
 * @param {unknown} error
 * @returns {boolean}
 */
export function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}

/**
 * Returns true if the error represents a forbidden (403) response.
 * @param {unknown} error
 * @returns {boolean}
 */
export function isForbiddenError(error) {
  return error?.response?.status === 403;
}

/**
 * Returns true if the error represents a not-found (404) response.
 * @param {unknown} error
 * @returns {boolean}
 */
export function isNotFoundError(error) {
  return error?.response?.status === 404;
}

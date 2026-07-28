// Environment configuration — reads import.meta.env and exports typed constants.

const _get = (key, fallback = '') => {
  const value =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env[key]
      : undefined;
  if (value === undefined || value === '') return fallback;
  return value;
};

/** Base URL for the backend REST API, e.g. http://localhost:4000/api */
export const API_BASE_URL = _get('VITE_API_BASE_URL', 'http://localhost:4000/api');

/** Current deployment environment: development | staging | production */
export const APP_ENV = _get('VITE_APP_ENV', 'development');

/** Public application name shown in titles */
export const APP_NAME = _get('VITE_APP_NAME', 'Storefront');

/** Elasticsearch base URL (frontend-facing proxy, optional) */
export const ELASTICSEARCH_URL = _get('VITE_ELASTICSEARCH_URL', '');

/** Feature flag — enable guest checkout flow */
export const FEATURE_GUEST_CHECKOUT =
  _get('VITE_FEATURE_GUEST_CHECKOUT', 'true') === 'true';

/** Timeout in milliseconds for API requests */
export const API_TIMEOUT = Number(_get('VITE_API_TIMEOUT', '15000'));

/** Whether the app is running in production mode */
export const IS_PRODUCTION = APP_ENV === 'production';

/** Whether the app is running in development mode */
export const IS_DEVELOPMENT = APP_ENV === 'development';

export default {
  API_BASE_URL,
  APP_ENV,
  APP_NAME,
  ELASTICSEARCH_URL,
  FEATURE_GUEST_CHECKOUT,
  API_TIMEOUT,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
};

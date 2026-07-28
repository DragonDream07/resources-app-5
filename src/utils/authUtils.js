/**
 * Decodes the payload of a JWT token without verifying the signature.
 * For client-side use only — do NOT use for security-critical decisions on the server.
 * @param {string} token - JWT string (three base64url parts separated by ".").
 * @returns {object|null} Decoded payload object, or null if decoding fails.
 */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT token is expired based on its `exp` claim.
 * Returns true if the token is expired or unparseable.
 * @param {string} token - JWT string.
 * @param {number} [clockSkewSeconds=0] - Optional clock skew tolerance in seconds.
 * @returns {boolean} True if expired or invalid.
 */
export function isTokenExpired(token, clockSkewSeconds = 0) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowSeconds - clockSkewSeconds;
}

/**
 * Extracts specific claims from a JWT payload.
 * @param {string} token - JWT string.
 * @returns {{ userId: string|null, email: string|null, roles: string[], exp: number|null }}
 */
export function getTokenClaims(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return { userId: null, email: null, roles: [], exp: null };
  }
  return {
    userId: payload.sub ?? payload.userId ?? null,
    email: payload.email ?? null,
    roles: Array.isArray(payload.roles) ? payload.roles : [],
    exp: typeof payload.exp === 'number' ? payload.exp : null,
  };
}

/**
 * Returns the number of seconds remaining until the token expires.
 * Returns 0 if already expired or invalid.
 * @param {string} token
 * @returns {number}
 */
export function tokenTtlSeconds(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return 0;
  const remaining = payload.exp - Math.floor(Date.now() / 1000);
  return Math.max(0, remaining);
}

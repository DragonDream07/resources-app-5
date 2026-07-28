import crypto from 'crypto';

const TOKEN_BYTE_LENGTH = 32;

/**
 * Generate a cryptographically secure reset token.
 *
 * Returns both the raw (plain) token that is sent to the user and
 * a SHA-256 hash of it that is stored in the database.
 *
 * @returns {{ plainToken: string, hashedToken: string }}
 */
export function generateResetToken() {
  const plainToken = crypto.randomBytes(TOKEN_BYTE_LENGTH).toString('hex');
  const hashedToken = hashToken(plainToken);
  return { plainToken, hashedToken };
}

/**
 * Hash a plain reset token using SHA-256.
 *
 * @param {string} plainToken - The raw token string (hex)
 * @returns {string} SHA-256 hex digest
 */
export function hashToken(plainToken) {
  return crypto.createHash('sha256').update(plainToken).digest('hex');
}

/**
 * Verify that a plain token matches a stored hash.
 *
 * @param {string} plainToken  - The raw token provided by the user
 * @param {string} hashedToken - The SHA-256 hash stored in the database
 * @returns {boolean}
 */
export function verifyResetToken(plainToken, hashedToken) {
  const candidateHash = hashToken(plainToken);
  return crypto.timingSafeEqual(
    Buffer.from(candidateHash, 'hex'),
    Buffer.from(hashedToken, 'hex')
  );
}

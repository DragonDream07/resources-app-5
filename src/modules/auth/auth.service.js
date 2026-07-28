import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000; // 1 hour

// In-memory stores — replace with DB repositories in production
const usersStore = new Map();
const resetTokensStore = new Map(); // token -> { userId, expiresAt }
const invalidatedTokensStore = new Set();

function generateJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function createApiError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export async function registerUser({ name, email, password, phone }) {
  if (usersStore.has(email)) {
    throw createApiError(409, 'A user with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = crypto.randomUUID();

  const user = {
    id: userId,
    name,
    email,
    phone: phone || null,
    passwordHash,
    isGuest: false,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(email, user);

  const token = generateJwt({ sub: userId, email, isGuest: false });

  return {
    token,
    user: { id: userId, name, email, phone: user.phone, isGuest: false },
  };
}

export async function loginUser({ email, password }) {
  const user = usersStore.get(email);

  if (!user || user.isGuest) {
    throw createApiError(401, 'Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw createApiError(401, 'Invalid email or password.');
  }

  const token = generateJwt({ sub: user.id, email: user.email, isGuest: false });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, isGuest: false },
  };
}

export async function logoutUser(token) {
  if (token) {
    invalidatedTokensStore.add(token);
  }
  return { message: 'Logged out successfully.' };
}

export async function forgotPasswordUser({ email }) {
  const user = usersStore.get(email);

  // Always return success to avoid email enumeration
  if (!user || user.isGuest) {
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + RESET_TOKEN_EXPIRES_MS;

  resetTokensStore.set(resetToken, { userId: user.id, email: user.email, expiresAt });

  // In production: send email with reset link containing resetToken
  // For now, log to console in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.info(`[auth] Password reset token for ${email}: ${resetToken}`);
  }

  return { message: 'If that email is registered, a reset link has been sent.' };
}

export async function resetPasswordUser({ token, password }) {
  const record = resetTokensStore.get(token);

  if (!record) {
    throw createApiError(400, 'Invalid or expired password reset token.');
  }

  if (Date.now() > record.expiresAt) {
    resetTokensStore.delete(token);
    throw createApiError(400, 'Invalid or expired password reset token.');
  }

  const user = usersStore.get(record.email);
  if (!user) {
    throw createApiError(400, 'Invalid or expired password reset token.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  usersStore.set(record.email, { ...user, passwordHash });
  resetTokensStore.delete(token);

  return { message: 'Password has been reset successfully.' };
}

export async function guestRegisterUser({ name, email, phone } = {}) {
  const userId = crypto.randomUUID();
  const guestEmail = email || `guest_${userId}@guest.local`;

  const user = {
    id: userId,
    name: name || 'Guest',
    email: guestEmail,
    phone: phone || null,
    passwordHash: null,
    isGuest: true,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(guestEmail, user);

  const token = generateJwt({ sub: userId, email: guestEmail, isGuest: true });

  return {
    token,
    user: { id: userId, name: user.name, email: guestEmail, phone: user.phone, isGuest: true },
  };
}

export function isTokenInvalidated(token) {
  return invalidatedTokensStore.has(token);
}

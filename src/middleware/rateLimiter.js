import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for general authentication routes (login, register, etc.).
 * Allows up to 20 requests per 15-minute window per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for password-reset routes.
 * Allows up to 5 requests per 60-minute window per IP.
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many password reset attempts from this IP, please try again after 60 minutes.',
  },
  skipSuccessfulRequests: false,
});

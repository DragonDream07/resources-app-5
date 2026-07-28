import config from './index.js';

const rateLimitConfig = {
  RATE_LIMIT_WINDOW_MS: config.rateLimit.windowMs,
  RATE_LIMIT_MAX: config.rateLimit.max,
};

export default rateLimitConfig;

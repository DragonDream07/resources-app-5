import config from './index.js';

const jwtConfig = {
  JWT_SECRET: config.jwt.secret,
  ACCESS_TOKEN_TTL: config.jwt.accessTokenTTL,
  RESET_TOKEN_TTL: config.jwt.resetTokenTTL,
};

export default jwtConfig;

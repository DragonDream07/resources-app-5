import { logger } from './requestLogger.js';

/**
 * Centralised Express error handler.
 * Must be registered as the last middleware (after all routes).
 * Emits structured JSON error responses.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  if (statusCode >= 500) {
    logger.error({
      message: err.message,
      code,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
    });
  } else {
    logger.warn({
      message: err.message,
      code,
      method: req.method,
      url: req.originalUrl,
    });
  }

  const body = {
    status: 'error',
    code,
    message: statusCode < 500 ? err.message : 'An unexpected error occurred. Please try again later.',
  };

  if (err.details !== undefined) {
    body.details = err.details;
  }

  return res.status(statusCode).json(body);
}

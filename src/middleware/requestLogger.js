import morgan from 'morgan';
import winston from 'winston';

/**
 * Winston logger instance.
 * Logs to the console in development and to files in production.
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(
            ({ timestamp, level, message, ...meta }) =>
              `${timestamp} [${level}]: ${message}${
                Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
              }`
          )
        )
  ),
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ]
      : []),
  ],
});

/**
 * Morgan HTTP request logger middleware.
 * Uses a custom token stream that writes to the Winston logger.
 */
const morganStream = {
  write(message) {
    logger.http(message.trim());
  },
};

const morganFormat =
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const requestLogger = morgan(morganFormat, { stream: morganStream });

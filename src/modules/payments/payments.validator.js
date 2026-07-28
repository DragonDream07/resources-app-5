import { body } from 'express-validator';
import { handleValidationErrors } from '../../middleware/handleValidationErrors.js';

export const validateInitiatePayment = [
  body('orderId')
    .notEmpty()
    .withMessage('orderId is required')
    .isString()
    .withMessage('orderId must be a string'),

  body('amount')
    .notEmpty()
    .withMessage('amount is required')
    .isNumeric()
    .withMessage('amount must be a number')
    .custom((value) => value > 0)
    .withMessage('amount must be greater than zero'),

  body('currency')
    .notEmpty()
    .withMessage('currency is required')
    .isString()
    .withMessage('currency must be a string')
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-letter ISO code'),

  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string'),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('metadata must be an object'),

  handleValidationErrors,
];

export const validateConfirmPayment = [
  body('paymentId')
    .notEmpty()
    .withMessage('paymentId is required')
    .isString()
    .withMessage('paymentId must be a string'),

  body('providerRef')
    .optional()
    .isString()
    .withMessage('providerRef must be a string'),

  body('providerPayload')
    .optional()
    .isObject()
    .withMessage('providerPayload must be an object'),

  handleValidationErrors,
];

export const validateWebhook = [
  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string'),

  handleValidationErrors,
];

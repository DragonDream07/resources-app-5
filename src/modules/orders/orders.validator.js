import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';

const VALID_ADVANCE_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'returned', 'cancelled'];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateCancelOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required.'),
  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string.')
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters.'),
  handleValidationErrors,
];

export const validateAdvanceOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required.'),
  body('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn(VALID_ADVANCE_STATUSES)
    .withMessage(`Status must be one of: ${VALID_ADVANCE_STATUSES.join(', ')}.`),
  handleValidationErrors,
];

export const validateReturnRequest = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required.'),
  body('items')
    .notEmpty()
    .withMessage('Items are required.')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array.'),
  body('items.*.orderItemId')
    .notEmpty()
    .withMessage('Each item must have an orderItemId.')
    .isString()
    .withMessage('orderItemId must be a string.'),
  body('items.*.quantity')
    .notEmpty()
    .withMessage('Each item must have a quantity.')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer.'),
  body('reason')
    .notEmpty()
    .withMessage('Reason is required.')
    .isString()
    .withMessage('Reason must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Reason must not exceed 1000 characters.'),
  handleValidationErrors,
];

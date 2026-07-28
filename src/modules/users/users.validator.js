import { body, validationResult } from 'express-validator';

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

export const validateUpdateMe = [
  body('first_name')
    .optional()
    .isString()
    .withMessage('First name must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters.'),

  body('last_name')
    .optional()
    .isString()
    .withMessage('Last name must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters.'),

  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string.')
    .trim()
    .matches(/^\+?[0-9\s\-().]{7,20}$/)
    .withMessage('Phone number is invalid.'),

  handleValidationErrors,
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required.'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required.')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters.')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number.'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required.')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateUpdateUser = [
  body('first_name')
    .optional()
    .isString()
    .withMessage('First name must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters.'),

  body('last_name')
    .optional()
    .isString()
    .withMessage('Last name must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters.'),

  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string.')
    .trim()
    .matches(/^\+?[0-9\s\-().]{7,20}$/)
    .withMessage('Phone number is invalid.'),

  body('role')
    .optional()
    .isIn(['admin', 'customer', 'staff'])
    .withMessage('Role must be one of: admin, customer, staff.'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean.'),

  handleValidationErrors,
];

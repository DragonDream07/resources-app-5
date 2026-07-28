import { query, validationResult } from 'express-validator';

/**
 * Middleware to send validation errors as 422.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

// ---------------------------------------------------------------------------
// GET /search
// ---------------------------------------------------------------------------
export const validateSearch = [
  query('q')
    .optional()
    .isString()
    .withMessage('q must be a string')
    .isLength({ max: 200 })
    .withMessage('q must not exceed 200 characters'),

  query('filters')
    .optional()
    .custom((value) => {
      if (typeof value !== 'string') return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        throw new Error('filters must be a valid JSON string');
      }
    }),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),

  query('size')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('size must be an integer between 1 and 100')
    .toInt(),

  query('sort')
    .optional()
    .isIn(['relevance', 'price_asc', 'price_desc', 'newest'])
    .withMessage('sort must be one of relevance, price_asc, price_desc, newest'),

  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// GET /search/autocomplete  (OpenAPI: GET /search/suggest)
// ---------------------------------------------------------------------------
export const validateSuggest = [
  query('q')
    .notEmpty()
    .withMessage('q is required')
    .isString()
    .withMessage('q must be a string')
    .isLength({ max: 200 })
    .withMessage('q must not exceed 200 characters'),

  query('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('size must be an integer between 1 and 20')
    .toInt(),

  handleValidationErrors,
];

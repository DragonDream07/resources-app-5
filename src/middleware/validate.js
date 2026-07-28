/**
 * Generic validation middleware factory for Joi schemas.
 *
 * @param {import('joi').ObjectSchema} schema - Joi schema to validate against.
 * @param {'body'|'query'|'params'} [source='body'] - Request property to validate.
 * @returns {Function} Express middleware
 */
export function validate(schema, source = 'body') {
  return function validationMiddleware(req, res, next) {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      return res.status(422).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed.',
        details,
      });
    }

    req[source] = value;
    return next();
  };
}

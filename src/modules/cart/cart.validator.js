import Joi from 'joi';

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ errors: messages });
    }
    req.body = value;
    next();
  };
}

const createCartSchema = Joi.object({
  guestId: Joi.string().uuid().optional().allow(null),
});

const addItemSchema = Joi.object({
  skuId: Joi.string().uuid().required().messages({
    'string.base': 'skuId must be a string.',
    'string.guid': 'skuId must be a valid UUID.',
    'any.required': 'skuId is required.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'quantity must be a number.',
    'number.integer': 'quantity must be an integer.',
    'number.min': 'quantity must be at least 1.',
    'any.required': 'quantity is required.',
  }),
});

const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'quantity must be a number.',
    'number.integer': 'quantity must be an integer.',
    'number.min': 'quantity must be at least 1.',
    'any.required': 'quantity is required.',
  }),
});

const applyPromoSchema = Joi.object({
  promoCode: Joi.string().trim().min(1).max(50).required().messages({
    'string.base': 'promoCode must be a string.',
    'string.empty': 'promoCode is required.',
    'string.min': 'promoCode must be at least 1 character.',
    'string.max': 'promoCode must be at most 50 characters.',
    'any.required': 'promoCode is required.',
  }),
});

export const validateCreateCart = validate(createCartSchema);
export const validateAddItem = validate(addItemSchema);
export const validateUpdateItem = validate(updateItemSchema);
export const validateApplyPromo = validate(applyPromoSchema);

import Joi from 'joi';

// ---------------------------------------------------------------------------
// Reusable sub-schemas
// ---------------------------------------------------------------------------

const addressSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Full name is required.',
    'string.min': 'Full name must be at least 2 characters.',
    'string.max': 'Full name must not exceed 100 characters.',
    'any.required': 'Full name is required.',
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^[6-9][0-9]{9}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number.',
      'any.required': 'Phone number is required.',
    }),
  line1: Joi.string().trim().min(3).max(200).required().messages({
    'string.empty': 'Address line 1 is required.',
    'string.min': 'Address line 1 must be at least 3 characters.',
    'string.max': 'Address line 1 must not exceed 200 characters.',
    'any.required': 'Address line 1 is required.',
  }),
  line2: Joi.string().trim().max(200).optional().allow('').messages({
    'string.max': 'Address line 2 must not exceed 200 characters.',
  }),
  city: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'City is required.',
    'string.min': 'City must be at least 2 characters.',
    'any.required': 'City is required.',
  }),
  state: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'State is required.',
    'any.required': 'State is required.',
  }),
  pincode: Joi.string()
    .trim()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.empty': 'Pincode is required.',
      'string.pattern.base': 'Pincode must be a 6-digit number.',
      'any.required': 'Pincode is required.',
    }),
  country: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Country is required.',
    'any.required': 'Country is required.',
  }),
  landmark: Joi.string().trim().max(200).optional().allow('').messages({
    'string.max': 'Landmark must not exceed 200 characters.',
  }),
});

// ---------------------------------------------------------------------------
// Schema: POST /checkout/start
// ---------------------------------------------------------------------------

const startCheckoutSchema = Joi.object({
  cartId: Joi.alternatives()
    .try(Joi.string().trim().min(1), Joi.number().integer().positive())
    .required()
    .messages({
      'alternatives.match': 'cartId must be a non-empty string or positive integer.',
      'any.required': 'cartId is required.',
    }),
  guestEmail: Joi.string().trim().email().optional().messages({
    'string.email': 'guestEmail must be a valid email address.',
  }),
  sessionId: Joi.string().trim().optional(),
});

// ---------------------------------------------------------------------------
// Schema: POST /checkout/address
// ---------------------------------------------------------------------------

const saveAddressSchema = Joi.object({
  sessionId: Joi.string().trim().optional(),
  address: addressSchema.required().messages({
    'any.required': 'address object is required.',
  }),
});

// ---------------------------------------------------------------------------
// Schema: POST /checkout/place-order
// ---------------------------------------------------------------------------

const placeOrderSchema = Joi.object({
  sessionId: Joi.string().trim().optional(),
  paymentMethod: Joi.string()
    .trim()
    .valid('card', 'upi', 'netbanking', 'cod', 'wallet')
    .required()
    .messages({
      'any.only': 'paymentMethod must be one of: card, upi, netbanking, cod, wallet.',
      'any.required': 'paymentMethod is required.',
    }),
  paymentDetails: Joi.object().optional(),
});

// ---------------------------------------------------------------------------
// Middleware factories
// ---------------------------------------------------------------------------

function makeValidator(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(422).json({
        status: 'error',
        message: 'Validation failed.',
        errors: error.details.map((d) => ({
          field: d.context?.label ?? d.path.join('.'),
          message: d.message,
        })),
      });
    }

    req.body = value;
    next();
  };
}

// ---------------------------------------------------------------------------
// Exported validators
// ---------------------------------------------------------------------------

export const validateStartCheckout = makeValidator(startCheckoutSchema);
export const validateSaveAddress = makeValidator(saveAddressSchema);
export const validatePlaceOrder = makeValidator(placeOrderSchema);

import Joi from 'joi';

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(422).json({ errors: messages });
    }
    req.body = value;
    return next();
  };
}

const registerSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 1 character.',
    'string.max': 'Name must be at most 100 characters.',
    'any.required': 'Name is required.',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters.',
    'string.max': 'Password must be at most 128 characters.',
    'any.required': 'Password is required.',
  }),
  phone: Joi.string().trim().pattern(/^[+]?[0-9\s\-().]{7,20}$/).optional().allow('', null).messages({
    'string.pattern.base': 'Phone number is not valid.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    'string.base': 'Token must be a string.',
    'string.empty': 'Token is required.',
    'any.required': 'Token is required.',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters.',
    'string.max': 'Password must be at most 128 characters.',
    'any.required': 'Password is required.',
  }),
});

const guestRegisterSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).optional().allow('', null).messages({
    'string.min': 'Name must be at least 1 character.',
    'string.max': 'Name must be at most 100 characters.',
  }),
  email: Joi.string().trim().email().optional().allow('', null).messages({
    'string.email': 'Email must be a valid email address.',
  }),
  phone: Joi.string().trim().pattern(/^[+]?[0-9\s\-().]{7,20}$/).optional().allow('', null).messages({
    'string.pattern.base': 'Phone number is not valid.',
  }),
});

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
export const validateGuestRegister = validate(guestRegisterSchema);

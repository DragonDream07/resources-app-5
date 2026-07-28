import Joi from 'joi';

/**
 * Schema for applying/validating a promo code against a cart.
 */
export const applyPromoSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(1).max(64).required().messages({
    'string.base': 'Promo code must be a string.',
    'string.empty': 'Promo code is required.',
    'string.min': 'Promo code must be at least 1 character.',
    'string.max': 'Promo code must be at most 64 characters.',
    'any.required': 'Promo code is required.',
  }),
  cartId: Joi.string().trim().required().messages({
    'string.base': 'Cart ID must be a string.',
    'string.empty': 'Cart ID is required.',
    'any.required': 'Cart ID is required.',
  }),
  orderAmount: Joi.number().min(0).required().messages({
    'number.base': 'Order amount must be a number.',
    'number.min': 'Order amount cannot be negative.',
    'any.required': 'Order amount is required.',
  }),
});

/**
 * Schema for creating a new promo code (admin).
 */
export const createPromoCodeSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(1).max(64).required().messages({
    'string.base': 'Promo code must be a string.',
    'string.empty': 'Promo code is required.',
    'string.min': 'Promo code must be at least 1 character.',
    'string.max': 'Promo code must be at most 64 characters.',
    'any.required': 'Promo code is required.',
  }),
  description: Joi.string().trim().max(500).optional().allow('', null).messages({
    'string.max': 'Description must be at most 500 characters.',
  }),
  discountType: Joi.string().valid('percentage', 'flat', 'free_shipping').required().messages({
    'any.only': 'Discount type must be one of: percentage, flat, free_shipping.',
    'any.required': 'Discount type is required.',
  }),
  discountValue: Joi.number().min(0).required().messages({
    'number.base': 'Discount value must be a number.',
    'number.min': 'Discount value cannot be negative.',
    'any.required': 'Discount value is required.',
  }),
  maxDiscountAmount: Joi.number().min(0).optional().allow(null).messages({
    'number.base': 'Max discount amount must be a number.',
    'number.min': 'Max discount amount cannot be negative.',
  }),
  minOrderAmount: Joi.number().min(0).optional().allow(null).messages({
    'number.base': 'Minimum order amount must be a number.',
    'number.min': 'Minimum order amount cannot be negative.',
  }),
  usageLimit: Joi.number().integer().min(1).optional().allow(null).messages({
    'number.base': 'Usage limit must be a number.',
    'number.integer': 'Usage limit must be an integer.',
    'number.min': 'Usage limit must be at least 1.',
  }),
  perUserLimit: Joi.number().integer().min(1).optional().allow(null).messages({
    'number.base': 'Per user limit must be a number.',
    'number.integer': 'Per user limit must be an integer.',
    'number.min': 'Per user limit must be at least 1.',
  }),
  startsAt: Joi.date().iso().optional().allow(null).messages({
    'date.base': 'Start date must be a valid date.',
    'date.format': 'Start date must be in ISO 8601 format.',
  }),
  expiresAt: Joi.date().iso().greater(Joi.ref('startsAt')).optional().allow(null).messages({
    'date.base': 'Expiry date must be a valid date.',
    'date.format': 'Expiry date must be in ISO 8601 format.',
    'date.greater': 'Expiry date must be after the start date.',
  }),
  status: Joi.string().valid('active', 'inactive', 'archived').optional().default('active').messages({
    'any.only': 'Status must be one of: active, inactive, archived.',
  }),
});

/**
 * Schema for updating an existing promo code (admin). All fields optional.
 */
export const updatePromoCodeSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(1).max(64).optional().messages({
    'string.base': 'Promo code must be a string.',
    'string.empty': 'Promo code cannot be empty.',
    'string.min': 'Promo code must be at least 1 character.',
    'string.max': 'Promo code must be at most 64 characters.',
  }),
  description: Joi.string().trim().max(500).optional().allow('', null).messages({
    'string.max': 'Description must be at most 500 characters.',
  }),
  discountType: Joi.string().valid('percentage', 'flat', 'free_shipping').optional().messages({
    'any.only': 'Discount type must be one of: percentage, flat, free_shipping.',
  }),
  discountValue: Joi.number().min(0).optional().messages({
    'number.base': 'Discount value must be a number.',
    'number.min': 'Discount value cannot be negative.',
  }),
  maxDiscountAmount: Joi.number().min(0).optional().allow(null).messages({
    'number.base': 'Max discount amount must be a number.',
    'number.min': 'Max discount amount cannot be negative.',
  }),
  minOrderAmount: Joi.number().min(0).optional().allow(null).messages({
    'number.base': 'Minimum order amount must be a number.',
    'number.min': 'Minimum order amount cannot be negative.',
  }),
  usageLimit: Joi.number().integer().min(1).optional().allow(null).messages({
    'number.base': 'Usage limit must be a number.',
    'number.integer': 'Usage limit must be an integer.',
    'number.min': 'Usage limit must be at least 1.',
  }),
  perUserLimit: Joi.number().integer().min(1).optional().allow(null).messages({
    'number.base': 'Per user limit must be a number.',
    'number.integer': 'Per user limit must be an integer.',
    'number.min': 'Per user limit must be at least 1.',
  }),
  startsAt: Joi.date().iso().optional().allow(null).messages({
    'date.base': 'Start date must be a valid date.',
    'date.format': 'Start date must be in ISO 8601 format.',
  }),
  expiresAt: Joi.date().iso().optional().allow(null).messages({
    'date.base': 'Expiry date must be a valid date.',
    'date.format': 'Expiry date must be in ISO 8601 format.',
  }),
  status: Joi.string().valid('active', 'inactive', 'archived').optional().messages({
    'any.only': 'Status must be one of: active, inactive, archived.',
  }),
});

/**
 * Schema for promo code ID path parameter.
 */
export const promoCodeIdParamSchema = Joi.object({
  promoCodeId: Joi.string().trim().required().messages({
    'string.base': 'Promo code ID must be a string.',
    'string.empty': 'Promo code ID is required.',
    'any.required': 'Promo code ID is required.',
  }),
});

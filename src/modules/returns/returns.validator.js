import Joi from 'joi';

export const orderReturnParamsSchema = Joi.object({
  orderId: Joi.string().required(),
});

export const returnRequestParamsSchema = Joi.object({
  returnRequestId: Joi.string().required(),
});

export const listReturnRequestsQuerySchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'approved', 'rejected')
    .optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const initiateReturnSchema = Joi.object({
  reason: Joi.string().min(3).max(500).required().messages({
    'string.base': 'Reason must be a string.',
    'string.min': 'Reason must be at least 3 characters.',
    'string.max': 'Reason must not exceed 500 characters.',
    'any.required': 'Reason is required.',
  }),
  items: Joi.array()
    .items(
      Joi.object({
        sku_id: Joi.string().required().messages({
          'any.required': 'sku_id is required for each return item.',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Quantity must be a number.',
          'number.min': 'Quantity must be at least 1.',
          'any.required': 'Quantity is required for each return item.',
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item must be included in the return request.',
      'any.required': 'Items are required.',
    }),
  notes: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Notes must not exceed 1000 characters.',
  }),
});

export const reviewReturnSchema = Joi.object({
  decision: Joi.string()
    .valid('approved', 'rejected')
    .required()
    .messages({
      'any.only': 'Decision must be either approved or rejected.',
      'any.required': 'Decision is required.',
    }),
  adminNotes: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Admin notes must not exceed 1000 characters.',
  }),
});

import Joi from 'joi';

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json({
        message: 'Validation failed.',
        errors: error.details.map((d) => ({ field: d.context?.key ?? d.path.join('.'), message: d.message })),
      });
    }
    next();
  };
}

// ── Product schemas ───────────────────────────────────────────────────────────

const productCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Product name is required.',
    'any.required': 'Product name is required.',
    'string.max': 'Product name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Product slug is required.',
    'any.required': 'Product slug is required.',
    'string.max': 'Product slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  base_price: Joi.number().positive().required().messages({
    'number.base': 'Base price must be a number.',
    'number.positive': 'Base price must be greater than 0.',
    'any.required': 'Base price is required.',
  }),
  category_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'Category ID must be a valid UUID.',
  }),
  brand_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'Brand ID must be a valid UUID.',
  }),
  status: Joi.string().valid('draft', 'active', 'inactive').optional().messages({
    'any.only': 'Status must be one of draft, active, inactive.',
  }),
});

const productUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Product name must not be empty.',
    'string.max': 'Product name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Product slug must not be empty.',
    'string.max': 'Product slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  base_price: Joi.number().positive().optional().messages({
    'number.base': 'Base price must be a number.',
    'number.positive': 'Base price must be greater than 0.',
  }),
  category_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'Category ID must be a valid UUID.',
  }),
  brand_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'Brand ID must be a valid UUID.',
  }),
  status: Joi.string().valid('draft', 'active', 'inactive').optional().messages({
    'any.only': 'Status must be one of draft, active, inactive.',
  }),
});

// ── SKU schemas ───────────────────────────────────────────────────────────────

const skuCreateSchema = Joi.object({
  sku_code: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'SKU code is required.',
    'any.required': 'SKU code is required.',
    'string.max': 'SKU code must not exceed 100 characters.',
  }),
  attributes: Joi.object().optional().allow(null),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be greater than 0.',
    'any.required': 'Price is required.',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number.',
    'number.integer': 'Stock quantity must be an integer.',
    'number.min': 'Stock quantity must be 0 or greater.',
  }),
  status: Joi.string().valid('active', 'inactive').optional().messages({
    'any.only': 'SKU status must be one of active, inactive.',
  }),
});

const skuUpdateSchema = Joi.object({
  sku_code: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'SKU code must not be empty.',
    'string.max': 'SKU code must not exceed 100 characters.',
  }),
  attributes: Joi.object().optional().allow(null),
  price: Joi.number().positive().optional().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be greater than 0.',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number.',
    'number.integer': 'Stock quantity must be an integer.',
    'number.min': 'Stock quantity must be 0 or greater.',
  }),
  status: Joi.string().valid('active', 'inactive').optional().messages({
    'any.only': 'SKU status must be one of active, inactive.',
  }),
});

// ── Category schemas ──────────────────────────────────────────────────────────

const categoryCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Category name is required.',
    'any.required': 'Category name is required.',
    'string.max': 'Category name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Category slug is required.',
    'any.required': 'Category slug is required.',
    'string.max': 'Category slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  parent_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'Parent ID must be a valid UUID.',
  }),
  image_url: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
});

const categoryUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Category name must not be empty.',
    'string.max': 'Category name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Category slug must not be empty.',
    'string.max': 'Category slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  parent_id: Joi.string().uuid().allow(null).optional().messages({
    'string.guid': 'Parent ID must be a valid UUID.',
  }),
  image_url: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
});

// ── Brand schemas ─────────────────────────────────────────────────────────────

const brandCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Brand name is required.',
    'any.required': 'Brand name is required.',
    'string.max': 'Brand name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Brand slug is required.',
    'any.required': 'Brand slug is required.',
    'string.max': 'Brand slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  image_url: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
});

const brandUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Brand name must not be empty.',
    'string.max': 'Brand name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Brand slug must not be empty.',
    'string.max': 'Brand slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  image_url: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Image URL must be a valid URL.',
  }),
});

// ── Image schema ──────────────────────────────────────────────────────────────

const imageAddSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.empty': 'Image URL is required.',
    'any.required': 'Image URL is required.',
    'string.uri': 'Image URL must be a valid URL.',
  }),
  alt_text: Joi.string().trim().allow('', null).optional(),
  sort_order: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Sort order must be a number.',
    'number.integer': 'Sort order must be an integer.',
    'number.min': 'Sort order must be 0 or greater.',
  }),
});

// ── Exported middleware ───────────────────────────────────────────────────────

export const validateProductCreate = validate(productCreateSchema);
export const validateProductUpdate = validate(productUpdateSchema);
export const validateSkuCreate = validate(skuCreateSchema);
export const validateSkuUpdate = validate(skuUpdateSchema);
export const validateCategoryCreate = validate(categoryCreateSchema);
export const validateCategoryUpdate = validate(categoryUpdateSchema);
export const validateBrandCreate = validate(brandCreateSchema);
export const validateBrandUpdate = validate(brandUpdateSchema);
export const validateImageAdd = validate(imageAddSchema);

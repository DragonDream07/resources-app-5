import * as Yup from 'yup';

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required.'),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter.'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number.'
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter.'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number.'
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required.'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter.'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number.'
    )
    .notOneOf(
      [Yup.ref('currentPassword')],
      'New password must be different from the current password.'
    )
    .required('New password is required.'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match.')
    .required('Please confirm your new password.'),
});

// ---------------------------------------------------------------------------
// Address schema
// ---------------------------------------------------------------------------

export const addressSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name must not exceed 100 characters.')
    .required('Full name is required.'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.')
    .required('Phone number is required.'),
  addressLine1: Yup.string()
    .min(5, 'Address must be at least 5 characters.')
    .max(255, 'Address must not exceed 255 characters.')
    .required('Address line 1 is required.'),
  addressLine2: Yup.string()
    .max(255, 'Address line 2 must not exceed 255 characters.')
    .optional(),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters.')
    .max(100, 'City must not exceed 100 characters.')
    .required('City is required.'),
  state: Yup.string()
    .min(2, 'State must be at least 2 characters.')
    .max(100, 'State must not exceed 100 characters.')
    .required('State is required.'),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, 'Please enter a valid 6-digit PIN code.')
    .required('PIN code is required.'),
  isDefault: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Profile schema
// ---------------------------------------------------------------------------

export const profileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.')
    .optional()
    .nullable(),
});

// ---------------------------------------------------------------------------
// Product schema (admin)
// ---------------------------------------------------------------------------

export const productSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters.')
    .max(255, 'Product name must not exceed 255 characters.')
    .required('Product name is required.'),
  description: Yup.string()
    .max(5000, 'Description must not exceed 5000 characters.')
    .optional(),
  brandId: Yup.string()
    .required('Brand is required.'),
  categoryId: Yup.string()
    .required('Category is required.'),
  basePrice: Yup.number()
    .typeError('Base price must be a number.')
    .positive('Base price must be greater than 0.')
    .required('Base price is required.'),
  gstRate: Yup.number()
    .typeError('GST rate must be a number.')
    .min(0, 'GST rate cannot be negative.')
    .max(1, 'GST rate must be between 0 and 1.')
    .optional(),
});

// ---------------------------------------------------------------------------
// SKU schema (admin)
// ---------------------------------------------------------------------------

export const skuSchema = Yup.object({
  sku: Yup.string()
    .min(2, 'SKU code must be at least 2 characters.')
    .max(100, 'SKU code must not exceed 100 characters.')
    .required('SKU code is required.'),
  attributes: Yup.object().optional(),
  price: Yup.number()
    .typeError('Price must be a number.')
    .positive('Price must be greater than 0.')
    .required('Price is required.'),
  stock: Yup.number()
    .typeError('Stock must be a number.')
    .integer('Stock must be a whole number.')
    .min(0, 'Stock cannot be negative.')
    .required('Stock is required.'),
});

// ---------------------------------------------------------------------------
// Category schema (admin)
// ---------------------------------------------------------------------------

export const categorySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Category name must be at least 2 characters.')
    .max(100, 'Category name must not exceed 100 characters.')
    .required('Category name is required.'),
  parentId: Yup.string().optional().nullable(),
  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters.')
    .optional(),
});

// ---------------------------------------------------------------------------
// Brand schema (admin)
// ---------------------------------------------------------------------------

export const brandSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Brand name must be at least 2 characters.')
    .max(100, 'Brand name must not exceed 100 characters.')
    .required('Brand name is required.'),
  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters.')
    .optional(),
});

// ---------------------------------------------------------------------------
// Promo code schema (admin)
// ---------------------------------------------------------------------------

export const promoCodeSchema = Yup.object({
  code: Yup.string()
    .min(3, 'Promo code must be at least 3 characters.')
    .max(50, 'Promo code must not exceed 50 characters.')
    .matches(/^[A-Z0-9_-]+$/, 'Promo code must contain only uppercase letters, numbers, hyphens, or underscores.')
    .required('Promo code is required.'),
  discountType: Yup.string()
    .oneOf(['percentage', 'flat'], 'Invalid discount type.')
    .required('Discount type is required.'),
  discountValue: Yup.number()
    .typeError('Discount value must be a number.')
    .positive('Discount value must be greater than 0.')
    .required('Discount value is required.'),
  minOrderAmount: Yup.number()
    .typeError('Minimum order amount must be a number.')
    .min(0, 'Minimum order amount cannot be negative.')
    .optional(),
  maxUses: Yup.number()
    .typeError('Max uses must be a number.')
    .integer('Max uses must be a whole number.')
    .positive('Max uses must be greater than 0.')
    .optional()
    .nullable(),
  expiresAt: Yup.date()
    .typeError('Please enter a valid expiry date.')
    .optional()
    .nullable(),
});

// ---------------------------------------------------------------------------
// Guest checkout registration schema
// ---------------------------------------------------------------------------

export const guestRegisterSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .matches(
      /[A-Z]/,
      'Password must contain at least one uppercase letter.'
    )
    .matches(
      /[0-9]/,
      'Password must contain at least one number.'
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

// ---------------------------------------------------------------------------
// Return request schema
// ---------------------------------------------------------------------------

export const returnRequestSchema = Yup.object({
  reason: Yup.string()
    .min(10, 'Please provide a reason of at least 10 characters.')
    .max(1000, 'Reason must not exceed 1000 characters.')
    .required('Reason is required.'),
  items: Yup.array()
    .of(
      Yup.object({
        orderItemId: Yup.string().required('Order item ID is required.'),
        quantity: Yup.number()
          .typeError('Quantity must be a number.')
          .integer('Quantity must be a whole number.')
          .positive('Quantity must be greater than 0.')
          .required('Quantity is required.'),
      })
    )
    .min(1, 'At least one item must be selected for return.')
    .required('Items are required.'),
});

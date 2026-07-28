import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import {
  validatePromoCode,
  listPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getPromoCode,
} from './promotions.controller.js';
import { validateBody, validateParams } from '../../middleware/validate.middleware.js';
import {
  applyPromoSchema,
  createPromoCodeSchema,
  updatePromoCodeSchema,
  promoCodeIdParamSchema,
} from './promotions.validator.js';

const router = Router();

// Public / cart-level promo validation (used by cart routes via POST /carts/:cartId/promo)
// Exposed here as a standalone validation utility
router.post(
  '/promo/validate',
  authenticate,
  validateBody(applyPromoSchema),
  validatePromoCode,
);

// Admin CRUD for promo codes — GET /promo-codes (admin)
router.get(
  '/admin/promo-codes',
  authenticate,
  requireRole('admin'),
  listPromoCodes,
);

router.get(
  '/admin/promo-codes/:promoCodeId',
  authenticate,
  requireRole('admin'),
  validateParams(promoCodeIdParamSchema),
  getPromoCode,
);

router.post(
  '/admin/promo-codes',
  authenticate,
  requireRole('admin'),
  validateBody(createPromoCodeSchema),
  createPromoCode,
);

router.put(
  '/admin/promo-codes/:promoCodeId',
  authenticate,
  requireRole('admin'),
  validateParams(promoCodeIdParamSchema),
  validateBody(updatePromoCodeSchema),
  updatePromoCode,
);

router.delete(
  '/admin/promo-codes/:promoCodeId',
  authenticate,
  requireRole('admin'),
  validateParams(promoCodeIdParamSchema),
  deletePromoCode,
);

export default router;

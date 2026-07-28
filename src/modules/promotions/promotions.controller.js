import {
  validateAndApplyPromo,
  fetchAllPromoCodes,
  fetchPromoCodeById,
  createNewPromoCode,
  updateExistingPromoCode,
  removePromoCode,
} from './promotions.service.js';

/**
 * POST /promo/validate
 * Validates a promo code against a cart without persisting usage.
 */
export async function validatePromoCode(req, res, next) {
  try {
    const userId = req.user.id;
    const { code, cartId, orderAmount } = req.body;
    const result = await validateAndApplyPromo({ code, cartId, orderAmount, userId });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/promo-codes
 * Lists all promo codes (admin only).
 */
export async function listPromoCodes(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const result = await fetchAllPromoCodes({ page: Number(page), limit: Number(limit), status });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/promo-codes/:promoCodeId
 * Retrieves a single promo code by ID (admin only).
 */
export async function getPromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;
    const promoCode = await fetchPromoCodeById(promoCodeId);
    return res.status(200).json({ success: true, data: promoCode });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /admin/promo-codes
 * Creates a new promo code (admin only).
 */
export async function createPromoCode(req, res, next) {
  try {
    const promoCode = await createNewPromoCode(req.body);
    return res.status(201).json({ success: true, data: promoCode });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /admin/promo-codes/:promoCodeId
 * Updates an existing promo code (admin only).
 */
export async function updatePromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;
    const promoCode = await updateExistingPromoCode(promoCodeId, req.body);
    return res.status(200).json({ success: true, data: promoCode });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /admin/promo-codes/:promoCodeId
 * Deletes a promo code (admin only).
 */
export async function deletePromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;
    await removePromoCode(promoCodeId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

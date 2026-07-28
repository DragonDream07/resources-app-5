import { db } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function isPromoActive(promo) {
  const now = new Date();
  if (promo.status !== 'active') return false;
  if (promo.starts_at && new Date(promo.starts_at) > now) return false;
  if (promo.expires_at && new Date(promo.expires_at) < now) return false;
  return true;
}

function calculateDiscount(promo, orderAmount) {
  let discountAmount = 0;

  if (promo.discount_type === 'percentage') {
    discountAmount = (orderAmount * promo.discount_value) / 100;
    if (promo.max_discount_amount && discountAmount > promo.max_discount_amount) {
      discountAmount = promo.max_discount_amount;
    }
  } else if (promo.discount_type === 'flat') {
    discountAmount = promo.discount_value;
  } else if (promo.discount_type === 'free_shipping') {
    discountAmount = 0; // handled at shipping layer
  }

  // Discount cannot exceed order amount
  if (discountAmount > orderAmount) {
    discountAmount = orderAmount;
  }

  return Math.round(discountAmount * 100) / 100;
}

// ---------------------------------------------------------------------------
// Exported service functions
// ---------------------------------------------------------------------------

/**
 * Validates a promo code for a given cart/order and returns the discount.
 * Does NOT increment usage — use recordPromoUsage for that.
 */
export async function validateAndApplyPromo({ code, cartId, orderAmount, userId }) {
  const promo = await db('promo_codes').where({ code }).first();

  if (!promo) {
    throw new AppError('Promo code not found.', 404);
  }

  if (!isPromoActive(promo)) {
    throw new AppError('Promo code is expired or inactive.', 400);
  }

  if (promo.min_order_amount && orderAmount < promo.min_order_amount) {
    throw new AppError(
      `Minimum order amount of ${promo.min_order_amount} required to use this promo code.`,
      400,
    );
  }

  if (promo.usage_limit !== null && promo.times_used >= promo.usage_limit) {
    throw new AppError('Promo code usage limit has been reached.', 400);
  }

  if (promo.per_user_limit !== null && userId) {
    const userUsageCount = await db('promo_code_usages')
      .where({ promo_code_id: promo.id, user_id: userId })
      .count('id as count')
      .first();
    if (Number(userUsageCount.count) >= promo.per_user_limit) {
      throw new AppError('You have reached the usage limit for this promo code.', 400);
    }
  }

  const discountAmount = calculateDiscount(promo, orderAmount);
  const finalAmount = orderAmount - discountAmount;

  return {
    promoCodeId: promo.id,
    code: promo.code,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    discountAmount,
    finalAmount: Math.max(finalAmount, 0),
    isFreeShipping: promo.discount_type === 'free_shipping',
  };
}

/**
 * Records promo usage after a successful order placement.
 */
export async function recordPromoUsage({ promoCodeId, userId, orderId }) {
  await db.transaction(async (trx) => {
    await trx('promo_code_usages').insert({
      promo_code_id: promoCodeId,
      user_id: userId,
      order_id: orderId,
    });
    await trx('promo_codes').where({ id: promoCodeId }).increment('times_used', 1);
  });
}

/**
 * Fetches a paginated list of promo codes.
 */
export async function fetchAllPromoCodes({ page = 1, limit = 20, status } = {}) {
  const offset = (page - 1) * limit;
  const query = db('promo_codes').orderBy('created_at', 'desc');

  if (status) {
    query.where({ status });
  }

  const [promoCodes, [{ count }]] = await Promise.all([
    query.clone().limit(limit).offset(offset),
    query.clone().count('id as count'),
  ]);

  return {
    items: promoCodes,
    total: Number(count),
    page,
    limit,
    totalPages: Math.ceil(Number(count) / limit),
  };
}

/**
 * Fetches a single promo code by its ID.
 */
export async function fetchPromoCodeById(promoCodeId) {
  const promo = await db('promo_codes').where({ id: promoCodeId }).first();
  if (!promo) {
    throw new AppError('Promo code not found.', 404);
  }
  return promo;
}

/**
 * Creates a new promo code.
 */
export async function createNewPromoCode(data) {
  const existing = await db('promo_codes').where({ code: data.code }).first();
  if (existing) {
    throw new AppError('A promo code with this code already exists.', 409);
  }

  const [promoCode] = await db('promo_codes')
    .insert({
      code: data.code.toUpperCase(),
      description: data.description || null,
      discount_type: data.discountType,
      discount_value: data.discountValue,
      max_discount_amount: data.maxDiscountAmount || null,
      min_order_amount: data.minOrderAmount || null,
      usage_limit: data.usageLimit || null,
      per_user_limit: data.perUserLimit || null,
      starts_at: data.startsAt || null,
      expires_at: data.expiresAt || null,
      status: data.status || 'active',
      times_used: 0,
    })
    .returning('*');

  return promoCode;
}

/**
 * Updates an existing promo code.
 */
export async function updateExistingPromoCode(promoCodeId, data) {
  const promo = await db('promo_codes').where({ id: promoCodeId }).first();
  if (!promo) {
    throw new AppError('Promo code not found.', 404);
  }

  if (data.code && data.code.toUpperCase() !== promo.code) {
    const existing = await db('promo_codes').where({ code: data.code.toUpperCase() }).first();
    if (existing) {
      throw new AppError('A promo code with this code already exists.', 409);
    }
  }

  const updatePayload = {};
  if (data.code !== undefined) updatePayload.code = data.code.toUpperCase();
  if (data.description !== undefined) updatePayload.description = data.description;
  if (data.discountType !== undefined) updatePayload.discount_type = data.discountType;
  if (data.discountValue !== undefined) updatePayload.discount_value = data.discountValue;
  if (data.maxDiscountAmount !== undefined) updatePayload.max_discount_amount = data.maxDiscountAmount;
  if (data.minOrderAmount !== undefined) updatePayload.min_order_amount = data.minOrderAmount;
  if (data.usageLimit !== undefined) updatePayload.usage_limit = data.usageLimit;
  if (data.perUserLimit !== undefined) updatePayload.per_user_limit = data.perUserLimit;
  if (data.startsAt !== undefined) updatePayload.starts_at = data.startsAt;
  if (data.expiresAt !== undefined) updatePayload.expires_at = data.expiresAt;
  if (data.status !== undefined) updatePayload.status = data.status;

  const [updated] = await db('promo_codes')
    .where({ id: promoCodeId })
    .update(updatePayload)
    .returning('*');

  return updated;
}

/**
 * Deletes a promo code by ID.
 */
export async function removePromoCode(promoCodeId) {
  const promo = await db('promo_codes').where({ id: promoCodeId }).first();
  if (!promo) {
    throw new AppError('Promo code not found.', 404);
  }
  await db('promo_codes').where({ id: promoCodeId }).delete();
}

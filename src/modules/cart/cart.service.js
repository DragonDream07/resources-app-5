import db from '../../db/index.js';

/**
 * Creates a new cart. Merges guest cart into authenticated user cart if both exist.
 */
export async function createCartService({ userId, guestId }) {
  // If userId provided, check if user already has an active cart
  if (userId) {
    const existing = await db('carts')
      .where({ user_id: userId, status: 'active' })
      .first();

    if (existing) {
      // Merge guest cart if guestId provided
      if (guestId) {
        await mergeGuestCart(existing.id, guestId);
      }
      return getCartService(existing.id);
    }
  }

  // If guestId provided and a guest cart already exists, return it (optionally merge)
  if (guestId && !userId) {
    const guestCart = await db('carts')
      .where({ guest_id: guestId, status: 'active' })
      .first();
    if (guestCart) {
      return getCartService(guestCart.id);
    }
  }

  const [cart] = await db('carts')
    .insert({
      user_id: userId || null,
      guest_id: guestId || null,
      status: 'active',
      promo_code: null,
      discount_amount: 0,
    })
    .returning('*');

  return getCartService(cart.id);
}

/**
 * Retrieves a cart with its items.
 */
export async function getCartService(cartId) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) return null;

  const items = await db('cart_items as ci')
    .join('skus as s', 'ci.sku_id', 's.id')
    .where('ci.cart_id', cartId)
    .select(
      'ci.id',
      'ci.cart_id',
      'ci.sku_id',
      'ci.quantity',
      'ci.unit_price',
      's.name as sku_name',
      's.stock_quantity',
      db.raw('ci.unit_price * ci.quantity as line_total')
    );

  const subtotal = items.reduce((sum, item) => sum + Number(item.line_total), 0);
  const discountAmount = Number(cart.discount_amount) || 0;
  const total = subtotal - discountAmount;

  return {
    ...cart,
    items,
    subtotal,
    discount_amount: discountAmount,
    total,
  };
}

/**
 * Adds an item to the cart. Validates stock availability.
 */
export async function addItemService(cartId, { skuId, quantity }) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    const err = new Error('Cart not found.');
    err.statusCode = 404;
    throw err;
  }

  const sku = await db('skus').where({ id: skuId }).first();
  if (!sku) {
    const err = new Error('SKU not found.');
    err.statusCode = 404;
    throw err;
  }

  // Check if item already in cart
  const existingItem = await db('cart_items')
    .where({ cart_id: cartId, sku_id: skuId })
    .first();

  const requestedQty = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  if (sku.stock_quantity < requestedQty) {
    const err = new Error('Insufficient stock for the requested quantity.');
    err.statusCode = 422;
    throw err;
  }

  if (existingItem) {
    await db('cart_items')
      .where({ id: existingItem.id })
      .update({ quantity: requestedQty });
  } else {
    await db('cart_items').insert({
      cart_id: cartId,
      sku_id: skuId,
      quantity,
      unit_price: sku.price,
    });
  }

  return getCartService(cartId);
}

/**
 * Updates the quantity of a cart item. Validates stock.
 */
export async function updateItemService(cartId, itemId, { quantity }) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    const err = new Error('Cart not found.');
    err.statusCode = 404;
    throw err;
  }

  const item = await db('cart_items')
    .where({ id: itemId, cart_id: cartId })
    .first();
  if (!item) {
    const err = new Error('Cart item not found.');
    err.statusCode = 404;
    throw err;
  }

  const sku = await db('skus').where({ id: item.sku_id }).first();
  if (!sku) {
    const err = new Error('SKU not found.');
    err.statusCode = 404;
    throw err;
  }

  if (sku.stock_quantity < quantity) {
    const err = new Error('Insufficient stock for the requested quantity.');
    err.statusCode = 422;
    throw err;
  }

  await db('cart_items').where({ id: itemId }).update({ quantity });

  return getCartService(cartId);
}

/**
 * Removes an item from the cart.
 */
export async function removeItemService(cartId, itemId) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    const err = new Error('Cart not found.');
    err.statusCode = 404;
    throw err;
  }

  const item = await db('cart_items')
    .where({ id: itemId, cart_id: cartId })
    .first();
  if (!item) {
    const err = new Error('Cart item not found.');
    err.statusCode = 404;
    throw err;
  }

  await db('cart_items').where({ id: itemId }).delete();

  return getCartService(cartId);
}

/**
 * Applies a promo code to the cart.
 */
export async function applyPromoService(cartId, promoCode) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    const err = new Error('Cart not found.');
    err.statusCode = 404;
    throw err;
  }

  const promo = await db('promo_codes')
    .where({ code: promoCode, is_active: true })
    .first();

  if (!promo) {
    const err = new Error('Promo code is invalid or expired.');
    err.statusCode = 422;
    throw err;
  }

  const now = new Date();
  if (promo.expires_at && new Date(promo.expires_at) < now) {
    const err = new Error('Promo code is invalid or expired.');
    err.statusCode = 422;
    throw err;
  }

  const items = await db('cart_items').where({ cart_id: cartId });
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0
  );

  let discountAmount = 0;
  if (promo.discount_type === 'percentage') {
    discountAmount = (subtotal * Number(promo.discount_value)) / 100;
  } else if (promo.discount_type === 'fixed') {
    discountAmount = Math.min(Number(promo.discount_value), subtotal);
  }

  await db('carts').where({ id: cartId }).update({
    promo_code: promoCode,
    discount_amount: discountAmount,
  });

  return getCartService(cartId);
}

/**
 * Removes the promo code from the cart.
 */
export async function removePromoService(cartId) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    const err = new Error('Cart not found.');
    err.statusCode = 404;
    throw err;
  }

  await db('carts').where({ id: cartId }).update({
    promo_code: null,
    discount_amount: 0,
  });

  return getCartService(cartId);
}

/**
 * Merges items from a guest cart into a target (authenticated) cart.
 */
async function mergeGuestCart(targetCartId, guestId) {
  const guestCart = await db('carts')
    .where({ guest_id: guestId, status: 'active' })
    .first();

  if (!guestCart) return;

  const guestItems = await db('cart_items').where({ cart_id: guestCart.id });

  for (const guestItem of guestItems) {
    const sku = await db('skus').where({ id: guestItem.sku_id }).first();
    if (!sku) continue;

    const existingItem = await db('cart_items')
      .where({ cart_id: targetCartId, sku_id: guestItem.sku_id })
      .first();

    const mergedQty = existingItem
      ? existingItem.quantity + guestItem.quantity
      : guestItem.quantity;

    const finalQty = Math.min(mergedQty, sku.stock_quantity);

    if (existingItem) {
      await db('cart_items')
        .where({ id: existingItem.id })
        .update({ quantity: finalQty });
    } else {
      await db('cart_items').insert({
        cart_id: targetCartId,
        sku_id: guestItem.sku_id,
        quantity: finalQty,
        unit_price: guestItem.unit_price,
      });
    }
  }

  // Delete guest cart items and mark guest cart as merged
  await db('cart_items').where({ cart_id: guestCart.id }).delete();
  await db('carts').where({ id: guestCart.id }).update({ status: 'merged' });
}

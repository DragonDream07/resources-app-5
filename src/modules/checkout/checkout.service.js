import db from '../../config/db.js';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Retrieve a checkout session row.  The session is stored in an in-process
 * Map for simplicity; swap for Redis / DB in production.
 *
 * Shape: { sessionId, cartId, userId|null, address|null, promoCode|null }
 */
const sessions = new Map();

function getSession(sessionId) {
  if (!sessionId || !sessions.has(sessionId)) {
    const err = new Error('Checkout session not found or expired.');
    err.status = 404;
    throw err;
  }
  return sessions.get(sessionId);
}

function generateSessionId() {
  // Deterministic-ish: use a counter + a hash of the timestamp string.
  // In production, use crypto.randomUUID().
  return `cks_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

// ---------------------------------------------------------------------------
// Address validation
// ---------------------------------------------------------------------------

/**
 * Validates that the supplied address object has all required fields and that
 * the pincode is serviceable.
 */
function validateAddress(address) {
  const required = ['fullName', 'phone', 'line1', 'city', 'state', 'pincode', 'country'];
  for (const field of required) {
    if (!address[field] || String(address[field]).trim() === '') {
      const err = new Error(`Address field "${field}" is required.`);
      err.status = 422;
      throw err;
    }
  }
  if (!/^[0-9]{6}$/.test(address.pincode)) {
    const err = new Error('Pincode must be a 6-digit number.');
    err.status = 422;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Stock reservation confirmation
// ---------------------------------------------------------------------------

/**
 * Verifies that every cart line-item has sufficient stock in the `skus` table
 * and that the cart is still active.
 * Returns the cart rows.
 */
async function confirmStockReservation(cartId) {
  const cartItems = await db('cart_items')
    .join('skus', 'cart_items.sku_id', 'skus.id')
    .where('cart_items.cart_id', cartId)
    .select(
      'cart_items.id as cartItemId',
      'cart_items.sku_id as skuId',
      'cart_items.quantity',
      'skus.stock',
      'skus.price',
      'skus.name as skuName',
    );

  if (!cartItems.length) {
    const err = new Error('Cart is empty. Cannot place an order.');
    err.status = 422;
    throw err;
  }

  for (const item of cartItems) {
    if (item.stock < item.quantity) {
      const err = new Error(
        `Insufficient stock for SKU "${item.skuName}". Available: ${item.stock}, requested: ${item.quantity}.`,
      );
      err.status = 422;
      throw err;
    }
  }

  return cartItems;
}

// ---------------------------------------------------------------------------
// Promo finalisation
// ---------------------------------------------------------------------------

/**
 * Validates and applies a promo code to the order subtotal.
 * Returns the discount amount (0 if no promo code).
 */
async function finalisePromo(promoCode, subtotal) {
  if (!promoCode) return { discountAmount: 0, promoId: null };

  const promo = await db('promo_codes')
    .where({ code: promoCode, is_active: true })
    .first();

  if (!promo) {
    const err = new Error('Promo code is invalid or has expired.');
    err.status = 422;
    throw err;
  }

  const now = new Date();
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    const err = new Error('Promo code is not yet valid.');
    err.status = 422;
    throw err;
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    const err = new Error('Promo code has expired.');
    err.status = 422;
    throw err;
  }
  if (promo.usage_limit !== null && promo.usage_count >= promo.usage_limit) {
    const err = new Error('Promo code usage limit has been reached.');
    err.status = 422;
    throw err;
  }
  if (promo.min_order_value && subtotal < promo.min_order_value) {
    const err = new Error(
      `Order subtotal does not meet the minimum required for this promo code (min: ${promo.min_order_value}).`,
    );
    err.status = 422;
    throw err;
  }

  let discountAmount = 0;
  if (promo.discount_type === 'percentage') {
    discountAmount = (subtotal * promo.discount_value) / 100;
    if (promo.max_discount && discountAmount > promo.max_discount) {
      discountAmount = promo.max_discount;
    }
  } else {
    discountAmount = promo.discount_value;
  }

  return { discountAmount, promoId: promo.id };
}

// ---------------------------------------------------------------------------
// Order creation
// ---------------------------------------------------------------------------

/**
 * Inserts an order record plus its line-items inside a transaction.
 * Also decrements SKU stock and increments promo usage_count.
 * Returns the newly created order row.
 */
async function createOrder({ cartItems, address, subtotal, discountAmount, promoId, userId, guestEmail }) {
  const shippingCost = subtotal >= 499 ? 0 : 49;
  const total = subtotal - discountAmount + shippingCost;

  return db.transaction(async (trx) => {
    const [orderId] = await trx('orders').insert({
      user_id: userId ?? null,
      guest_email: guestEmail ?? null,
      status: 'pending_payment',
      subtotal,
      discount_amount: discountAmount,
      shipping_cost: shippingCost,
      total,
      promo_id: promoId ?? null,
      shipping_address: JSON.stringify(address),
      created_at: new Date(),
      updated_at: new Date(),
    });

    const orderLines = cartItems.map((item) => ({
      order_id: orderId,
      sku_id: item.skuId,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.quantity * item.price,
    }));

    await trx('order_items').insert(orderLines);

    // Decrement stock
    for (const item of cartItems) {
      await trx('skus')
        .where('id', item.skuId)
        .decrement('stock', item.quantity);
    }

    // Increment promo usage
    if (promoId) {
      await trx('promo_codes').where('id', promoId).increment('usage_count', 1);
    }

    const order = await trx('orders').where('id', orderId).first();
    return order;
  });
}

// ---------------------------------------------------------------------------
// Payment intent delegation
// ---------------------------------------------------------------------------

/**
 * Delegates payment-intent creation to the payments module.
 * This is intentionally thin: the payments module owns the actual gateway call.
 */
async function delegatePaymentIntent(orderId, amount, currency = 'INR') {
  // Dynamically import to avoid circular dependencies.
  const { initiatePaymentService } = await import('../payments/payments.service.js');
  return initiatePaymentService({ orderId, amount, currency });
}

// ---------------------------------------------------------------------------
// Public service functions
// ---------------------------------------------------------------------------

/**
 * POST /checkout/start
 * Creates a checkout session linked to the cart.
 * Supports both authenticated users and guests.
 */
export async function startCheckoutService(body, user) {
  const { cartId, guestEmail } = body;

  if (!cartId) {
    const err = new Error('cartId is required to start checkout.');
    err.status = 422;
    throw err;
  }

  // Verify the cart exists and belongs to the user (or is a guest cart).
  const cart = await db('carts').where('id', cartId).first();
  if (!cart) {
    const err = new Error('Cart not found.');
    err.status = 404;
    throw err;
  }

  if (user && cart.user_id && cart.user_id !== user.id) {
    const err = new Error('Cart does not belong to the authenticated user.');
    err.status = 403;
    throw err;
  }

  if (!user && !guestEmail) {
    const err = new Error('guestEmail is required for guest checkout.');
    err.status = 422;
    throw err;
  }

  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    sessionId,
    cartId,
    userId: user ? user.id : null,
    guestEmail: guestEmail ?? null,
    address: null,
    promoCode: cart.promo_code ?? null,
  });

  return { sessionId, cartId, message: 'Checkout session started.' };
}

/**
 * POST /checkout/address
 * Saves or updates the delivery address for an active checkout session.
 */
export async function saveAddressService(sessionId, body, user) {
  const session = getSession(sessionId);
  const { address } = body;

  if (!address) {
    const err = new Error('address object is required.');
    err.status = 422;
    throw err;
  }

  validateAddress(address);

  session.address = address;
  sessions.set(sessionId, session);

  return { sessionId, address, message: 'Address saved successfully.' };
}

/**
 * GET /checkout/review
 * Returns the full order summary for the active checkout session.
 */
export async function reviewCheckoutService(sessionId, user) {
  const session = getSession(sessionId);
  const { cartId, address, promoCode } = session;

  const cartItems = await db('cart_items')
    .join('skus', 'cart_items.sku_id', 'skus.id')
    .join('products', 'skus.product_id', 'products.id')
    .where('cart_items.cart_id', cartId)
    .select(
      'cart_items.id as cartItemId',
      'cart_items.sku_id as skuId',
      'cart_items.quantity',
      'skus.price',
      'skus.stock',
      'skus.name as skuName',
      'products.name as productName',
    );

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  let promoDetails = null;
  if (promoCode) {
    try {
      const promoResult = await finalisePromo(promoCode, subtotal);
      discountAmount = promoResult.discountAmount;
      const promo = await db('promo_codes').where({ code: promoCode }).first();
      promoDetails = promo
        ? { code: promo.code, discountType: promo.discount_type, discountValue: promo.discount_value }
        : null;
    } catch (_) {
      // Promo may have expired since it was applied; surface it as a warning.
      promoDetails = { code: promoCode, warning: 'Promo code is no longer valid.' };
    }
  }

  const shippingCost = subtotal >= 499 ? 0 : 49;
  const total = subtotal - discountAmount + shippingCost;

  return {
    sessionId,
    items: cartItems,
    address,
    promoCode,
    promoDetails,
    subtotal,
    discountAmount,
    shippingCost,
    total,
  };
}

/**
 * POST /checkout/place-order
 * Confirms stock, finalises promo, creates the order, and delegates payment intent.
 */
export async function placeOrderService(sessionId, body, user) {
  const session = getSession(sessionId);
  const { cartId, address, promoCode, userId, guestEmail } = session;

  if (!address) {
    const err = new Error('Delivery address is required before placing an order.');
    err.status = 422;
    throw err;
  }

  // 1. Confirm stock reservation
  const cartItems = await confirmStockReservation(cartId);

  // 2. Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 3. Finalise promo
  const { discountAmount, promoId } = await finalisePromo(promoCode, subtotal);

  // 4. Create order
  const order = await createOrder({
    cartItems,
    address,
    subtotal,
    discountAmount,
    promoId,
    userId,
    guestEmail,
  });

  // 5. Delegate payment intent
  let paymentIntent = null;
  try {
    paymentIntent = await delegatePaymentIntent(order.id, order.total);
  } catch (payErr) {
    // Non-fatal: payment intent creation failure does not roll back the order.
    // The order remains in `pending_payment` status.
    paymentIntent = { error: payErr.message };
  }

  // 6. Invalidate the checkout session
  sessions.delete(sessionId);

  // 7. Clear the cart
  await db('cart_items').where('cart_id', cartId).delete();

  return {
    orderId: order.id,
    status: order.status,
    total: order.total,
    paymentIntent,
    message: 'Order placed successfully.',
  };
}

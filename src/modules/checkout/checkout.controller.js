import {
  startCheckoutService,
  saveAddressService,
  reviewCheckoutService,
  placeOrderService,
} from './checkout.service.js';

/**
 * POST /checkout/start
 * Initiates a checkout session for an authenticated or guest user.
 */
export async function startCheckout(req, res, next) {
  try {
    const result = await startCheckoutService(req.body, req.user ?? null);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /checkout/address
 * Saves or updates the delivery address for the active checkout session.
 */
export async function saveAddress(req, res, next) {
  try {
    const sessionId = req.headers['x-checkout-session'] ?? req.body.sessionId;
    const result = await saveAddressService(sessionId, req.body, req.user ?? null);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /checkout/review
 * Returns the full order summary (items, address, promo, totals) before confirmation.
 */
export async function reviewCheckout(req, res, next) {
  try {
    const sessionId = req.headers['x-checkout-session'] ?? req.query.sessionId;
    const result = await reviewCheckoutService(sessionId, req.user ?? null);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /checkout/place-order
 * Confirms stock reservation, finalises promo, creates the order record, and
 * delegates payment-intent creation to the payments module.
 */
export async function placeOrder(req, res, next) {
  try {
    const sessionId = req.headers['x-checkout-session'] ?? req.body.sessionId;
    const result = await placeOrderService(sessionId, req.body, req.user ?? null);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

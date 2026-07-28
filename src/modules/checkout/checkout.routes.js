import { Router } from 'express';
import {
  startCheckout,
  saveAddress,
  reviewCheckout,
  placeOrder,
} from './checkout.controller.js';
import {
  validateStartCheckout,
  validateSaveAddress,
  validatePlaceOrder,
} from './checkout.validator.js';

const router = Router();

// POST /checkout/start — initiates a checkout session (supports guest checkout)
router.post('/start', validateStartCheckout, startCheckout);

// POST /checkout/address — saves / updates the delivery address for the checkout
router.post('/address', validateSaveAddress, saveAddress);

// GET /checkout/review — returns the full order summary before final confirmation
router.get('/review', reviewCheckout);

// POST /checkout/place-order — confirms stock, finalises promo, creates order, delegates payment
router.post('/place-order', validatePlaceOrder, placeOrder);

export default router;

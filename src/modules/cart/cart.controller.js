import {
  createCartService,
  getCartService,
  addItemService,
  updateItemService,
  removeItemService,
  applyPromoService,
  removePromoService,
} from './cart.service.js';

export async function createCart(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const { guestId } = req.body;
    const cart = await createCartService({ userId, guestId });
    return res.status(201).json({ data: cart });
  } catch (err) {
    next(err);
  }
}

export async function getCart(req, res, next) {
  try {
    const { cartId } = req.params;
    const cart = await getCartService(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    return res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
}

export async function addItem(req, res, next) {
  try {
    const { cartId } = req.params;
    const { skuId, quantity } = req.body;
    const cart = await addItemService(cartId, { skuId, quantity });
    return res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;
    const cart = await updateItemService(cartId, itemId, { quantity });
    return res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next) {
  try {
    const { cartId, itemId } = req.params;
    const cart = await removeItemService(cartId, itemId);
    return res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
}

export async function applyPromo(req, res, next) {
  try {
    const { cartId } = req.params;
    const { promoCode } = req.body;
    const cart = await applyPromoService(cartId, promoCode);
    return res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
}

export async function removePromo(req, res, next) {
  try {
    const { cartId } = req.params;
    const cart = await removePromoService(cartId);
    return res.status(200).json({ data: cart });
  } catch (err) {
    next(err);
  }
}

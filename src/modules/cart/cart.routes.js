import { Router } from 'express';
import {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyPromo,
  removePromo,
} from './cart.controller.js';
import { validateCreateCart, validateAddItem, validateUpdateItem, validateApplyPromo } from './cart.validator.js';

const router = Router();

// POST /carts
router.post('/', validateCreateCart, createCart);

// GET /carts/:cartId
router.get('/:cartId', getCart);

// POST /carts/:cartId/items
router.post('/:cartId/items', validateAddItem, addItem);

// PATCH /carts/:cartId/items/:itemId
router.patch('/:cartId/items/:itemId', validateUpdateItem, updateItem);

// DELETE /carts/:cartId/items/:itemId
router.delete('/:cartId/items/:itemId', removeItem);

// POST /carts/:cartId/promo
router.post('/:cartId/promo', validateApplyPromo, applyPromo);

// DELETE /carts/:cartId/promo
router.delete('/:cartId/promo', removePromo);

export default router;

import { Router } from 'express';
import {
  listOrders,
  getOrder,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  advanceOrder,
  createReturnRequest,
} from './orders.controller.js';
import { validateCancelOrder, validateAdvanceOrder, validateReturnRequest } from './orders.validator.js';

const router = Router();

// GET /orders
router.get('/', listOrders);

// GET /orders/:orderId
router.get('/:orderId', getOrder);

// GET /orders/:orderId/timeline
router.get('/:orderId/timeline', getOrderTimeline);

// GET /orders/:orderId/tracking
router.get('/:orderId/tracking', getOrderTracking);

// GET /orders/:orderId/refunds
router.get('/:orderId/refunds', getOrderRefunds);

// POST /orders/:orderId/cancel
router.post('/:orderId/cancel', validateCancelOrder, cancelOrder);

// POST /orders/:orderId/advance
router.post('/:orderId/advance', validateAdvanceOrder, advanceOrder);

// POST /orders/:orderId/return-requests
router.post('/:orderId/return-requests', validateReturnRequest, createReturnRequest);

export default router;

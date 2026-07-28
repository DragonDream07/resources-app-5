import { Router } from 'express';
import {
  initiateReturn,
  getReturnRequest,
  listReturnRequests,
  reviewReturnRequest,
} from './returns.controller.js';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate.js';
import {
  initiateReturnSchema,
  reviewReturnSchema,
  returnRequestParamsSchema,
  orderReturnParamsSchema,
  listReturnRequestsQuerySchema,
} from './returns.validator.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';

const router = Router();

// Customer: initiate a return for an order
router.post(
  '/orders/:orderId/return-requests',
  requireAuth,
  validateParams(orderReturnParamsSchema),
  validateBody(initiateReturnSchema),
  initiateReturn,
);

// Admin: list all return requests
router.get(
  '/return-requests',
  requireAuth,
  requireRole('admin'),
  validateQuery(listReturnRequestsQuerySchema),
  listReturnRequests,
);

// Admin / Customer: get a single return request by id
router.get(
  '/return-requests/:returnRequestId',
  requireAuth,
  validateParams(returnRequestParamsSchema),
  getReturnRequest,
);

// Admin: approve or reject a return request
router.post(
  '/return-requests/:returnRequestId/review',
  requireAuth,
  requireRole('admin'),
  validateParams(returnRequestParamsSchema),
  validateBody(reviewReturnSchema),
  reviewReturnRequest,
);

export default router;

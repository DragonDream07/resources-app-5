import * as returnsService from './returns.service.js';

/**
 * POST /orders/:orderId/return-requests
 * Initiate a return request for an order.
 */
export async function initiateReturn(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const payload = req.body;
    const returnRequest = await returnsService.initiateReturn({ orderId, userId, payload });
    return res.status(201).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests
 * List all return requests (admin).
 */
export async function listReturnRequests(req, res, next) {
  try {
    const query = req.query;
    const result = await returnsService.listReturnRequests(query);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests/:returnRequestId
 * Get a single return request by ID.
 */
export async function getReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const returnRequest = await returnsService.getReturnRequestById({
      returnRequestId,
      userId,
      userRole,
    });
    return res.status(200).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /return-requests/:returnRequestId/review
 * Admin approves or rejects a return request.
 */
export async function reviewReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const adminId = req.user.id;
    const payload = req.body;
    const updated = await returnsService.reviewReturnRequest({
      returnRequestId,
      adminId,
      payload,
    });
    return res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
}

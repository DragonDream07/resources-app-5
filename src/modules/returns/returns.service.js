import db from '../../db/index.js';
import { createAppError } from '../../utils/appError.js';

const RETURNABLE_STATUSES = ['delivered'];
const RETURN_WINDOW_DAYS = 30;

/**
 * Initiate a return request for an order.
 */
export async function initiateReturn({ orderId, userId, payload }) {
  const { reason, items, notes } = payload;

  // Fetch the order
  const order = await db('orders').where({ id: orderId }).first();
  if (!order) {
    throw createAppError('Order not found.', 404);
  }

  // Ownership check
  if (String(order.user_id) !== String(userId)) {
    throw createAppError('You do not have permission to initiate a return for this order.', 403);
  }

  // Eligibility: status
  if (!RETURNABLE_STATUSES.includes(order.status)) {
    throw createAppError(
      'Return requests can only be created for delivered orders.',
      422,
    );
  }

  // Eligibility: return window
  const deliveredAt = order.delivered_at ? new Date(order.delivered_at) : null;
  if (deliveredAt) {
    const windowMs = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - deliveredAt.getTime() > windowMs) {
      throw createAppError(
        `Return window of ${RETURN_WINDOW_DAYS} days has expired.`,
        422,
      );
    }
  }

  // Check for existing pending return request for this order
  const existing = await db('return_requests')
    .where({ order_id: orderId, status: 'pending' })
    .first();
  if (existing) {
    throw createAppError(
      'A pending return request already exists for this order.',
      409,
    );
  }

  const [returnRequest] = await db('return_requests')
    .insert({
      order_id: orderId,
      user_id: userId,
      reason,
      items: JSON.stringify(items || []),
      notes: notes || null,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');

  return returnRequest;
}

/**
 * List all return requests with optional filters (admin).
 */
export async function listReturnRequests(query) {
  const { status, page = 1, limit = 20 } = query;
  const offset = (Number(page) - 1) * Number(limit);

  let qb = db('return_requests').orderBy('created_at', 'desc');

  if (status) {
    qb = qb.where({ status });
  }

  const [{ count }] = await qb.clone().count('id as count');
  const items = await qb.offset(offset).limit(Number(limit));

  return {
    data: items,
    meta: {
      total: Number(count),
      page: Number(page),
      limit: Number(limit),
    },
  };
}

/**
 * Get a single return request by ID.
 * Admins can access any; customers can only access their own.
 */
export async function getReturnRequestById({ returnRequestId, userId, userRole }) {
  const returnRequest = await db('return_requests')
    .where({ id: returnRequestId })
    .first();

  if (!returnRequest) {
    throw createAppError('Return request not found.', 404);
  }

  if (userRole !== 'admin' && String(returnRequest.user_id) !== String(userId)) {
    throw createAppError('You do not have permission to view this return request.', 403);
  }

  return returnRequest;
}

/**
 * Admin reviews (approves or rejects) a return request.
 * On approval: trigger refund and update stock.
 */
export async function reviewReturnRequest({ returnRequestId, adminId, payload }) {
  const { decision, adminNotes } = payload;

  const returnRequest = await db('return_requests')
    .where({ id: returnRequestId })
    .first();

  if (!returnRequest) {
    throw createAppError('Return request not found.', 404);
  }

  if (returnRequest.status !== 'pending') {
    throw createAppError('Only pending return requests can be reviewed.', 422);
  }

  if (!['approved', 'rejected'].includes(decision)) {
    throw createAppError('Decision must be either approved or rejected.', 422);
  }

  const newStatus = decision;

  const [updated] = await db('return_requests')
    .where({ id: returnRequestId })
    .update({
      status: newStatus,
      reviewed_by: adminId,
      admin_notes: adminNotes || null,
      reviewed_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');

  if (decision === 'approved') {
    await triggerRefund(updated);
    await restoreStock(updated);
  }

  return updated;
}

/**
 * Trigger a refund for an approved return request.
 * Looks up the associated order's payment and issues a refund record.
 */
async function triggerRefund(returnRequest) {
  const order = await db('orders').where({ id: returnRequest.order_id }).first();
  if (!order) return;

  // Insert a refund record — actual payment gateway call would go via payments service
  await db('refunds').insert({
    order_id: returnRequest.order_id,
    return_request_id: returnRequest.id,
    amount: order.total_amount,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  });
}

/**
 * Restore stock for items in an approved return request.
 */
async function restoreStock(returnRequest) {
  let items = returnRequest.items;
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }

  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    const { sku_id, quantity } = item;
    if (!sku_id || !quantity) continue;
    await db('skus')
      .where({ id: sku_id })
      .increment('stock_quantity', quantity);
  }
}

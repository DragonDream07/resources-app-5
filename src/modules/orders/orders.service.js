import db from '../../db/index.js';

const ORDER_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};

export async function fetchOrders({ filters = {}, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (filters.userId) {
    values.push(filters.userId);
    conditions.push(`o.user_id = $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    conditions.push(`o.status = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);
  const limitClause = `$${values.length}`;
  values.push(offset);
  const offsetClause = `$${values.length}`;

  const { rows: orders } = await db.query(
    `SELECT o.*, u.email as user_email
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ${where}
     ORDER BY o.created_at DESC
     LIMIT ${limitClause} OFFSET ${offsetClause}`,
    values
  );

  const countValues = values.slice(0, conditions.length);
  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) FROM orders o ${where}`,
    countValues
  );

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total: Number(countRows[0].count),
    },
  };
}

export async function fetchOrderById({ orderId, userId }) {
  const conditions = ['o.id = $1'];
  const values = [orderId];

  if (userId) {
    values.push(userId);
    conditions.push(`o.user_id = $${values.length}`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const { rows } = await db.query(
    `SELECT o.*, u.email as user_email
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ${where}
     LIMIT 1`,
    values
  );

  return rows[0] || null;
}

export async function fetchOrderTimeline({ orderId, userId }) {
  const order = await fetchOrderById({ orderId, userId });
  if (!order) return null;

  const { rows: history } = await db.query(
    `SELECT status, note, created_at
     FROM order_status_history
     WHERE order_id = $1
     ORDER BY created_at ASC`,
    [orderId]
  );

  return { orderId, timeline: history };
}

export async function fetchOrderTracking({ orderId, userId }) {
  const order = await fetchOrderById({ orderId, userId });
  if (!order) return null;

  const { rows } = await db.query(
    `SELECT *
     FROM order_tracking
     WHERE order_id = $1
     LIMIT 1`,
    [orderId]
  );

  return rows[0] || { orderId, tracking: null };
}

export async function fetchOrderRefunds({ orderId, userId }) {
  const order = await fetchOrderById({ orderId, userId });
  if (!order) return null;

  const { rows } = await db.query(
    `SELECT *
     FROM refunds
     WHERE order_id = $1
     ORDER BY created_at DESC`,
    [orderId]
  );

  return { orderId, refunds: rows };
}

export async function cancelOrderById({ orderId, userId, reason, isAdmin }) {
  const order = await fetchOrderById({ orderId, userId });
  if (!order) return null;

  const allowedStatuses = ORDER_STATUS_TRANSITIONS[order.status] || [];
  if (!allowedStatuses.includes('cancelled')) {
    const err = new Error(`Order cannot be cancelled from status: ${order.status}.`);
    err.statusCode = 422;
    throw err;
  }

  const { rows } = await db.query(
    `UPDATE orders
     SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [orderId]
  );

  await writeOrderStatusHistory({
    orderId,
    status: 'cancelled',
    note: reason || (isAdmin ? 'Cancelled by admin.' : 'Cancelled by customer.'),
  });

  return rows[0];
}

export async function advanceOrderById({ orderId, status }) {
  const order = await fetchOrderById({ orderId, userId: null });
  if (!order) return null;

  const allowedStatuses = ORDER_STATUS_TRANSITIONS[order.status] || [];
  if (!allowedStatuses.includes(status)) {
    const err = new Error(
      `Cannot transition order from '${order.status}' to '${status}'.`
    );
    err.statusCode = 422;
    throw err;
  }

  const { rows } = await db.query(
    `UPDATE orders
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [orderId, status]
  );

  await writeOrderStatusHistory({ orderId, status, note: `Status advanced to ${status}.` });

  if (status === 'shipped') {
    await updateOrderTracking({ orderId, status });
  }

  return rows[0];
}

export async function createReturnRequestForOrder({ orderId, userId, items, reason }) {
  const order = await fetchOrderById({ orderId, userId });
  if (!order) return null;

  if (order.status !== 'delivered') {
    const err = new Error('Return requests can only be created for delivered orders.');
    err.statusCode = 422;
    throw err;
  }

  const { rows } = await db.query(
    `INSERT INTO return_requests (order_id, user_id, items, reason, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
     RETURNING *`,
    [orderId, userId, JSON.stringify(items), reason]
  );

  return rows[0];
}

export async function writeOrderStatusHistory({ orderId, status, note }) {
  await db.query(
    `INSERT INTO order_status_history (order_id, status, note, created_at)
     VALUES ($1, $2, $3, NOW())`,
    [orderId, status, note || null]
  );
}

export async function updateOrderTracking({ orderId, status, carrier, trackingNumber, estimatedDelivery }) {
  const existing = await db.query(
    `SELECT id FROM order_tracking WHERE order_id = $1 LIMIT 1`,
    [orderId]
  );

  if (existing.rows.length > 0) {
    await db.query(
      `UPDATE order_tracking
       SET status = COALESCE($2, status),
           carrier = COALESCE($3, carrier),
           tracking_number = COALESCE($4, tracking_number),
           estimated_delivery = COALESCE($5, estimated_delivery),
           updated_at = NOW()
       WHERE order_id = $1`,
      [orderId, status || null, carrier || null, trackingNumber || null, estimatedDelivery || null]
    );
  } else {
    await db.query(
      `INSERT INTO order_tracking (order_id, status, carrier, tracking_number, estimated_delivery, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [orderId, status || null, carrier || null, trackingNumber || null, estimatedDelivery || null]
    );
  }
}

export async function createOrder({ userId, items, addressId, promoCode, totalAmount, paymentMethod }) {
  const { rows } = await db.query(
    `INSERT INTO orders (user_id, items, address_id, promo_code, total_amount, payment_method, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW())
     RETURNING *`,
    [userId, JSON.stringify(items), addressId, promoCode || null, totalAmount, paymentMethod || null]
  );

  const order = rows[0];
  await writeOrderStatusHistory({ orderId: order.id, status: 'pending', note: 'Order created.' });

  return order;
}

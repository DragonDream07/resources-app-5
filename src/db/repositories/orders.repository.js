import db from '../client.js';

const ORDERS_TABLE = 'orders';
const ORDER_ITEMS_TABLE = 'order_items';
const STATUS_HISTORY_TABLE = 'order_status_history';
const TRACKING_TABLE = 'order_tracking';

// Orders
export async function findById(id) {
  return db(ORDERS_TABLE).where({ id }).first();
}

export async function findByIdAndUserId(id, userId) {
  return db(ORDERS_TABLE).where({ id, user_id: userId }).first();
}

export async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countByUserId(userId) {
  const [{ count }] = await db(ORDERS_TABLE).where({ user_id: userId }).count('id as count');
  return Number(count);
}

export async function findAll({ limit = 20, offset = 0, status } = {}) {
  const query = db(ORDERS_TABLE).select('*').orderBy('created_at', 'desc');
  if (status) query.where({ status });
  return query.limit(limit).offset(offset);
}

export async function countAll({ status } = {}) {
  const query = db(ORDERS_TABLE).count('id as count');
  if (status) query.where({ status });
  const [{ count }] = await query;
  return Number(count);
}

export async function createOrder(data, trx) {
  const qb = trx ? trx(ORDERS_TABLE) : db(ORDERS_TABLE);
  const [row] = await qb.insert(data).returning('*');
  return row;
}

export async function updateById(id, data, trx) {
  const qb = trx ? trx(ORDERS_TABLE) : db(ORDERS_TABLE);
  const [row] = await qb.where({ id }).update(data).returning('*');
  return row;
}

export async function findByOrderNumber(orderNumber) {
  return db(ORDERS_TABLE).where({ order_number: orderNumber }).first();
}

// Order items
export async function findItemsByOrderId(orderId) {
  return db(ORDER_ITEMS_TABLE).where({ order_id: orderId }).select('*');
}

export async function createOrderItems(items, trx) {
  const qb = trx ? trx(ORDER_ITEMS_TABLE) : db(ORDER_ITEMS_TABLE);
  return qb.insert(items).returning('*');
}

// Status history
export async function findStatusHistoryByOrderId(orderId) {
  return db(STATUS_HISTORY_TABLE)
    .where({ order_id: orderId })
    .orderBy('created_at', 'asc')
    .select('*');
}

export async function addStatusHistory(data, trx) {
  const qb = trx ? trx(STATUS_HISTORY_TABLE) : db(STATUS_HISTORY_TABLE);
  const [row] = await qb.insert(data).returning('*');
  return row;
}

// Order tracking
export async function findTrackingByOrderId(orderId) {
  return db(TRACKING_TABLE).where({ order_id: orderId }).first();
}

export async function upsertTracking(data, trx) {
  const qb = trx ? trx(TRACKING_TABLE) : db(TRACKING_TABLE);
  const existing = await db(TRACKING_TABLE).where({ order_id: data.order_id }).first();
  if (existing) {
    const [row] = await qb
      .where({ order_id: data.order_id })
      .update(data)
      .returning('*');
    return row;
  }
  const [row] = await qb.insert(data).returning('*');
  return row;
}

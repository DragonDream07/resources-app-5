import db from '../client.js';

const TABLE = 'return_requests';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).select('*');
}

export async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findAll({ limit = 20, offset = 0, status } = {}) {
  const query = db(TABLE).select('*').orderBy('created_at', 'desc');
  if (status) query.where({ status });
  return query.limit(limit).offset(offset);
}

export async function countAll({ status } = {}) {
  const query = db(TABLE).count('id as count');
  if (status) query.where({ status });
  const [{ count }] = await query;
  return Number(count);
}

export async function create(data, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb.insert(data).returning('*');
  return row;
}

export async function updateById(id, data, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb.where({ id }).update(data).returning('*');
  return row;
}

export async function findByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).first();
}

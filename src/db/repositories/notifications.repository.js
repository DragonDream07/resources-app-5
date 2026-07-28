import db from '../client.js';

const TABLE = 'notifications';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countUnreadByUserId(userId) {
  const [{ count }] = await db(TABLE)
    .where({ user_id: userId, is_read: false })
    .count('id as count');
  return Number(count);
}

export async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

export async function markAsReadById(id) {
  const [row] = await db(TABLE)
    .where({ id })
    .update({ is_read: true })
    .returning('*');
  return row;
}

export async function markAllAsReadByUserId(userId) {
  return db(TABLE)
    .where({ user_id: userId, is_read: false })
    .update({ is_read: true });
}

export async function findByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).first();
}

export async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

export async function countAll({ userId } = {}) {
  const query = db(TABLE).count('id as count');
  if (userId !== undefined) query.where({ user_id: userId });
  const [{ count }] = await query;
  return Number(count);
}

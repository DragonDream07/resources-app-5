import db from '../client.js';

const TABLE = 'addresses';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).first();
}

export async function findByUserId(userId) {
  return db(TABLE).where({ user_id: userId }).select('*');
}

export async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

export async function updateByIdAndUserId(id, userId, data) {
  const [row] = await db(TABLE)
    .where({ id, user_id: userId })
    .update(data)
    .returning('*');
  return row;
}

export async function deleteByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).delete();
}

export async function setDefaultAddress(userId, id) {
  await db(TABLE).where({ user_id: userId }).update({ is_default: false });
  const [row] = await db(TABLE)
    .where({ id, user_id: userId })
    .update({ is_default: true })
    .returning('*');
  return row;
}

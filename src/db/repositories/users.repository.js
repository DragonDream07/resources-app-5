import db from '../client.js';

const TABLE = 'users';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByEmail(email) {
  return db(TABLE).where({ email }).first();
}

export async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

export async function updateById(id, data) {
  const [row] = await db(TABLE).where({ id }).update(data).returning('*');
  return row;
}

export async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset).select('*');
}

export async function countAll() {
  const [{ count }] = await db(TABLE).count('id as count');
  return Number(count);
}

export async function updatePasswordById(id, passwordHash) {
  const [row] = await db(TABLE)
    .where({ id })
    .update({ password_hash: passwordHash })
    .returning('*');
  return row;
}

export async function findByResetToken(token) {
  return db(TABLE).where({ reset_password_token: token }).first();
}

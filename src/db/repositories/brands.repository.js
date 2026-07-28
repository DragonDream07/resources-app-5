import db from '../client.js';

const TABLE = 'brands';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findAll({ limit = 100, offset = 0 } = {}) {
  return db(TABLE).select('*').orderBy('name', 'asc').limit(limit).offset(offset);
}

export async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
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

export async function countAll() {
  const [{ count }] = await db(TABLE).count('id as count');
  return Number(count);
}

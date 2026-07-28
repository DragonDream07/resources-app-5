import db from '../client.js';

const TABLE = 'promo_codes';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByCode(code) {
  return db(TABLE).where({ code }).first();
}

export async function findAll({ limit = 50, offset = 0 } = {}) {
  return db(TABLE).select('*').orderBy('created_at', 'desc').limit(limit).offset(offset);
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

export async function incrementUsageCount(id, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb
    .where({ id })
    .increment('usage_count', 1)
    .returning('*');
  return row || null;
}

export async function findActiveByCode(code) {
  return db(TABLE)
    .where({ code, is_active: true })
    .where('valid_from', '<=', db.fn.now())
    .where(function () {
      this.whereNull('valid_until').orWhere('valid_until', '>=', db.fn.now());
    })
    .first();
}

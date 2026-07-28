import db from '../client.js';

const TABLE = 'skus';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByProductId(productId) {
  return db(TABLE).where({ product_id: productId }).select('*');
}

export async function findByIdAndProductId(id, productId) {
  return db(TABLE).where({ id, product_id: productId }).first();
}

export async function findBySku(sku) {
  return db(TABLE).where({ sku }).first();
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

/**
 * Atomically decrements stock_quantity for a SKU.
 * Returns the updated row, or null if insufficient stock.
 */
export async function decrementStock(id, quantity, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb
    .where('id', id)
    .where('stock_quantity', '>=', quantity)
    .decrement('stock_quantity', quantity)
    .returning('*');
  return row || null;
}

/**
 * Atomically increments stock_quantity (e.g. on cancel/return).
 */
export async function incrementStock(id, quantity, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb
    .where('id', id)
    .increment('stock_quantity', quantity)
    .returning('*');
  return row || null;
}

export async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids).select('*');
}

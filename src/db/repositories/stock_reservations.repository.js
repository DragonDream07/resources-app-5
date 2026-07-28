import db from '../client.js';

const TABLE = 'stock_reservations';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).select('*');
}

export async function findBySkuId(skuId) {
  return db(TABLE).where({ sku_id: skuId }).select('*');
}

export async function create(data, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb.insert(data).returning('*');
  return row;
}

export async function createMany(records, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  return qb.insert(records).returning('*');
}

export async function updateById(id, data, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb.where({ id }).update(data).returning('*');
  return row;
}

export async function deleteById(id, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  return qb.where({ id }).delete();
}

export async function deleteByOrderId(orderId, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  return qb.where({ order_id: orderId }).delete();
}

export async function findActiveBySkuId(skuId) {
  return db(TABLE).where({ sku_id: skuId, status: 'active' }).select('*');
}

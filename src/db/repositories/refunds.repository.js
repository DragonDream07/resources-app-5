import db from '../client.js';

const TABLE = 'refunds';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).orderBy('created_at', 'desc').select('*');
}

export async function findByPaymentAttemptId(paymentAttemptId) {
  return db(TABLE).where({ payment_attempt_id: paymentAttemptId }).select('*');
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

export async function findByGatewayRefundId(gatewayRefundId) {
  return db(TABLE).where({ gateway_refund_id: gatewayRefundId }).first();
}

import db from '../client.js';

const CARTS_TABLE = 'carts';
const ITEMS_TABLE = 'cart_items';

// Cart operations
export async function findCartById(id) {
  return db(CARTS_TABLE).where({ id }).first();
}

export async function findCartByUserId(userId) {
  return db(CARTS_TABLE).where({ user_id: userId }).first();
}

export async function findCartBySessionId(sessionId) {
  return db(CARTS_TABLE).where({ session_id: sessionId }).first();
}

export async function createCart(data) {
  const [row] = await db(CARTS_TABLE).insert(data).returning('*');
  return row;
}

export async function updateCartById(id, data) {
  const [row] = await db(CARTS_TABLE).where({ id }).update(data).returning('*');
  return row;
}

export async function deleteCartById(id) {
  return db(CARTS_TABLE).where({ id }).delete();
}

// Cart items operations
export async function findItemsByCartId(cartId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId }).select('*');
}

export async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

export async function findItemByCartIdAndSkuId(cartId, skuId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId, sku_id: skuId }).first();
}

export async function addItem(data) {
  const [row] = await db(ITEMS_TABLE).insert(data).returning('*');
  return row;
}

export async function updateItemById(id, data) {
  const [row] = await db(ITEMS_TABLE).where({ id }).update(data).returning('*');
  return row;
}

export async function deleteItemById(id) {
  return db(ITEMS_TABLE).where({ id }).delete();
}

export async function deleteItemsByCartId(cartId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId }).delete();
}

export async function findItemByIdAndCartId(id, cartId) {
  return db(ITEMS_TABLE).where({ id, cart_id: cartId }).first();
}

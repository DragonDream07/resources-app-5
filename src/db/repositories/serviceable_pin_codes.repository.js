import db from '../client.js';

const TABLE = 'serviceable_pin_codes';

export async function findByPinCode(pinCode) {
  return db(TABLE).where({ pin_code: pinCode }).first();
}

export async function isServiceable(pinCode) {
  const row = await findByPinCode(pinCode);
  return Boolean(row && row.is_active);
}

export async function findAll() {
  return db(TABLE).select('*');
}

export async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

export async function updateByPinCode(pinCode, data) {
  const [row] = await db(TABLE)
    .where({ pin_code: pinCode })
    .update(data)
    .returning('*');
  return row;
}

export async function deleteByPinCode(pinCode) {
  return db(TABLE).where({ pin_code: pinCode }).delete();
}

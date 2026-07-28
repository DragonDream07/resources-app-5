import db from '../../config/db.js';

/**
 * Fetch all addresses for a given user.
 */
export async function getAddressesByUserId(userId) {
  const { rows } = await db.query(
    `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * Fetch a single address by id, scoped to a user.
 */
export async function getAddressByIdAndUserId(addressId, userId) {
  const { rows } = await db.query(
    `SELECT * FROM addresses WHERE id = $1 AND user_id = $2`,
    [addressId, userId]
  );
  return rows[0] || null;
}

/**
 * Check whether a pin code is serviceable.
 */
export async function isPinCodeServiceable(pinCode) {
  const { rows } = await db.query(
    `SELECT 1 FROM serviceable_pin_codes WHERE pin_code = $1 LIMIT 1`,
    [pinCode]
  );
  return rows.length > 0;
}

/**
 * If the new address is marked as default, unset existing defaults for the user.
 */
async function clearDefaultAddress(userId, client) {
  await (client || db).query(
    `UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND is_default = TRUE`,
    [userId]
  );
}

/**
 * Create a new address for a user.
 * Handles default address promotion and optional serviceability check.
 */
export async function createAddressForUser(userId, payload) {
  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
    address_type,
  } = payload;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const makeDefault = is_default === true;

    if (makeDefault) {
      await clearDefaultAddress(userId, client);
    }

    const { rows } = await client.query(
      `INSERT INTO addresses
         (user_id, full_name, phone, address_line1, address_line2, city, state, pin_code, country, is_default, address_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        userId,
        full_name,
        phone,
        address_line1,
        address_line2 || null,
        city,
        state,
        pin_code,
        country || 'India',
        makeDefault,
        address_type || 'home',
      ]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Update an existing address for a user.
 * Handles default address promotion.
 */
export async function updateAddressForUser(addressId, userId, payload) {
  const existing = await getAddressByIdAndUserId(addressId, userId);
  if (!existing) return null;

  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
    address_type,
  } = payload;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const makeDefault = is_default === true;

    if (makeDefault) {
      await clearDefaultAddress(userId, client);
    }

    const { rows } = await client.query(
      `UPDATE addresses
       SET
         full_name    = COALESCE($1, full_name),
         phone        = COALESCE($2, phone),
         address_line1 = COALESCE($3, address_line1),
         address_line2 = $4,
         city         = COALESCE($5, city),
         state        = COALESCE($6, state),
         pin_code     = COALESCE($7, pin_code),
         country      = COALESCE($8, country),
         is_default   = COALESCE($9, is_default),
         address_type = COALESCE($10, address_type),
         updated_at   = NOW()
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [
        full_name || null,
        phone || null,
        address_line1 || null,
        address_line2 !== undefined ? address_line2 : existing.address_line2,
        city || null,
        state || null,
        pin_code || null,
        country || null,
        makeDefault !== undefined ? makeDefault : null,
        address_type || null,
        addressId,
        userId,
      ]
    );

    await client.query('COMMIT');
    return rows[0] || null;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Delete an address for a user.
 * Returns the deleted row or null if not found.
 */
export async function deleteAddressForUser(addressId, userId) {
  const { rows } = await db.query(
    `DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING *`,
    [addressId, userId]
  );
  return rows[0] || null;
}

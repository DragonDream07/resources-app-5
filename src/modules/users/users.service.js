import pool from '../../db/pool.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/AppError.js';

const SAFE_USER_FIELDS = `
  id,
  email,
  first_name,
  last_name,
  phone,
  role,
  is_active,
  created_at,
  updated_at
`;

export async function fetchMe(userId) {
  const { rows } = await pool.query(
    `SELECT ${SAFE_USER_FIELDS} FROM users WHERE id = $1`,
    [userId],
  );
  if (!rows[0]) {
    throw new AppError('User not found.', 404);
  }
  return rows[0];
}

export async function updateProfile(userId, payload) {
  const allowedFields = ['first_name', 'last_name', 'phone'];
  const updates = [];
  const values = [];
  let idx = 1;

  for (const field of allowedFields) {
    if (payload[field] !== undefined) {
      updates.push(`${field} = $${idx}`);
      values.push(payload[field]);
      idx += 1;
    }
  }

  if (updates.length === 0) {
    return fetchMe(userId);
  }

  updates.push(`updated_at = NOW()`);
  values.push(userId);

  const { rows } = await pool.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING ${SAFE_USER_FIELDS}`,
    values,
  );

  if (!rows[0]) {
    throw new AppError('User not found.', 404);
  }
  return rows[0];
}

export async function changeUserPassword(userId, { currentPassword, newPassword }) {
  const { rows } = await pool.query(
    `SELECT id, password_hash FROM users WHERE id = $1`,
    [userId],
  );

  const user = rows[0];
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 400);
  }

  const hash = await bcrypt.hash(newPassword, 12);

  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [hash, userId],
  );
}

export async function fetchAllUsers({ page, limit, role, search }) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];
  let idx = 1;

  if (role) {
    conditions.push(`role = $${idx}`);
    values.push(role);
    idx += 1;
  }

  if (search) {
    conditions.push(
      `(email ILIKE $${idx} OR first_name ILIKE $${idx} OR last_name ILIKE $${idx})`,
    );
    values.push(`%${search}%`);
    idx += 1;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM users ${where}`,
    values,
  );
  const total = Number(countResult.rows[0].count);

  const dataValues = [...values, limit, offset];
  const { rows } = await pool.query(
    `SELECT ${SAFE_USER_FIELDS} FROM users ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    dataValues,
  );

  return {
    data: rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function fetchUserById(userId) {
  const { rows } = await pool.query(
    `SELECT ${SAFE_USER_FIELDS} FROM users WHERE id = $1`,
    [userId],
  );
  if (!rows[0]) {
    throw new AppError('User not found.', 404);
  }
  return rows[0];
}

export async function updateUserById(userId, payload) {
  const allowedFields = ['first_name', 'last_name', 'phone', 'role', 'is_active'];
  const updates = [];
  const values = [];
  let idx = 1;

  for (const field of allowedFields) {
    if (payload[field] !== undefined) {
      updates.push(`${field} = $${idx}`);
      values.push(payload[field]);
      idx += 1;
    }
  }

  if (updates.length === 0) {
    return fetchUserById(userId);
  }

  updates.push(`updated_at = NOW()`);
  values.push(userId);

  const { rows } = await pool.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING ${SAFE_USER_FIELDS}`,
    values,
  );

  if (!rows[0]) {
    throw new AppError('User not found.', 404);
  }
  return rows[0];
}

export async function deleteUserById(userId) {
  const { rowCount } = await pool.query(
    `DELETE FROM users WHERE id = $1`,
    [userId],
  );
  if (rowCount === 0) {
    throw new AppError('User not found.', 404);
  }
}

import pool from '../../db/pool.js';

export async function getRoles() {
  const { rows } = await pool.query(
    'SELECT id, name, permissions, created_at, updated_at FROM roles ORDER BY name ASC'
  );
  return rows;
}

export async function getRoleById(roleId) {
  const { rows } = await pool.query(
    'SELECT id, name, permissions, created_at, updated_at FROM roles WHERE id = $1',
    [roleId]
  );
  return rows[0] || null;
}

export async function createNewRole({ name, permissions = [] }) {
  const { rows } = await pool.query(
    `INSERT INTO roles (name, permissions, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW())
     RETURNING id, name, permissions, created_at, updated_at`,
    [name, JSON.stringify(permissions)]
  );
  return rows[0];
}

export async function updateExistingRole(roleId, { name, permissions }) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (name !== undefined) {
    fields.push(`name = $${idx}`);
    values.push(name);
    idx += 1;
  }
  if (permissions !== undefined) {
    fields.push(`permissions = $${idx}`);
    values.push(JSON.stringify(permissions));
    idx += 1;
  }

  if (fields.length === 0) {
    return getRoleById(roleId);
  }

  fields.push(`updated_at = NOW()`);
  values.push(roleId);

  const { rows } = await pool.query(
    `UPDATE roles SET ${fields.join(', ')} WHERE id = $${idx}
     RETURNING id, name, permissions, created_at, updated_at`,
    values
  );
  return rows[0] || null;
}

export async function deleteExistingRole(roleId) {
  const { rowCount } = await pool.query(
    'DELETE FROM roles WHERE id = $1',
    [roleId]
  );
  return rowCount > 0;
}

export async function getRolesByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT r.id, r.name, r.permissions, r.created_at, r.updated_at
     FROM roles r
     INNER JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1
     ORDER BY r.name ASC`,
    [userId]
  );
  return rows;
}

export async function assignRole({ userId, roleId }) {
  const { rows } = await pool.query(
    `INSERT INTO user_roles (user_id, role_id, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id, role_id) DO NOTHING
     RETURNING user_id, role_id, created_at`,
    [userId, roleId]
  );
  return rows[0] || null;
}

export async function removeRole({ userId, roleId }) {
  const { rowCount } = await pool.query(
    'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
    [userId, roleId]
  );
  return rowCount > 0;
}

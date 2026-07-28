import db from '../../db/index.js';

/**
 * Reports: cross-domain aggregations.
 * Delegates to raw SQL aggregations across orders, users, products, returns.
 */
export async function fetchReports(query) {
  const [ordersStats] = await db.raw(`
    SELECT
      COUNT(*) AS total_orders,
      COALESCE(SUM(total_amount), 0) AS total_revenue,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_orders,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_orders
    FROM orders
  `);

  const [usersStats] = await db.raw(`
    SELECT
      COUNT(*) AS total_users,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) AS new_users_last_30_days
    FROM users
  `);

  const [productsStats] = await db.raw(`
    SELECT
      COUNT(*) AS total_products,
      COUNT(CASE WHEN is_active = true THEN 1 END) AS active_products
    FROM products
  `);

  const [returnsStats] = await db.raw(`
    SELECT
      COUNT(*) AS total_return_requests,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_returns
    FROM return_requests
  `);

  const orders = ordersStats && ordersStats.rows ? ordersStats.rows[0] : (Array.isArray(ordersStats) ? ordersStats[0] : {});
  const users = usersStats && usersStats.rows ? usersStats.rows[0] : (Array.isArray(usersStats) ? usersStats[0] : {});
  const products = productsStats && productsStats.rows ? productsStats.rows[0] : (Array.isArray(productsStats) ? productsStats[0] : {});
  const returns = returnsStats && returnsStats.rows ? returnsStats.rows[0] : (Array.isArray(returnsStats) ? returnsStats[0] : {});

  return {
    orders,
    users,
    products,
    returns,
  };
}

/**
 * Serviceable Pin Codes
 */
export async function fetchServiceablePinCodes(query) {
  const { page = 1, limit = 20, search } = query || {};
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  let qb = db('serviceable_pin_codes').select('*');

  if (search) {
    qb = qb.where('pin_code', 'like', `%${search}%`);
  }

  const total = await db('serviceable_pin_codes')
    .modify((builder) => {
      if (search) builder.where('pin_code', 'like', `%${search}%`);
    })
    .count('id as count')
    .first();

  const rows = await qb
    .orderBy('created_at', 'desc')
    .limit(parseInt(limit, 10))
    .offset(offset);

  return {
    items: rows,
    total: parseInt(total.count, 10),
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
}

export async function insertServiceablePinCode(body) {
  const { pin_code, city, state, is_active = true } = body;
  const [row] = await db('serviceable_pin_codes')
    .insert({ pin_code, city, state, is_active })
    .returning('*');
  return row;
}

export async function modifyServiceablePinCode(pinCodeId, body) {
  const { pin_code, city, state, is_active } = body;
  const updateData = {};
  if (pin_code !== undefined) updateData.pin_code = pin_code;
  if (city !== undefined) updateData.city = city;
  if (state !== undefined) updateData.state = state;
  if (is_active !== undefined) updateData.is_active = is_active;
  updateData.updated_at = db.fn.now();

  const [row] = await db('serviceable_pin_codes')
    .where({ id: pinCodeId })
    .update(updateData)
    .returning('*');
  return row || null;
}

export async function removeServiceablePinCode(pinCodeId) {
  await db('serviceable_pin_codes').where({ id: pinCodeId }).delete();
}

/**
 * Roles
 */
export async function fetchRoles(query) {
  const { page = 1, limit = 20 } = query || {};
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const total = await db('roles').count('id as count').first();
  const rows = await db('roles')
    .select('*')
    .orderBy('created_at', 'desc')
    .limit(parseInt(limit, 10))
    .offset(offset);

  return {
    items: rows,
    total: parseInt(total.count, 10),
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
}

export async function insertRole(body) {
  const { name, description } = body;
  const [row] = await db('roles')
    .insert({ name, description })
    .returning('*');
  return row;
}

export async function fetchRoleById(roleId) {
  const row = await db('roles').where({ id: roleId }).first();
  return row || null;
}

export async function modifyRole(roleId, body) {
  const { name, description } = body;
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  updateData.updated_at = db.fn.now();

  const [row] = await db('roles')
    .where({ id: roleId })
    .update(updateData)
    .returning('*');
  return row || null;
}

export async function removeRole(roleId) {
  await db('roles').where({ id: roleId }).delete();
}

/**
 * Role Permissions
 */
export async function fetchRolePermissions(roleId) {
  const rows = await db('role_permissions')
    .join('permissions', 'role_permissions.permission_id', 'permissions.id')
    .where('role_permissions.role_id', roleId)
    .select(
      'permissions.id',
      'permissions.name',
      'permissions.description',
      'permissions.resource',
      'permissions.action',
      'role_permissions.id as role_permission_id'
    );
  return rows;
}

export async function insertPermissionToRole(roleId, body) {
  const { permission_id } = body;
  const existing = await db('role_permissions')
    .where({ role_id: roleId, permission_id })
    .first();
  if (existing) {
    return existing;
  }
  const [row] = await db('role_permissions')
    .insert({ role_id: roleId, permission_id })
    .returning('*');
  return row;
}

export async function removePermissionFromRole(roleId, permissionId) {
  await db('role_permissions')
    .where({ role_id: roleId, permission_id: permissionId })
    .delete();
}

/**
 * Permissions
 */
export async function fetchPermissions(query) {
  const { page = 1, limit = 100, resource, action } = query || {};
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  let qb = db('permissions').select('*');
  if (resource) qb = qb.where({ resource });
  if (action) qb = qb.where({ action });

  const countQb = db('permissions').modify((builder) => {
    if (resource) builder.where({ resource });
    if (action) builder.where({ action });
  });

  const total = await countQb.count('id as count').first();
  const rows = await qb
    .orderBy('resource', 'asc')
    .orderBy('action', 'asc')
    .limit(parseInt(limit, 10))
    .offset(offset);

  return {
    items: rows,
    total: parseInt(total.count, 10),
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
}

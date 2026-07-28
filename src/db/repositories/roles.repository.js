import db from '../client.js';

const ROLES_TABLE = 'roles';
const USER_ROLES_TABLE = 'user_roles';

export async function findAllRoles() {
  return db(ROLES_TABLE).select('*');
}

export async function findRoleById(id) {
  return db(ROLES_TABLE).where({ id }).first();
}

export async function findRoleByName(name) {
  return db(ROLES_TABLE).where({ name }).first();
}

export async function createRole(data) {
  const [row] = await db(ROLES_TABLE).insert(data).returning('*');
  return row;
}

export async function assignRoleToUser(userId, roleId) {
  return db(USER_ROLES_TABLE)
    .insert({ user_id: userId, role_id: roleId })
    .onConflict(['user_id', 'role_id'])
    .ignore();
}

export async function removeRoleFromUser(userId, roleId) {
  return db(USER_ROLES_TABLE).where({ user_id: userId, role_id: roleId }).delete();
}

export async function findRolesByUserId(userId) {
  return db(USER_ROLES_TABLE)
    .join(ROLES_TABLE, `${ROLES_TABLE}.id`, `${USER_ROLES_TABLE}.role_id`)
    .where(`${USER_ROLES_TABLE}.user_id`, userId)
    .select(`${ROLES_TABLE}.*`);
}

export async function findUserIdsByRoleName(roleName) {
  return db(USER_ROLES_TABLE)
    .join(ROLES_TABLE, `${ROLES_TABLE}.id`, `${USER_ROLES_TABLE}.role_id`)
    .where(`${ROLES_TABLE}.name`, roleName)
    .select(`${USER_ROLES_TABLE}.user_id`);
}

export async function deleteUserRoles(userId) {
  return db(USER_ROLES_TABLE).where({ user_id: userId }).delete();
}

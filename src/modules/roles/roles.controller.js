import {
  getRoles,
  getRoleById,
  createNewRole,
  updateExistingRole,
  deleteExistingRole,
  assignRole,
  removeRole,
  getRolesByUserId,
} from './roles.service.js';

export async function listRoles(req, res, next) {
  try {
    const roles = await getRoles();
    return res.status(200).json({ roles });
  } catch (err) {
    next(err);
  }
}

export async function getRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const role = await getRoleById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(200).json({ role });
  } catch (err) {
    next(err);
  }
}

export async function createRole(req, res, next) {
  try {
    const { name, permissions } = req.body;
    const role = await createNewRole({ name, permissions });
    return res.status(201).json({ role });
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const { name, permissions } = req.body;
    const role = await updateExistingRole(roleId, { name, permissions });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(200).json({ role });
  } catch (err) {
    next(err);
  }
}

export async function deleteRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const deleted = await deleteExistingRole(roleId);
    if (!deleted) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getUserRoles(req, res, next) {
  try {
    const { userId } = req.params;
    const roles = await getRolesByUserId(userId);
    return res.status(200).json({ roles });
  } catch (err) {
    next(err);
  }
}

export async function assignRoleToUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;
    const userRole = await assignRole({ userId, roleId });
    return res.status(201).json({ userRole });
  } catch (err) {
    next(err);
  }
}

export async function removeRoleFromUser(req, res, next) {
  try {
    const { userId, roleId } = req.params;
    const removed = await removeRole({ userId, roleId });
    if (!removed) {
      return res.status(404).json({ message: 'User role association not found' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

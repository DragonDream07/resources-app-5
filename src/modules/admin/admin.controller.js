import {
  fetchReports,
  fetchServiceablePinCodes,
  insertServiceablePinCode,
  modifyServiceablePinCode,
  removeServiceablePinCode,
  fetchRoles,
  insertRole,
  fetchRoleById,
  modifyRole,
  removeRole,
  fetchRolePermissions,
  insertPermissionToRole,
  removePermissionFromRole as removeRolePermission,
  fetchPermissions,
} from './admin.service.js';

export async function getReports(req, res, next) {
  try {
    const reports = await fetchReports(req.query);
    res.status(200).json({ data: reports });
  } catch (err) {
    next(err);
  }
}

export async function getServiceablePinCodes(req, res, next) {
  try {
    const pinCodes = await fetchServiceablePinCodes(req.query);
    res.status(200).json({ data: pinCodes });
  } catch (err) {
    next(err);
  }
}

export async function createServiceablePinCode(req, res, next) {
  try {
    const pinCode = await insertServiceablePinCode(req.body);
    res.status(201).json({ data: pinCode });
  } catch (err) {
    next(err);
  }
}

export async function updateServiceablePinCode(req, res, next) {
  try {
    const { pinCodeId } = req.params;
    const pinCode = await modifyServiceablePinCode(pinCodeId, req.body);
    res.status(200).json({ data: pinCode });
  } catch (err) {
    next(err);
  }
}

export async function deleteServiceablePinCode(req, res, next) {
  try {
    const { pinCodeId } = req.params;
    await removeServiceablePinCode(pinCodeId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getRoles(req, res, next) {
  try {
    const roles = await fetchRoles(req.query);
    res.status(200).json({ data: roles });
  } catch (err) {
    next(err);
  }
}

export async function createRole(req, res, next) {
  try {
    const role = await insertRole(req.body);
    res.status(201).json({ data: role });
  } catch (err) {
    next(err);
  }
}

export async function getRoleById(req, res, next) {
  try {
    const { roleId } = req.params;
    const role = await fetchRoleById(roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json({ data: role });
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const role = await modifyRole(roleId, req.body);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json({ data: role });
  } catch (err) {
    next(err);
  }
}

export async function deleteRole(req, res, next) {
  try {
    const { roleId } = req.params;
    await removeRole(roleId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getRolePermissions(req, res, next) {
  try {
    const { roleId } = req.params;
    const permissions = await fetchRolePermissions(roleId);
    res.status(200).json({ data: permissions });
  } catch (err) {
    next(err);
  }
}

export async function addPermissionToRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const permission = await insertPermissionToRole(roleId, req.body);
    res.status(201).json({ data: permission });
  } catch (err) {
    next(err);
  }
}

export async function removePermissionFromRole(req, res, next) {
  try {
    const { roleId, permissionId } = req.params;
    await removeRolePermission(roleId, permissionId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getPermissions(req, res, next) {
  try {
    const permissions = await fetchPermissions(req.query);
    res.status(200).json({ data: permissions });
  } catch (err) {
    next(err);
  }
}

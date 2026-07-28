import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requireRole } from '../../middleware/requireRole.js';
import {
  getReports,
  getServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  getPermissions,
} from './admin.controller.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin'));

// Reports
router.get('/reports', getReports);

// Serviceable pin codes
router.get('/serviceable-pin-codes', getServiceablePinCodes);
router.post('/serviceable-pin-codes', createServiceablePinCode);
router.put('/serviceable-pin-codes/:pinCodeId', updateServiceablePinCode);
router.delete('/serviceable-pin-codes/:pinCodeId', deleteServiceablePinCode);

// Roles
router.get('/roles', getRoles);
router.post('/roles', createRole);
router.get('/roles/:roleId', getRoleById);
router.put('/roles/:roleId', updateRole);
router.delete('/roles/:roleId', deleteRole);

// Role permissions
router.get('/roles/:roleId/permissions', getRolePermissions);
router.post('/roles/:roleId/permissions', addPermissionToRole);
router.delete('/roles/:roleId/permissions/:permissionId', removePermissionFromRole);

// Permissions
router.get('/permissions', getPermissions);

export default router;

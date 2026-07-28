import { Router } from 'express';
import {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
} from './roles.controller.js';

const router = Router();

// Role CRUD
router.get('/', listRoles);
router.get('/:roleId', getRole);
router.post('/', createRole);
router.put('/:roleId', updateRole);
router.delete('/:roleId', deleteRole);

// User-role associations
router.get('/users/:userId/roles', getUserRoles);
router.post('/users/:userId/roles', assignRoleToUser);
router.delete('/users/:userId/roles/:roleId', removeRoleFromUser);

export default router;

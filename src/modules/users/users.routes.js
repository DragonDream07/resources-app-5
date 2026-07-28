import { Router } from 'express';
import {
  getMe,
  updateMe,
  changePassword,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} from './users.controller.js';
import {
  validateUpdateMe,
  validateChangePassword,
  validateUpdateUser,
} from './users.validator.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Current user routes
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validateUpdateMe, updateMe);
router.post('/me/change-password', authenticate, validateChangePassword, changePassword);

// Admin user management routes
router.get('/', authenticate, authorize('admin'), listUsers);
router.get('/:userId', authenticate, authorize('admin'), getUser);
router.patch('/:userId', authenticate, authorize('admin'), validateUpdateUser, updateUser);
router.delete('/:userId', authenticate, authorize('admin'), deleteUser);

export default router;

import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import {
  getNotifications,
  getNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
} from './notifications.controller.js';

const router = Router();

router.use(authenticate);

// GET /notifications
router.get('/', getNotifications);

// GET /notifications/:notificationId
router.get('/:notificationId', getNotificationById);

// POST /notifications/:notificationId/read
router.post('/:notificationId/read', markNotificationRead);

// POST /notifications/read-all
router.post('/read-all', markAllNotificationsRead);

export default router;

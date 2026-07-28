import {
  fetchNotifications,
  fetchNotificationById,
  markAsRead,
  markAllAsRead,
} from './notifications.service.js';

export async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const result = await fetchNotifications(userId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getNotificationById(req, res, next) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await fetchNotificationById(notificationId, userId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await markAsRead(notificationId, userId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

export async function markAllNotificationsRead(req, res, next) {
  try {
    const userId = req.user.id;
    await markAllAsRead(userId);
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
}

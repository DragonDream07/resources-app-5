import db from '../../db/index.js';

/**
 * Create a notification for a user.
 * Called by other services to dispatch notifications.
 *
 * @param {object} params
 * @param {string|number} params.userId
 * @param {string} params.type
 * @param {string} params.title
 * @param {string} params.body
 * @param {object} [params.metadata]
 * @returns {Promise<object>} Created notification record
 */
export async function createNotification({ userId, type, title, body, metadata = null }) {
  const [notification] = await db('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      body,
      metadata: metadata ? JSON.stringify(metadata) : null,
      is_read: false,
      created_at: new Date(),
    })
    .returning('*');
  return notification;
}

/**
 * Fetch paginated notifications for a user.
 *
 * @param {string|number} userId
 * @param {object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @returns {Promise<{data: object[], total: number, page: number, limit: number, unreadCount: number}>}
 */
export async function fetchNotifications(userId, { page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;

  const [{ count }] = await db('notifications')
    .where({ user_id: userId })
    .count('id as count');

  const [{ count: unreadCount }] = await db('notifications')
    .where({ user_id: userId, is_read: false })
    .count('id as count');

  const data = await db('notifications')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');

  return {
    data,
    total: parseInt(count, 10),
    page,
    limit,
    unreadCount: parseInt(unreadCount, 10),
  };
}

/**
 * Fetch a single notification by id, scoped to a user.
 *
 * @param {string|number} notificationId
 * @param {string|number} userId
 * @returns {Promise<object|null>}
 */
export async function fetchNotificationById(notificationId, userId) {
  const notification = await db('notifications')
    .where({ id: notificationId, user_id: userId })
    .first();
  return notification || null;
}

/**
 * Get unread notification count for a user.
 *
 * @param {string|number} userId
 * @returns {Promise<number>}
 */
export async function getUnreadCount(userId) {
  const [{ count }] = await db('notifications')
    .where({ user_id: userId, is_read: false })
    .count('id as count');
  return parseInt(count, 10);
}

/**
 * Mark a single notification as read.
 *
 * @param {string|number} notificationId
 * @param {string|number} userId
 * @returns {Promise<object|null>}
 */
export async function markAsRead(notificationId, userId) {
  const [updated] = await db('notifications')
    .where({ id: notificationId, user_id: userId })
    .update({ is_read: true })
    .returning('*');
  return updated || null;
}

/**
 * Mark all notifications as read for a user.
 *
 * @param {string|number} userId
 * @returns {Promise<void>}
 */
export async function markAllAsRead(userId) {
  await db('notifications')
    .where({ user_id: userId, is_read: false })
    .update({ is_read: true });
}

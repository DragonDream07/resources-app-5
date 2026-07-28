import { useState, useEffect, useCallback, useRef } from 'react';

const POLL_INTERVAL_MS = 30000;

async function fetchNotifications() {
  const token = localStorage.getItem('token');
  const response = await fetch('/notifications', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
}

async function markNotificationRead(notificationId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`/notifications/${notificationId}/read`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
  return response.json();
}

async function markAllRead() {
  const token = localStorage.getItem('token');
  const response = await fetch('/notifications/read-all', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
  return response.json();
}

export function useNotifications() {
  const [list, setList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      const notifications = data.notifications ?? data.data ?? data ?? [];
      setList(notifications);
      setUnreadCount(notifications.filter((n) => !n.read).length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    intervalRef.current = setInterval(loadNotifications, POLL_INTERVAL_MS);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [loadNotifications]);

  const markRead = useCallback(
    async (notificationId) => {
      try {
        await markNotificationRead(notificationId);
        setList((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        setError(err.message);
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllRead();
      setList((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { list, unreadCount, markRead, markAllAsRead, loading, error };
}

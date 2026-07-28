import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, token } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const computeUnread = useCallback((list) => {
    return list.filter((n) => !n.readAt && !n.read_at).length;
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.notifications || data.data || [];
      setNotifications(list);
      setUnreadCount(computeUnread(list));
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, computeUnread]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated || !token) return;
    try {
      await fetch(`/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, readAt: new Date().toISOString(), read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silently fail; UI can retry
    }
  }, [isAuthenticated, token]);

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      await fetch('/notifications/read-all', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const now = new Date().toISOString();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: now, read_at: now }))
      );
      setUnreadCount(0);
    } catch {
      // silently fail; UI can retry
    }
  }, [isAuthenticated, token]);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      setUnreadCount(computeUnread(updated));
      return updated;
    });
  }, [computeUnread]);

  const resetNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setError(null);
  }, []);

  // Fetch notifications when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      resetNotifications();
    }
  }, [isAuthenticated, fetchNotifications, resetNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    resetNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}

export default NotificationContext;

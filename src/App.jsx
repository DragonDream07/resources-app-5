import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Auth Context
// ---------------------------------------------------------------------------
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }, []);

  const value = { user, token, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Cart Context
// ---------------------------------------------------------------------------
const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() => localStorage.getItem('cart_id') || null);
  const [cartCount, setCartCount] = useState(0);

  const setCart = useCallback((id, count = 0) => {
    setCartId(id);
    setCartCount(count);
    if (id) {
      localStorage.setItem('cart_id', id);
    } else {
      localStorage.removeItem('cart_id');
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartId(null);
    setCartCount(0);
    localStorage.removeItem('cart_id');
  }, []);

  const value = { cartId, cartCount, setCartCount, setCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Notifications Context
// ---------------------------------------------------------------------------
const NotificationsContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationsContext);
}

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setNotifications((prev) => [{ ...notification, id }, ...prev]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const value = {
    notifications,
    unreadCount,
    setUnreadCount,
    addNotification,
    removeNotification,
    markAllRead,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Placeholder pages — real pages are implemented in their own modules
// ---------------------------------------------------------------------------
function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-neutral-500 text-lg">404 — Page not found</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<div className="p-8 text-neutral-700">Home</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

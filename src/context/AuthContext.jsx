import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const persistToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(newToken);
  }, []);

  const persistUser = useCallback((newUser) => {
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUser(newUser);
  }, []);

  const login = useCallback((newToken, newUser) => {
    persistToken(newToken);
    persistUser(newUser);
  }, [persistToken, persistUser]);

  const logout = useCallback(() => {
    persistToken(null);
    persistUser(null);
  }, [persistToken, persistUser]);

  const updateUser = useCallback((updatedUser) => {
    persistUser(updatedUser);
  }, [persistUser]);

  const isAuthenticated = Boolean(token);
  const isAdmin = Boolean(user && user.roles && user.roles.includes('admin'));

  const value = {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateUser,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;

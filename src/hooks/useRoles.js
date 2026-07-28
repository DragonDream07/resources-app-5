import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function useRoles() {
  const { user } = useAuth();

  const roles = user?.roles ?? user?.role_names ?? [];

  const hasRole = useCallback(
    (role) => {
      if (!roles || roles.length === 0) return false;
      if (Array.isArray(role)) {
        return role.some((r) => roles.includes(r));
      }
      return roles.includes(role);
    },
    [roles]
  );

  const isAdmin = hasRole('admin');
  const isCustomer = hasRole('customer');
  const isGuest = !user;

  return { roles, hasRole, isAdmin, isCustomer, isGuest };
}

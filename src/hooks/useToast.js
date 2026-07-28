import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  const { showToast, hideToast } = context;

  const toast = {
    success: (message, options = {}) =>
      showToast({ message, type: 'success', ...options }),
    error: (message, options = {}) =>
      showToast({ message, type: 'error', ...options }),
    info: (message, options = {}) =>
      showToast({ message, type: 'info', ...options }),
    warning: (message, options = {}) =>
      showToast({ message, type: 'warning', ...options }),
    show: (message, options = {}) =>
      showToast({ message, type: 'info', ...options }),
  };

  return { toast, showToast, hideToast };
}

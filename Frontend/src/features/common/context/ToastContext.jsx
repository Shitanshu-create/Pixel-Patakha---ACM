import { useState, useCallback } from 'react';
import Toast from '../../../components/ui/Toast.jsx';
import ToastContext from './ToastContext.js';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, dur) => addToast({ message: msg, type: 'success', duration: dur }),
    error: (msg, dur) => addToast({ message: msg, type: 'error', duration: dur }),
    warning: (msg, dur) => addToast({ message: msg, type: 'warning', duration: dur }),
    info: (msg, dur) => addToast({ message: msg, type: 'info', duration: dur }),
    showSuccess: (msg, dur) => addToast({ message: msg, type: 'success', duration: dur }),
    showError: (msg, dur) => addToast({ message: msg, type: 'error', duration: dur }),
    showWarning: (msg, dur) => addToast({ message: msg, type: 'warning', duration: dur }),
    showInfo: (msg, dur) => addToast({ message: msg, type: 'info', duration: dur }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { useToast } from './ToastContext.js';
export default ToastProvider;

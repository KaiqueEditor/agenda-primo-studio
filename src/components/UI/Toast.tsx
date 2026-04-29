import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export const toast = {
  success: (message: string) => {
    const t: Toast = { id: ++toastId, message, type: 'success' };
    listeners.forEach(fn => fn(t));
  },
  error: (message: string) => {
    const t: Toast = { id: ++toastId, message, type: 'error' };
    listeners.forEach(fn => fn(t));
  },
  info: (message: string) => {
    const t: Toast = { id: ++toastId, message, type: 'info' };
    listeners.forEach(fn => fn(t));
  },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== t.id));
      }, 3000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle size={16} />}
          {t.type === 'error' && <AlertTriangle size={16} />}
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = `${Date.now()}-${toastIdCounter++}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast border border-white/10 ${toast.type}`}>
            <span className="text-sm font-medium">
              {toast.type === 'success' && '🟢 '}
              {toast.type === 'info' && '🔵 '}
              {toast.type === 'warning' && '🟡 '}
              {toast.type === 'error' && '🔴 '}
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

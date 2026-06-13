import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
    dismiss: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-brand-success" />,
    error: <AlertCircle className="w-5 h-5 text-brand-danger" />,
    info: <Info className="w-5 h-5 text-brand-cyan" />,
    warning: <AlertTriangle className="w-5 h-5 text-brand-warning" />,
  };

  const bgColors = {
    success: 'bg-dark-800 border-brand-success/30 shadow-brand-success/5',
    error: 'bg-dark-800 border-brand-danger/30 shadow-brand-danger/5',
    info: 'bg-dark-800 border-brand-cyan/30 shadow-brand-cyan/5',
    warning: 'bg-dark-800 border-brand-warning/30 shadow-brand-warning/5',
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container portal */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`flex items-start gap-3 p-4 border rounded-xl shadow-xl backdrop-blur-md pointer-events-auto ${bgColors[t.type]}`}
            >
              <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
              <div className="flex-grow text-sm font-medium text-dark-100 pr-4">
                {t.message}
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-shrink-0 text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
export default ToastContext;

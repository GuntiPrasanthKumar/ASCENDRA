import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { create } from 'zustand';

// Simple toast store
export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const icons = {
    success: <CheckCircle className="text-success w-5 h-5" />,
    warning: <AlertTriangle className="text-warning w-5 h-5" />,
    error: <XCircle className="text-error w-5 h-5" />,
    info: <Info className="text-accent w-5 h-5" />,
  };

  const borderColors = {
    success: 'border-success/30',
    warning: 'border-warning/30',
    error: 'border-error/30',
    info: 'border-accent/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`glass pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border ${borderColors[toast.type]} shadow-lg min-w-[250px] max-w-[350px]`}
    >
      {icons[toast.type]}
      <p className="text-sm font-medium text-textPrimary flex-1">{toast.message}</p>
      <button onClick={onRemove} className="text-textMuted hover:text-textPrimary transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default ToastContainer;

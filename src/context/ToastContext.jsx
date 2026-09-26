import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Portal */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
          width: '90%',
          maxWidth: '440px'
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              padding: '14px 20px',
              backgroundColor: '#111111',
              color: '#FDFCFA',
              border: '1px solid rgba(197, 168, 128, 0.4)',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="#C5A880" />}
              {toast.type === 'error' && <AlertCircle size={18} color="#E53E3E" />}
              {toast.type === 'info' && <Info size={18} color="#3182CE" />}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.04em' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: '#8E8A83', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

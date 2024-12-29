import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenExpiredEvent } from '../api';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (message: string, type: Notification['type']) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const navigate = useNavigate();

  const showNotification = (message: string, type: Notification['type']) => {
    setNotification({ message, type });
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    // Listen for token expired event
    const handleTokenExpired = (event: Event) => {
      const customEvent = event as CustomEvent;
      showNotification(customEvent.detail.message, 'error');
      navigate('/');
    };

    window.addEventListener('tokenExpired', handleTokenExpired);

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [navigate]);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
      {/* Notification Component */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            notification.type === 'error'
              ? 'bg-red-500/10 border border-red-500/50 text-red-500'
              : notification.type === 'success'
              ? 'bg-green-500/10 border border-green-500/50 text-green-500'
              : 'bg-blue-500/10 border border-blue-500/50 text-blue-500'
          }`}
        >
          <div className="flex items-center">
            <span>{notification.message}</span>
            <button
              onClick={hideNotification}
              className="ml-4 text-current hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}; 
import React, { useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification';

const Notification = () => {
  const { notification } = useNotification();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        // The notification will be cleared by the hook
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div className={`custom-notification ${notification.type === 'error' ? 'error-notification' : 'success-notification'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {notification.type === 'success' && (
            <i className="fas fa-check-circle mr-3"></i>
          )}
          {notification.type === 'error' && (
            <i className="fas fa-exclamation-circle mr-3"></i>
          )}
          <span>{notification.message}</span>
        </div>
        <button 
          className="ml-4 text-white hover:text-gray-200 transition-colors"
          onClick={() => {
            // This will be handled by the hook context
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Notification;
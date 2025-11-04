import React, { createContext, useState, useContext, useCallback } from 'react';

// Create the context
const NotificationContext = createContext();

// Custom hook to use notification
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    // Clear any existing notification first
    setNotification(null);
    
    // Use setTimeout to ensure the state is cleared before setting new one
    setTimeout(() => {
      setNotification({ message, type });
      
      // Auto hide after duration
      const timer = setTimeout(() => {
        setNotification(null);
      }, duration);
      
      // Cleanup function
      return () => clearTimeout(timer);
    }, 50);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const value = {
    showNotification, 
    hideNotification, 
    notification 
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Component */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-fade-in">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : notification.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-700'
                : notification.type === 'warning'
                ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                : 'bg-blue-50 border-blue-500 text-blue-700'
            }`}
          >
            <div className="flex items-center w-full">
              {/* Icon based on notification type */}
              <div className={`mr-3 text-lg ${
                notification.type === 'success' ? 'text-green-500' :
                notification.type === 'error' ? 'text-red-500' :
                notification.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
              }`}>
                {notification.type === 'success' && '✓'}
                {notification.type === 'error' && '✕'}
                {notification.type === 'warning' && '⚠'}
                {notification.type === 'info' && 'ℹ'}
              </div>
              
              <span className="font-medium flex-1 text-sm">{notification.message}</span>
              
              <button
                onClick={hideNotification}
                className={`ml-4 text-lg font-bold hover:scale-110 transition-transform ${
                  notification.type === 'success' ? 'text-green-600 hover:text-green-800' :
                  notification.type === 'error' ? 'text-red-600 hover:text-red-800' :
                  notification.type === 'warning' ? 'text-yellow-600 hover:text-yellow-800' :
                  'text-blue-600 hover:text-blue-800'
                }`}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Export the context itself
export default NotificationContext;
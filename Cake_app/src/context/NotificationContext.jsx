import React, { createContext, useState, useContext } from 'react';

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

  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ message, type });
    
    // Auto hide after duration
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ 
      showNotification, 
      hideNotification, 
      notification 
    }}>
      {children}
      
      {/* Notification Component */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : notification.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-700'
                : notification.type === 'warning'
                ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                : 'bg-blue-50 border-blue-500 text-blue-700'
            }`}
          >
            <span className="font-medium flex-1">{notification.message}</span>
            <button
              onClick={hideNotification}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Export the context itself
export default NotificationContext;
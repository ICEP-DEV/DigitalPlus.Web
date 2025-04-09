// NotificationContext.js
import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' // 'success' or 'error'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 7000);
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, closeNotification }}>
      {children}
      {notification.show && (
        <div className="global-notification" style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '15px 25px',
            borderRadius: '8px',
            backgroundColor: notification.type === 'success' ? '#4CAF50' : '#F44336',
            color: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '300px',
            position: 'fixed',
          }}>
            <span>{notification.message}</span>
          
          </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
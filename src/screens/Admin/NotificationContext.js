// NotificationContext.js
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import styles from './Notification.module.css';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success',
    duration: 7000,
    isClosing: false
  });

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (notification.show && !notification.isClosing) {
      timerRef.current = setTimeout(() => {
        closeNotification();
      }, notification.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [notification.show, notification.isClosing, notification.duration]);

  const showNotification = (message, options = {}) => {
    const { type = 'success', duration = 7000 } = options;
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setNotification({ 
      show: true, 
      message, 
      type,
      duration,
      isClosing: false 
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isClosing: true }));
    
    timerRef.current = setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 500);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  // Calculate progress bar style
  const getProgressBarStyle = () => ({
    animation: `progressBar ${notification.duration}ms linear forwards`,
    animationPlayState: notification.isClosing ? 'paused' : 'running'
  });

  return (
    <NotificationContext.Provider value={{ showNotification, closeNotification }}>
      {children}
      {notification.show && (
        <div 
          className={`
            ${styles.notification} 
            ${styles[notification.type]}
            ${notification.isClosing ? styles.notificationClosing : ''}
          `}
        >
          <span className={styles.icon}>{getIcon(notification.type)}</span>
          {notification.message}
          <div 
            className={styles.progressBar} 
            style={getProgressBarStyle()}
          />
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
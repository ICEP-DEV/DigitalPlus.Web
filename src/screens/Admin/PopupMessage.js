import React from 'react';
import styles from './PopupMessage.module.css';

const PopupMessage = ({ message, type, onClose }) => {
  return (
    <div className={`${styles.popupMessage} ${type === 'error' ? styles.error : styles.success}`}>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>×</button>
    </div>
  );
};

export default PopupMessage;

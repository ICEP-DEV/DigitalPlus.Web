import React from 'react';
import styles from './MentorCreatedPopup.module.css'; // Import the CSS module

const MentorCreatedPopup = ({ onClose }) => {
  return (
    <div className={styles.mentorCreatedPopup}>
      <div className={styles.popupContent}>
        <span className={styles.closeButton} onClick={onClose}>X</span>
        <h2>Mentor Created Successfully</h2>
      </div>
    </div>
  );
};

export default MentorCreatedPopup;

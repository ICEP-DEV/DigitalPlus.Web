import React, { useState } from 'react';
import styles from './LogoutComponent.module.css'; // Import the CSS module
import { useNavigate } from 'react-router-dom';
import SideBarNavBar from './Navigation/SideBarNavBar';

const LogoutComponent = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const handleYesClick = () => {
    setShowMessage(true);
    // Redirect to the landing page after a brief delay
    setTimeout(() => {
      navigate('/');
    }, 2000); // 2 seconds delay
  };

  const handleNoClick = () => {
    // Go back to the dashboard
    navigate('/mentee-dashboard/home');
  };

  return (
    <SideBarNavBar>
      <div className={styles.logoutContainer}>
        <div className={styles.logoutContent}>
          <div className={styles.questionIcon}>?</div>
          <h2>ARE YOU SURE YOU WANT TO LOG OUT?</h2>
          <div className={styles.logoutButtons}>
            <button className={styles.yesButton} onClick={handleYesClick}>YES</button>
            <button className={styles.noButton} onClick={handleNoClick}>NO</button>
          </div>
          {showMessage && <div className={styles.confirmationMessage}>You have been logged out thank you for visiting our site. Redirecting...</div>}
        </div>
      </div>
    </SideBarNavBar>
  );
};

export default LogoutComponent;

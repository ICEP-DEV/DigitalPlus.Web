import React from 'react';
import styles from './LogoutComponent.module.css'; // Import the CSS module
import { useNavigate } from 'react-router-dom';
import SideBarNavBar from './Navigation/SideBarNavBar';

const LogoutComponent = () => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    // Redirect to the landing page
    navigate('/');
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
       </div>
     </div>
    </SideBarNavBar>
  );
};

export default LogoutComponent;

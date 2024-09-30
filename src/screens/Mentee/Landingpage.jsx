import React from "react";
import styles from './Landingpage.module.css'; // Import the CSS module
import SideBarNavBar from './Navigation/SideBarNavBar';
import './LogoutComponent.module.css';

function Landing() {
  return (
    <SideBarNavBar>
      <div className={styles.container}>
        <h1 className={styles.heading}>Hello</h1>
        <p className={styles.welcomeText}>Welcome to the Mentee Dashboard</p>
        <p className={styles.paragraph}>
          Here you can track your progress, communicate with your mentor, and access all the necessary tools for your academic journey.
        </p>
      </div>
    </SideBarNavBar>
  );
}

export default Landing;

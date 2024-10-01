import React from "react";
import styles from './Landingpage.module.css'; // Import the CSS module
import SideBarNavBar from './Navigation/SideBarNavBar';
import './LogoutComponent.module.css';

function Landing() {
  // Retrieve and parse the user object from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {}; // Fallback to an empty object if user is not available

  return (
    <SideBarNavBar>
      <div className={styles.container}>
        <h1 className={styles.heading}>Hello, {user.firstName}!</h1> {/* Use firstName from the user object */}
        <p className={styles.welcomeText}>Welcome to the {user.role} Dashboard</p> {/* Use the user's role */}
        <p className={styles.paragraph}>
          Here you can track your progress, communicate with your mentor, and access all the necessary tools for your academic journey.
        </p>
      </div>
    </SideBarNavBar>
  );
}

export default Landing;

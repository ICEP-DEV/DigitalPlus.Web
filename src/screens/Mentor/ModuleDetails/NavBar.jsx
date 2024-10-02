import React from 'react';
import styles from './NavBar.module.css'; // Import the CSS module
import imageLogo from '../Assets/tutLogo-removebg-preview.png'; // Adjust the path based on your structure

function NavBar() {
  return (
    <div className={styles.navBar}>
      <img src={imageLogo} alt="Logo" className={styles.appLogo} />
    </div>
  );
}

export default NavBar;

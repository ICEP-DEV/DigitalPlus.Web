import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Profile icon
import styles from './Header.module.css';  // Import the CSS module
import logo from '../Assets/TUT_Logo_Transparent.png';  // Adjust the path as necessary

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="TUT Logo" />
      </div>
      <div className={styles.nav}>
        <ul>
          <li><Link to="/about">AboutUs</Link></li>
        </ul>
      </div>
      <div className={styles.profile}>
        <Link to="/profile" className={styles.profileLink}>
          <FaUserCircle className={styles.profileIcon} />
          <div className={styles.profileInfo}>
            <span className={styles.name}>John Doe</span> {/* Replace with dynamic data if needed */}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;

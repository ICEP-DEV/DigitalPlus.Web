import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';  // Import the CSS module
import logo from '../../Assets/TUT_Logo_Transparent.png';  // Adjust the path as necessary

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="TUT Logo" />
      </div>
      <div className={styles.nav}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/work">Work</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;

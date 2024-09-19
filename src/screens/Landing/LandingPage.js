import React from 'react';
import { Link } from 'react-router-dom';
import logoTUT from '../../Assets/TUT_Logo_Transparent.png';
import background from '../../Assets/Background.jpg';
import styles from './LandingPage.module.css'; // Import the CSS module

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <img src={background} alt="Background" className={styles.background} />
      <img src={logoTUT} alt="TUT Logo" className={styles.tutLogo} />
      <nav className={styles.navigation}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/aboutPage">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li className={styles.loginButton}><Link to="/login">Sign In</Link></li>
        </ul>
      </nav>
      <div className={styles.mentorLogoWrapper}>
        {/* Your content here */}
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useEffect, useState } from 'react';
import tutLogo from '../Header/Assets/tutLogo.png';
import styles from './VideoLandingPageHeader.module.css';

const RosterHeader = () => {
  const [loaded, setLoaded] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`} 
    style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
      <div className={styles.logoContainer}>
        <a href="/">
          <img
            src={tutLogo}
            alt="TUT Logo"
            className={`${styles.logo2} ${loaded ? styles.logo2Loaded : ''}`}
          />
        </a>
      </div>

  
      <nav className={`${styles.nav} ${loaded ? styles.navLoaded : ''}`}>
  <a
    href="/"
    className={`${styles.navLink} ${loaded ? styles.slideIn : ''}`}
    style={{ transitionDelay: '0.1s' }}
  >
    <span className={styles.linkText}>
      HOME
    </span>
  </a>
  <a
    href="/login"
    className={`${styles.navLink} ${loaded ? styles.slideIn : ''}`}
    style={{ transitionDelay: '0.4s' }}
  >
    <span className={styles.linkText}>
      LOGIN
    </span>
  </a>
</nav>



    </header>
  );
};

export default RosterHeader;

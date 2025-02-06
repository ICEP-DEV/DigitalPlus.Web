
import React, { useEffect, useState } from 'react';
import tutLogo from '../Header/Assets/tutLogo.png';
import styles from './VideoLandingPageHeader.module.css';

const VideoLandingPageHeader = () => {
  const [loaded, setLoaded] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setScrolled(currentScrollPos > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.logoContainer}>
        <a href="#carousel-section">
          <img
            src={tutLogo}
            alt="TUT Logo"
            className={`${styles.logo2} ${loaded ? styles.logo2Loaded : ''}`}
          />
        </a>
      </div>

      <nav className={`${styles.nav} ${loaded ? styles.navLoaded : ''}`}>
  {['HOME', 'ABOUT', 'SERVICES'].map((link) => (
    <a 
      key={link}
      href="/"
      className={`${styles.navLink} ${loaded ? styles.navLinkLoaded : ''}`}
    >
      {link}
    </a>
  ))}
  <a
    href="/login"
    className={`${styles.navLink} ${loaded ? styles.navLinkLoaded : ''}`}
  >
    LOGIN
  </a>
</nav>
    </header>
  );
};

export default VideoLandingPageHeader;

import React, { useEffect, useState } from 'react';
import tutLogo from '../Header/Assets/tutLogo.png';
import styles from './VideoLandingPageHeader.module.css';

const VideoLandingPageHeader = () => {
  const [loaded, setLoaded] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Check scroll direction
      if (prevScrollPos > currentScrollPos) {
        setIsScrollingUp(true); // Show header on scroll up
      } else {
        setIsScrollingUp(false); // Hide header on scroll down
      }
      
      // Check if user has scrolled enough to trigger the effect
      setScrolled(currentScrollPos > 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ''} ${!isScrollingUp ? styles.headerHidden : ''}`}
    >
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
          <div
            key={link}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredLink(link)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <a
              href={link === 'HOME' ? `#carousel-section` : `#${link.toLowerCase()}-section`}
              className={`${styles.navLink} ${loaded ? styles.navLinkLoaded : ''}`}
            >
              {link}
            </a>
            <div className={`${styles.underline} ${hoveredLink === link ? styles.underlineHovered : ''}`} />
          </div>
        ))}
        <a
          href="/login"
          className={`${styles.navLink} ${loaded ? styles.navLinkLoaded : ''}`}
          onMouseEnter={() => setHoveredLink('LOGIN')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          LOGIN
          <div className={`${styles.underline} ${hoveredLink === 'LOGIN' ? styles.underlineHovered : ''}`} />
        </a>
      </nav>
    </header>
  );
};

export default VideoLandingPageHeader;

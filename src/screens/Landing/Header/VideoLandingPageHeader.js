import React, { useEffect, useState } from 'react';
import tutLogo from '../Header/Assets/tutLogo.png';
import fullLogoWhite from '../Assets/fullLogoWhite.jpg';
import { Nav } from 'react-bootstrap';
import styles from './VideoLandingPageHeader.module.css';

const VideoLandingPageHeader = () => {
  const [loaded, setLoaded] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);

    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
        <Nav.Link 
          href="/login"
          className={`${styles.navLink} ${loaded ? styles.navLinkLoaded : ''}`}
          onMouseEnter={() => setHoveredLink('LOGIN')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          LOGIN
          <div className={`${styles.underline} ${hoveredLink === 'LOGIN' ? styles.underlineHovered : ''}`} />
        </Nav.Link>
      </nav>
    </header>
  );
};

export default VideoLandingPageHeader;

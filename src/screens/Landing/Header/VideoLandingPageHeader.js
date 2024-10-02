import React, { useEffect, useState } from 'react';
import tutLogo from '../Header/Assets/tutLogo.png';
import fullLogoWhite from '../Assets/fullLogoWhite.jpg';
import { Nav } from 'react-bootstrap';

const VideoLandingPageHeader = () => {
  const [loaded, setLoaded] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Add scroll event listener to track scrolling
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headingStyle = {
    color: 'white',
    fontSize: '1rem',
    zIndex: 2,
    marginLeft: '20px',
    textDecoration: 'none', // Remove default underline
    opacity: loaded ? 1 : 0,
    transition: 'opacity 1s ease-in-out',
    position: 'relative', // Necessary for the animated underline
  };

  const animatedUnderlineStyle = (isHovered) => ({
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '2px', // Height of the underline
    backgroundColor: '#fff', // Color of the underline
    left: 0,
    bottom: '-2px', // Position below the text
    transform: isHovered ? 'scaleX(1)' : 'scaleX(0)', // Scale effect for animation
    transition: 'transform 0.3s ease', // Animation timing
  });

  const logoStyle2 = {
    width: '300px',
    height: '60px',
    marginRight: '20px',
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateX(0)' : 'translateX(-50px)',
    transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
  };

  const logoStyle = {
    width: '200px',
    height: 'auto',
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateX(0)' : 'translateX(50px)',
    transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
  };

  // Change header background and styling when scrolled
  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: scrolled ? 'rgba(6, 7, 8, 0.7)' : 'rgba(6, 7, 8, 0.7)',
    height: '60px',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    boxShadow: scrolled ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    opacity: loaded ? 1 : 0,
    transition: 'opacity 1.5s ease-in-out',
  };

  return (
    <header className="header" style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Scroll to the carousel section when the logo is clicked */}
        <a href="#carousel-section">
          <img src={tutLogo} alt="TUT Logo" style={logoStyle2} />
        </a>
        {/* <img src={fullLogoWhite} alt="Logo" style={logoStyle} /> */}
      </div>
      <nav style={navStyle}>
        {/* Scroll to the respective sections when the links are clicked */}
        {['HOME', 'ABOUT', 'SERVICES'].map((link) => (
          <div 
            key={link} 
            style={{ position: 'relative' }} // Position relative for underline
            onMouseEnter={() => setHoveredLink(link)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <a href={link === 'HOME' ? `#carousel-section` : `#${link.toLowerCase()}-section`} style={headingStyle}>
              {link}
            </a>
            <div style={animatedUnderlineStyle(hoveredLink === link)} />
          </div>
        ))}
        <Nav.Link 
          href="/login" 
          style={{ ...headingStyle, position: 'relative' }} 
          onMouseEnter={() => setHoveredLink('LOGIN')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          LOGIN
          <div style={animatedUnderlineStyle(hoveredLink === 'LOGIN')} />
        </Nav.Link>
      </nav>
    </header>
  );
};

export default VideoLandingPageHeader;

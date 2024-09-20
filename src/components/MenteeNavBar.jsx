// src/components/Navigation.js

import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaCalendarAlt, FaUserPlus, FaCommentDots, FaRobot, FaCog, FaSignOutAlt } from 'react-icons/fa';
import styles from './MenteeNavBar.module.css'; // Create a CSS file for the navigation component if needed

const Navigation = () => {
  const [navWidth, setNavWidth] = useState(250); // Default width
  const navRef = useRef(null);

  const handleMouseDown = (e) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newWidth = e.clientX;
    if (newWidth > 100 && newWidth < window.innerWidth - 100) {
      setNavWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (navRef.current) {
      navRef.current.style.width = `${navWidth}px`;
    }
  }, [navWidth]);

  return (
    <nav className={styles.sideNav} ref={navRef}>
      <ul>
        <li>
          <FaHome className={styles.navIcon} />
          <Link to="/">Home</Link>
        </li>
        <li>
          <FaBook className={styles.navIcon} />
          <Link to="/module">Module</Link>
        </li>
        <li>
          <FaCalendarAlt className={styles.navIcon} />
          <Link to="/booking">Booking</Link>
        </li>
        <li>
          <FaUserPlus className={styles.navIcon} />
          <Link to="/register">Register</Link>
        </li>
        <li>
          <FaCommentDots className={styles.navIcon} />
          <Link to="/feedback">Feedback</Link>
        </li>
        <li>
          <FaRobot className={styles.navIcon} />
          <Link to="/ai">Use AI</Link>
        </li>
        <li>
          <FaCog className={styles.navIcon} />
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <FaSignOutAlt className={styles.navIcon} />
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
      <div className={styles.resizer} onMouseDown={handleMouseDown} />
    </nav>
  );
};

export default Navigation;

import React, { useState } from 'react';
import { FaBell, FaKey } from 'react-icons/fa';
import tutLogo from '../Assets/tutLogo.png';
import Logo1 from '../Assets/Logo1.png';
import tumelo from '../Assets/tumelo.jpg';
import styles from './HeaderAnnouncementPage.module.css'; // Import the CSS module

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search Query:', searchQuery);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={tutLogo} alt="Tshwane University of Technology" className={styles.logoStyle2} />
        <img src={Logo1} alt="Logo" className={styles.logoStyle} />
      </div>

      <div className={styles.searchBarContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className={styles.inputStyle}
          />
          <button type="submit" className={styles.buttonStyle}>
            Search
          </button>
        </form>
      </div>

      <div className={styles.iconContainer}>
        <FaKey className={styles.keyIcon} />
        <FaBell className={styles.bellIcon} />
        <a href="/MentorProfile">
          <img src={tumelo} alt="Profile" className={styles.tumeloStyle} />
        </a>
      </div>
    </header>
  );
};

export default Header;

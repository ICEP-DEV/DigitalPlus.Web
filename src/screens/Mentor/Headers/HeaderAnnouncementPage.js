import React, { useState } from 'react';
import { FaBell, FaKey } from 'react-icons/fa'; // Import FaBell and FaKey
import tutLogo from '../Assets/tutLogo.png';
// import tutLogo-removebg-preview from '../Assets/tutLogo-removebg-preview.png';
import tutLogo_removebg_preview from '../Assets/tutLogo_removebg_preview.png'
import Logo1 from '../Assets/Logo1.png';
import tumelo from '../Assets/tumelo.jpg'; // Import your additional image

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle search logic here
    console.log('Search Query:', searchQuery);
  };

  // Flex container for the header elements
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Spread items across the row
    backgroundColor: '#000C24', // Optional: add background color
    padding: '10px',
    height: '100px',
    boxSizing: 'border-box',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Space between logos
  };

  const logoStyle2 = {
    width: '180px', // Adjust logo size
    height: 'auto',
  };

  const logoStyle = {
    width: '200px', // Adjust logo size
    height: 'auto',
  };

  const searchBarContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '400px', // Limit the search bar width
    flex: 1, // Allow it to grow and fill available space
  };

  const inputStyle = {
    border: 'none',
    padding: '10px 15px',
    fontSize: '1rem',
    borderRadius: '25px 0 0 25px', // Rounded corners on the left
    outline: 'none',
    width: '100%', // Take full available width
  };

  const buttonStyle = {
    border: 'none',
    backgroundColor: '#0E4C79',
    color: 'white',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '0 25px 25px 0', // Rounded corners on the right
    fontSize: '1rem',
  };

  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Space between icons
  };

  const bellIconStyle = {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  };

  const keyIconStyle = {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  };

  const tumeloStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%', // Optional: make the image round
    cursor: 'pointer',
  };

  return (
    <header className="header" style={headerStyle}>
      <div style={logoContainerStyle}>
        <img src={tutLogo} alt="Tshwane University of Technology" style={logoStyle2} />
        <img src={Logo1} alt="Logo" style={logoStyle} />
      </div>

      <div style={searchBarContainerStyle}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Search
          </button>
        </form>
      </div>

      <div style={iconContainerStyle}>
        <FaKey style={keyIconStyle} />
        <FaBell style={bellIconStyle} />
        <a href="/MentorProfile">
          <img src={tumelo} alt="Profile" style={tumeloStyle} />
        </a>
      </div>
    </header>
  );
};

export default Header;

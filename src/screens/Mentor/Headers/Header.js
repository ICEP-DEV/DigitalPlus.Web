import React from 'react';
import tutLogo from '../images/tutLogo.png';
import Logo1 from '../images/Logo1.png';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {

  const headingStyle = {
    position: 'absolute',
    top: '20px',
    left: '55%',
    color: 'white',
    fontSize: '1.5rem',
    zIndex: 1
};
const headingStyle1 = {
    position: 'absolute',
    top: '20px',
    left: '65%',
    color: 'white',
    fontSize: '1.5rem',
    zIndex: 1
};
const headingStyle2 = {
    position: 'absolute',
    top: '20px',
    left: '75%',
    color: 'white',
    fontSize: '1.5rem',
    zIndex: 1
};
const headingStyle3 = {
    position: 'absolute',
    top: '20px',
    left: '87%',
    color: 'white',
    fontSize: '1.5rem',
    zIndex: 1
};

const logoStyle2 = {
  position: 'absolute',
  left: '10px',
  top: '0px',
  width: '400px',
  height: '90px'
};
const logoStyle = {
  position: 'absolute',
  left: '450px',
  top: '-3px',
  width: '250px',
  height: '118px'
};



  return (
    <header className="header">
      <div>
        {/* <img src="tutLogo.png" alt="Tshwane University of Technology" /> */}
         <img src={Logo1} alt="Logo" style={logoStyle} /> 
        <img src={tutLogo} alt="Logo" style={logoStyle2} /> 
      </div>
      <nav>
      <a href="/home" style={headingStyle}>Home</a>
                    <a href="/about" style={headingStyle1}>About</a>
                    <a href="/services" style={headingStyle2}>Services</a>
                    <Nav.Link href="/login" style={headingStyle3}>Sign In</Nav.Link>
      </nav>
    </header>
  );
}

export default Header;

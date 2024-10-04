
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Importing social media icons
import FooterLogo from '../Assets/FooterLogo.png'; // Import the footer logo image

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <div
      style={{
        backgroundColor: '#000', // Dark background for the footer
        color: '#fff',
        padding: '40px 20px', // Adequate padding for the footer
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Top Section: Logo and Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '1200px', // Footer width similar to the image
          width: '100%',
          flexWrap: 'wrap',
          paddingBottom: '20px',
          borderBottom: '1px solid #555', // Divider line between footer sections
        }}
      >
        {/* Logo and Description */}
        <div style={{ flex: '1', minWidth: '200px', textAlign: 'left' }}>
          {/* Add logo image */}
          <img src={FooterLogo} alt="Footer Logo" style={{ width: '200px', marginBottom: '10px', marginTop:'50px', height:'50px' }} />
          <p style={{ color: '#aaa' }}>
           
          </p>
        </div>

        {/* Useful Links */}
        <div style={{ flex: '1', minWidth: '200px', textAlign: 'left' }}>
          <h4 style={{ color: '#fff', fontSize: '18px', marginBottom: '15px' }}>Useful Links</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="#content" style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px' }}>myTutor</a></li>
            <li><a href="#how-it-works" style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px' }}>Student / Staff Email</a></li>
            <li><a href="#create" style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px' }}>Student Password Reset</a></li>
            <li><a href="#explore" style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px' }}>Staff iEnabler</a></li>
            <li><a href="#terms" style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px' }}>Tshwane University of Technology</a></li>
          </ul>
        </div>

        {/* Services Links */}
        <div style={{ flex: '1', minWidth: '200px', textAlign: 'left' }}>
          <h4 style={{ color: '#fff', fontSize: '18px', marginBottom: '15px' }}>Services</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="#help-center" style={{ color: '#aaa', textDecoration: 'none' }}></a></li>
            <li><a href="#partners" style={{ color: '#aaa', textDecoration: 'none' }}></a></li>
            <li><a href="#suggestions" style={{ color: '#aaa', textDecoration: 'none' }}></a></li>
            <li><a href="#blog" style={{ color: '#aaa', textDecoration: 'none' }}></a></li>
            <li><a href="#newsletters" style={{ color: '#aaa', textDecoration: 'none' }}></a></li>
          </ul>
        </div>

        {/* Contact */}
        <div style={{ flex: '1', minWidth: '200px', textAlign: 'left' }}>
          <h4 style={{ color: '#fff', fontSize: '18px', marginBottom: '15px' }}>Contact</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px' }}>Tel: 086 110 2421</li>
            <li style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px' }}>Email: general@tut.ac.za</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section: Copyright and Social Media */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#aaa', margin: '10px 0' }}>
          Copyright &copy; {currentYear}: DIGITAL PLUS
        </p>

        {/* Social Media Icons */}
        <div style={{ fontSize: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
            <FaFacebook />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
            <FaTwitter />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;

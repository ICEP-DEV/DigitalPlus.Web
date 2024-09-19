import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerSection}>
        <h3>FOLLOW US</h3>
        <a href="#" className={styles.socialLink}>
          <i className="fab fa-linkedin"></i> LinkedIn
        </a>
        <a href="#" className={styles.socialLink}>
          <i className="fab fa-facebook"></i> Facebook
        </a>
      </div>
      <div className={styles.footerSection}>
        <h3>QUICK LINKS</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><a href="#">About</a></li>
          <li><Link to="/login">Sign In</Link></li>
          <li><a href="#">Mentee Reset Password</a></li>
          <li><a href="#">Book Appointment</a></li>
          <li><a href="#">Roster</a></li>
        </ul>
      </div>
      <div className={styles.footerSection}>
        <h3>CONTACTS</h3>
        <p><i className="fas fa-phone-alt"></i> 0732345678</p>
        <p><i className="fas fa-fax"></i> +1457903129</p>
        <p><i className="fas fa-envelope"></i> wementor123@gmail.com</p>
      </div>
      <div className={styles.footerLogo}>
        <img src="path_to_logo.png" alt="We Mentor Logo" />
      </div>
    </footer>
  );
};

export default Footer;

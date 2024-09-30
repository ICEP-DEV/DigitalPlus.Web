import React from "react";
import styles from "./NavBar.module.css"; // Import the CSS module
import imageLogo from "../Assets/tutLogo-removebg-preview.png";
import { BsPersonFill } from "react-icons/bs";

function NavBar() {
  return (
    <div className={styles.navBar}> {/* Use module class */}
      <br />
      <img src={imageLogo} alt="Logo" className={styles.appLogo} /> {/* Add class if needed */}

      {/* Profile Icon with description */}
      <div className={styles.profileContainer}> {/* Use module class */}
        <BsPersonFill className={styles.profileIcon} /> {/* Use module class */}
        <span className={styles.profileText}>PROFILE</span> {/* Use module class */}
      </div>
    </div>
  );
}

export default NavBar;

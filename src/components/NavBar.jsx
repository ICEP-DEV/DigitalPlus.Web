import React from "react";
import styles from "./NavBar.module.css"; // Import CSS module
import imageLogo from "../Assets/TUT_Logo_Transparent.png";
import { BsPersonFill } from "react-icons/bs";

function NavBar() {
  return (
    <div className={styles.navBar}> {/* Use the renamed class */}
      <br />
      <img src={imageLogo} alt="Logo" className={styles.appLogo} /> {/* Adjust if you have styles for logo */}

      {/* Profile Icon with description */}
      <div className={styles.profileContainer}> {/* Use the renamed class */}
        <BsPersonFill className={styles.profileIcon} /> {/* Use the renamed class */}
        <span className={styles.profileText}>PROFILE</span> {/* Use the renamed class */}
      </div>
    </div>
  );
}

export default NavBar;

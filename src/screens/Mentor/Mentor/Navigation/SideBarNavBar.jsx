import React from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import styles from "./SideBarNavBar.module.css"; // Import the module CSS

function SideBarNavBar({ children }) {
  return (
    <div className={styles.appContainer}>
      <SideBar />
      <div className={styles.mainContent}>
        <NavBar />
        {children}
      </div>
    </div>
  );
}

export default SideBarNavBar;

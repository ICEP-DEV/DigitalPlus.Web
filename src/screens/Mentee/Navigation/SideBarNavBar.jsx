import React from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import styles from "./SideBarNavBar.module.css"; // Import the updated module CSS

function SideBarNavBar({ children }) {
  return (
    <div className={styles.scrollableContainer}> {/* Use module class */}
      <SideBar />
      <div className="main-content">
        <NavBar />
        {children}
      </div>
    </div>
  );
}

export default SideBarNavBar;

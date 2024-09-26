import { useState } from "react"; // Import useState for managing state
import { IoHome, IoSettingsSharp } from "react-icons/io5"; // Import icons
import { BsBookmarkCheckFill } from "react-icons/bs";
import { MdMenuBook, MdLogout } from "react-icons/md";
import { RiContactsBook3Fill, RiRobot2Fill } from "react-icons/ri";
import { HiLightBulb } from "react-icons/hi";
import styles from "./SideBar.module.css"; // Import the styles object from CSS Modules

function SideBar({ setActivePage }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle the collapse state of the sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.sideBarWrapper}>
      <div className={`${styles.sideBar} ${isCollapsed ? styles.collapsed : ""}`}>
        <nav className={styles.navLinks}>
          {/* Hamburger button to toggle collapse */}
          <button className={styles.hamburger} onClick={toggleSidebar}>
            ☰
          </button>

          {/* Sidebar navigation items */}
          <div className={styles.navItem}>
            {!isCollapsed && <span>HOME</span>}
            <IoHome className={styles.icon} />
          </div>

          <div className={styles.navItem}>
            {!isCollapsed && <span>MODULES</span>}
            <MdMenuBook className={styles.icon} />
          </div>

          <div className={styles.navItem}>
            {!isCollapsed && <span>BOOKINGS</span>}
            <IoHome className={styles.icon} />
          </div>

          <div className={styles.navItem}>
            {!isCollapsed && <span>REGISTER</span>}
            <BsBookmarkCheckFill className={styles.icon} />
          </div>

          <div className={styles.navItem}>
            {!isCollapsed && <span>REPORT</span>}
            <RiContactsBook3Fill className={styles.icon} />
          </div>

          <div className={styles.navItem}>
            {!isCollapsed && <span>USE AI</span>}
            <RiRobot2Fill className={styles.icon} />
          </div>

          <div className={styles.navItem}>
            {!isCollapsed && <span>QUIZZES</span>}
            <HiLightBulb className={styles.icon} />
          </div>

          <div className={styles.navItem}>
            {!isCollapsed && <span>SETTINGS</span>}
            <IoSettingsSharp className={styles.icon} />
          </div>

          <div className={styles.navItem}>
            {!isCollapsed && <span>LOGOUT</span>}
            <MdLogout className={styles.icon} />
          </div>
        </nav>
      </div>
    </div>
  );
}

export default SideBar;

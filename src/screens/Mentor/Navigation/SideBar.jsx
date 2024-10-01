import { useState } from "react";
import { IoHome, IoSettingsSharp } from "react-icons/io5";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { MdMenuBook, MdLogout } from "react-icons/md";
import { RiContactsBook3Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import styles from "./SideBar.module.css"; // Import the CSS module

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();  // Use navigate

  // Toggle the collapse state of the sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.sideBarWrapper} ${isCollapsed ? styles.collapsed : ""}`}>
      {/* Hamburger button to toggle collapse */}
      <button className={styles.hamburger} onClick={toggleSidebar}>
        ☰
      </button>

      <nav className={styles.navLinks}>
        {/* Sidebar navigation items */}
        <div className={styles.navItem} onClick={() => navigate('n')}>
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>HOME</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/module')}>
          <MdMenuBook className={styles.icon} />
          {!isCollapsed && <span>MODULES</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/bookings')}>
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>BOOKINGS</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/register')}>
          <BsBookmarkCheckFill className={styles.icon} />
          {!isCollapsed && <span>REGISTER</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/report')}>
          <RiContactsBook3Fill className={styles.icon} />
          {!isCollapsed && <span>REPORT</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/settings')}>
          <IoSettingsSharp className={styles.icon} />
          {!isCollapsed && <span>SETTINGS</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/logout')}>
          <MdLogout className={styles.icon} />
          {!isCollapsed && <span>LOGOUT</span>}
        </div>
      </nav>
    </div>
  );
}

export default SideBar;

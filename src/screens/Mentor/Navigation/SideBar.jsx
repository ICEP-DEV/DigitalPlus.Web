import { useState } from "react";
import { IoHome, IoSettingsSharp } from "react-icons/io5";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { MdMenuBook, MdLogout } from "react-icons/md";
import { RiContactsBook3Fill } from "react-icons/ri";
import { FaRegCalendarAlt } from "react-icons/fa";  // Import calendar icon
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import styles from "./SideBar.module.css"; // Import the CSS module

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();  

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
        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/announcementpage')}>
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>ANNOUCE</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/roster')}>
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>ROSTER</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/module')}>
          <MdMenuBook className={styles.icon} />
          {!isCollapsed && <span>MODULES</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/bookings')}>
          <RiContactsBook3Fill className={styles.icon} />
          {!isCollapsed && <span>BOOKINGS</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/calendar')}>
          <FaRegCalendarAlt className={styles.icon} />
          {!isCollapsed && <span>CALENDAR</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/register')}>
          <BsBookmarkCheckFill className={styles.icon} />
          {!isCollapsed && <span>REGISTER</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/report')}>
          <RiContactsBook3Fill className={styles.icon} />
          {!isCollapsed && <span>REPORT</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/setting')}>
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

import { useState, useEffect } from "react";
import { IoHome, IoListOutline, IoSettingsSharp } from "react-icons/io5";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { MdMenuBook, MdLogout } from "react-icons/md";
import { RiContactsBook3Fill } from "react-icons/ri";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import styles from "./SideBar.module.css"; // Import the CSS module

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();  
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Set the active item based on the current path
    setActiveItem(location.pathname);
  }, [location.pathname]); // Run this effect when the pathname changes

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className={`${styles.sideBarWrapper} ${isCollapsed ? styles.collapsed : ""}`}>
      <button className={styles.hamburger} onClick={toggleSidebar}>
        ☰
      </button>

      <nav className={styles.navLinks}>
        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/announcementpage' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/announcementpage')}>
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>ANNOUNCE</span>}
        </div>

        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/roster' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/roster')}>
          <IoListOutline className={styles.icon} />
          {!isCollapsed && <span>ROSTER</span>}
        </div>

        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/module' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/module')}>
          <MdMenuBook className={styles.icon} />
          {!isCollapsed && <span>MODULES</span>}
        </div>

        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/bookings' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/bookings')}>
          <RiContactsBook3Fill className={styles.icon} />
          {!isCollapsed && <span>BOOKINGS</span>}
        </div>

        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/calendar' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/calendar')}>
          <FaRegCalendarAlt className={styles.icon} />
          {!isCollapsed && <span>CALENDAR</span>}
        </div>

        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/register' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/register')}>
          <BsBookmarkCheckFill className={styles.icon} />
          {!isCollapsed && <span>REGISTER</span>}
        </div>

        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/report' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/report')}>
          <RiContactsBook3Fill className={styles.icon} />
          {!isCollapsed && <span>REPORT</span>}
        </div>

        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/setting' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/setting')}>
          <IoSettingsSharp className={styles.icon} />
          {!isCollapsed && <span>SETTINGS</span>}
        </div>

        <div className={`${styles.navItem} ${activeItem === '/mentor-dashboard/logout' ? styles.active : ''}`} 
             onClick={() => handleNavigation('/mentor-dashboard/logout')}>
          <MdLogout className={styles.icon} />
          {!isCollapsed && <span>LOGOUT</span>}
        </div>
      </nav>
    </div>
  );
}

export default SideBar;

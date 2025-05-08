import { useState } from "react";
import { IoHome, IoSettingsSharp, IoListOutline } from "react-icons/io5";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { MdMenuBook, MdLogout, MdFeedback } from "react-icons/md";
import { RiContactsBook3Fill, RiRobot2Fill } from "react-icons/ri";
import { useNavigate, useLocation } from 'react-router-dom';
import styles from "./SideBar.module.css";

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route location

  // Toggle the collapse state of the sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to determine if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`${styles.sideBarWrapper} ${isCollapsed ? styles.sideBarCollapsed : ""}`}>
      {/* Hamburger button to toggle collapse */}
      <button className={styles.hamburger} onClick={toggleSidebar}>
        ☰
      </button>

      <nav className={styles.navLinks}>
        {/* Sidebar navigation items */}
        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/home') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/home')}
        >
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>HOME</span>}
        </div>

        {/* VIEW ROSTER item */}
        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/roster') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/roster')}
        >
          <IoListOutline className={styles.icon} />
          {!isCollapsed && <span>ROSTER</span>}
        </div>

        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/modules') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/modules')}
        >
          <MdMenuBook className={styles.icon} />
          {!isCollapsed && <span>MODULES</span>}
        </div>

        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/bookings') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/bookings')}
        >
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>BOOKING</span>}
        </div>

        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/RegisterPage') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/RegisterPage')}
        >
          <BsBookmarkCheckFill className={styles.icon} />
          {!isCollapsed && <span>REGISTER</span>}
        </div>

        {/* FEEDBACK item */}
        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/feedback') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/feedback')}
        >
          <MdFeedback className={styles.icon} />
          {!isCollapsed && <span>COMPLAIN</span>}
        </div>

        {/* USE AI item */}
        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/ai-tools') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/ai-tools')}
        >
          <RiRobot2Fill className={styles.icon} />
          {!isCollapsed && <span>USE AI</span>}
        </div>

        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/settings') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/settings')}
        >
          <IoSettingsSharp className={styles.icon} />
          {!isCollapsed && <span>SETTINGS</span>}
        </div>

        <div 
          className={`${styles.navItem} ${isActive('/mentee-dashboard/logout') ? styles.active : ''}`} 
          onClick={() => navigate('/mentee-dashboard/logout')}
        >
          <MdLogout className={styles.icon} />
          {!isCollapsed && <span>LOGOUT</span>}
        </div>
      </nav>
    </div>
  );
}

export default SideBar;
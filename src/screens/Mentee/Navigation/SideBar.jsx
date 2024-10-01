import { useState } from "react";
import { IoHome, IoSettingsSharp } from "react-icons/io5";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { MdMenuBook, MdLogout, MdFeedback } from "react-icons/md";
import { RiContactsBook3Fill, RiRobot2Fill } from "react-icons/ri";
import { HiLightBulb } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import styles from "./SideBar.module.css"; // Import module.css styles

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Toggle the collapse state of the sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.sideBarWrapper} ${isCollapsed ? styles.sideBarCollapsed : ""}`}>
      {/* Hamburger button to toggle collapse */}
      <button className={styles.hamburger} onClick={toggleSidebar}>
        ☰
      </button>

      <nav className={styles.navLinks}>
        {/* Sidebar navigation items */}
        <div className={styles.navItem} onClick={() => navigate('/mentee-dashboard/home')}>
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>HOME</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentee-dashboard/modules')}>
          <MdMenuBook className={styles.icon} />
          {!isCollapsed && <span>MODULES</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentee-dashboard/bookings')}>
          <IoHome className={styles.icon} />
          {!isCollapsed && <span>BOOKINGS</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/register')}>
          <BsBookmarkCheckFill className={styles.icon} />
          {!isCollapsed && <span>REGISTER</span>}
        </div>

        {/* New FEEDBACK item */}
        <div className={styles.navItem} onClick={() => navigate('/mentee-dashboard/feedback')}>
          <MdFeedback className={styles.icon} />
          {!isCollapsed && <span>FEEDBACK</span>}
        </div>

        {/* New USE AI item */}
        <div className={styles.navItem} onClick={() => navigate('/mentee-dashboard/ai-tools')}>
          <RiRobot2Fill className={styles.icon} />
          {!isCollapsed && <span>USE AI</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentee-dashboard/settings')}>
          <IoSettingsSharp className={styles.icon} />
          {!isCollapsed && <span>SETTINGS</span>}
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentee-dashboard/logout')}>
          <MdLogout className={styles.icon} />
          {!isCollapsed && <span>LOGOUT</span>}
        </div>
      </nav>
    </div>
  );
}

export default SideBar;

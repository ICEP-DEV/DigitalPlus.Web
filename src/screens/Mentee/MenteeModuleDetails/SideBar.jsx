import React, { useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { MdMenuBook } from "react-icons/md";
import { RiContactsBook3Fill } from "react-icons/ri";
import { FaBars } from "react-icons/fa"; // Toggle icon
import styles from "./SideBar.module.css";
import { useParams, useNavigate, NavLink } from "react-router-dom";

function SideBar({ setActivePage }) {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar open/close
  };

  return (
    <div
      className={`${styles.menteeSidebar} ${
        isOpen ? styles.menteeSidebarOpen : styles.menteeSidebarClosed
      }`}
    >
      <button className={styles.menteeToggleButton} onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav className={styles.menteeNavLinks}> 
        

        <NavLink
          to="#moduleInfo"
          onClick={() => setActivePage("moduleInfo")}
          className={styles.menteeNavItem}
        >
          <RiContactsBook3Fill className={styles.menteeIcon} />
          {isOpen && <span className={styles.menteeIcon}>{moduleId}</span>}
        </NavLink>

        <NavLink
          to="#quizzLanding"
          onClick={() => setActivePage("quizzLanding")}
          className={styles.menteeNavItem}
        >
          <RiContactsBook3Fill className={styles.menteeIcon} />
          {isOpen && <span>QUIZZES</span>}
        </NavLink>

        <NavLink
          to="#mentors"
          onClick={() => setActivePage("mentorslist")}
          className={styles.menteeNavItem}
        >
          <MdMenuBook className={styles.menteeIcon} />
          {isOpen && <span>MENTORS LIST</span>}
        </NavLink>

        <NavLink
          to="#livechat"
          onClick={() => setActivePage("chatboard")}
          className={styles.menteeNavItem}
        >
          <HiOutlineChatAlt2 className={styles.menteeIcon} />
          {isOpen && <span>Chat Board</span>}
        </NavLink>

        <NavLink
          to="#dm"
          onClick={() => setActivePage("mentordm")}
          className={styles.menteeNavItem}
        >
          <HiOutlineChatAlt2 className={styles.menteeIcon} />
          {isOpen && <span>DM</span>}
        </NavLink>

        <NavLink
          to="/mentee-dashboard/modules"
          className={styles.menteeNavItem}
        >
          <IoArrowBackSharp className={styles.menteeIcon} />
          {isOpen && <span>BACK</span>}
        </NavLink>
      </nav>
    </div>
  );
}

export default SideBar;

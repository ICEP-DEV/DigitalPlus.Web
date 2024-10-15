import React, { useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { MdMenuBook } from 'react-icons/md';
import { RiContactsBook3Fill } from 'react-icons/ri';
import { FaBars } from 'react-icons/fa'; // Toggle icon
import styles from './SideBar.module.css';
import { useParams, useNavigate } from 'react-router-dom';

function SideBar({ setActivePage }) {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state
  const navigate = useNavigate(); 
  const { moduleId } = useParams();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar open/close
  };

  return (
    <div className={`${styles.menteeSidebar} ${isOpen ? styles.menteeSidebarOpen : styles.menteeSidebarClosed}`}>
      <button className={styles.menteeToggleButton} onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav className={styles.menteeNavLinks}>
        <a>
          <div className={styles.menteeNavItem}>
            <span className={styles.menteeIcon}>{moduleId}</span>
          </div>
        </a>
        <a href="#quizzes" onClick={() => setActivePage('quizz')}>
          <div className={styles.menteeNavItem}>
            <RiContactsBook3Fill className={styles.menteeIcon} />
            {isOpen && <span>QUIZZES</span>}
          </div>
        </a>
        <a href="#mentors" onClick={() => setActivePage('mentorslist')}>
          <div className={styles.menteeNavItem}>
            <MdMenuBook className={styles.menteeIcon} />
            {isOpen && <span>MENTORS LIST</span>}
          </div>
        </a>
        <a href="#livechat" onClick={() => setActivePage('chatboard')}>
          <div className={styles.menteeNavItem}>
            <HiOutlineChatAlt2 className={styles.menteeIcon} />
            {isOpen && <span>Chat Board</span>}
          </div>
        </a>
        <a href="#dm" onClick={() => setActivePage('mentordm')}>
          <div className={styles.menteeNavItem}>
            <HiOutlineChatAlt2 className={styles.menteeIcon} />
            {isOpen && <span>DM</span>}
          </div>
        </a>
        <a href="#back" onClick={() => navigate('/mentee-dashboard/modules')}>
          <div className={styles.menteeNavItem}>
            <IoArrowBackSharp className={styles.menteeIcon} />
            {isOpen && <span>BACK</span>}
          </div>
        </a>
      </nav>
    </div>
  );
}

export default SideBar;

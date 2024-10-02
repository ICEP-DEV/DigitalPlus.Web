import React from 'react';
import { IoHome, IoArrowBackSharp } from 'react-icons/io5'; // Home and Back icons
import { HiOutlineChatAlt2 } from 'react-icons/hi';  // Live chat icon
import { MdMenuBook } from 'react-icons/md';  // Mentors icon
import { RiContactsBook3Fill } from 'react-icons/ri'; // Quizzes icon
import styles from './SideBar.module.css';
import { useParams } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';  // Import the CSS module

function SideBar({ setActivePage }) {
  const navigate = useNavigate(); 
  const { moduleId } = useParams(); 
  return (
    <div className={styles.sideBar}>
      <nav className={styles.navLinks}>
        <a>
          <div className={styles.navItem}>
            {moduleId}
          </div>
        </a>
        <a href="#quizzes" onClick={() => setActivePage('quizz')}>
          <div className={styles.navItem}>
            SET QUIZ <RiContactsBook3Fill className={styles.icon} />
          </div>
        </a>
        <a href="#mentors" onClick={() => setActivePage('classlist')}>
          <div className={styles.navItem}>
            MENTEE LIST <MdMenuBook className={styles.icon} />
          </div>
        </a>
        <a href="#livechat" onClick={() => setActivePage('mentors')}>
          <div className={styles.navItem}>
            LIVE CHAT <HiOutlineChatAlt2 className={styles.icon} />
          </div>
        </a>
        <a href="#dm" onClick={() => setActivePage('dm')}>
          <div className={styles.navItem}>
            DM <HiOutlineChatAlt2 className={styles.icon} /> {/* DM icon */}
          </div>
        </a>
        <a href="#back" onClick={() => navigate('/mentor-dashboard/module')}>
          <div className={styles.navItem}>
            BACK <IoArrowBackSharp className={styles.icon} />
          </div>
        </a>
      </nav>
    </div>
  );
}

export default SideBar;

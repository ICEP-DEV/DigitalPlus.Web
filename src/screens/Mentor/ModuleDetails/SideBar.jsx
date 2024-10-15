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
        <div className={styles.navItem}>
          {moduleId}
        </div>

        {/* Removed href and handled onClick using React */}
        <div className={styles.navItem} onClick={() => setActivePage('quizz')}>
          QUIZ <RiContactsBook3Fill className={styles.icon} />
        </div>

        {/* Dynamically pass moduleId */}
        <div className={styles.navItem} onClick={() => setActivePage(`classlist`)}>
          MENTEE LIST <MdMenuBook className={styles.icon} />
        </div>

        <div className={styles.navItem} onClick={() => setActivePage('quizhistory')}>
          LIVE CHAT <HiOutlineChatAlt2 className={styles.icon} />
        </div>

        <div className={styles.navItem} onClick={() => setActivePage('mentordm')}>
          DM <HiOutlineChatAlt2 className={styles.icon} /> {/* DM icon */}
        </div>

        {/* Navigating back using navigate */}
        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/module')}>
          BACK <IoArrowBackSharp className={styles.icon} />
        </div>
      </nav>
    </div>
  );
}

export default SideBar;

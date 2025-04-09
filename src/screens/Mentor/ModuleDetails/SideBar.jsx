import React, { useState } from 'react';
import { IoHome, IoArrowBackSharp } from 'react-icons/io5'; // Home and Back icons
import { HiOutlineChatAlt2 } from 'react-icons/hi';  // Live chat icon
import { MdMenuBook } from 'react-icons/md';  // Mentors icon
import { RiContactsBook3Fill } from 'react-icons/ri'; // Quizzes icon
import styles from './SideBar.module.css';
import { useParams } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';  // Import the CSS module

function SideBar({ setActivePage }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // State to toggle sidebar
  const navigate = useNavigate(); 
  const { moduleId } = useParams(); 

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };

  return (
    <div className={`${styles.sideBar} ${isSidebarOpen ? styles.sideBarOpen : styles.sideBarClosed}`}>
      <div className={styles.toggleButton} onClick={toggleSidebar}>
        <span className={styles.hamburgerIcon}></span>
      </div>

      <nav className={styles.navLinks}>
        <div className={styles.navItem} onClick={() => setActivePage('moduleLanding')}>
          {moduleId}
        </div>

        

        <div className={styles.navItem} onClick={() => setActivePage('quizz')}>
        {isSidebarOpen && 'QUIZ'}
          <RiContactsBook3Fill className={styles.icon} />
         
        </div>

        <div className={styles.navItem} onClick={() => setActivePage('classlist')}>
        {isSidebarOpen && 'MENTEE LIST'}
          <MdMenuBook className={styles.icon} />
          
        </div>

        <div className={styles.navItem} onClick={() => setActivePage('chatboard')}>
        {isSidebarOpen && 'CHAT BOARD'}
          <HiOutlineChatAlt2 className={styles.icon} />
         
        </div>

        <div className={styles.navItem} onClick={() => setActivePage('mentordm')}>
        {isSidebarOpen && 'DM'}
          <HiOutlineChatAlt2 className={styles.icon} />
         
        </div>

        <div className={styles.navItem} onClick={() => navigate('/mentor-dashboard/module')}>
        {isSidebarOpen && 'BACK'}
          <IoArrowBackSharp className={styles.icon} />
         
        </div>
      </nav>
    </div>
  );
}

export default SideBar;

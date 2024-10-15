import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css'; // Import as a module
import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import MentorsContent from '../Admin/MentorsContent';
import MenteesContent from './MenteesContent';
import ComplainsContent from './ComplainsContent';
import ModulesContent from './ModulesContent';
import LogoutComponent from './LogoutComponent';
import SettingsContent from './SettingsContent';
import ReportContent from './ReportContent';
import ScheduleComponent from './ScheduleComponent';
// Import settings-related components
import AccountContent from './AccountContent';
import CreateMentorContent from './CreateMentorContent';
import AnalyticsReportsContent from './AnalyticsReportsContent';
import { FaBars, FaCog, FaSignOutAlt, FaEnvelope, FaBook, FaUserFriends, FaHome } from 'react-icons/fa';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true); // State to toggle the sidebar
  const [adminEmail, setAdminEmail] = useState(''); // State to store admin email

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar between open and closed
  };

  // Fetch the admin email from the user object stored in localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
    if (user && user.emailAddress) {
      setAdminEmail(user.emailAddress); // Set admin email from the API response
    }
  }, []);

  return (
    <div className={styles.adminDashboardContainer}>
      <header className={styles.adminHeader}>
        <div className={styles.adminInfo}>
          <i className={styles.adminIcon}>👤</i>
          <div className={styles.adminText}>
            <span>Admin</span>
            {adminEmail && <span className={styles.adminEmail}>{adminEmail}</span>} {/* Display the admin email */}
          </div>
        </div>
        <NavLink to="/admin-dashboard/logout" className={styles.logoutButton}>
          <FaSignOutAlt /> Logout
        </NavLink>
      </header>

      <div className={styles.adminDashboard}>
        {/* Sidebar with toggle functionality */}
        <nav className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <FaBars />
          </button>
          <ul>
            <li>
              <NavLink 
                to="/admin-dashboard/dashboard" 
                className={({ isActive }) => isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem}>
                <FaHome />
                {isOpen && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin-dashboard/mentors" 
                className={({ isActive }) => isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem}>
                <FaUserFriends />
                {isOpen && <span>Mentors</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin-dashboard/mentees" 
                className={({ isActive }) => isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem}>
                <FaUserFriends />
                {isOpen && <span>Mentees</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin-dashboard/reports" 
                className={({ isActive }) => isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem}>
                <FaUserFriends />
                {isOpen && <span>Reports</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin-dashboard/schedule" 
                className={({ isActive }) => isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem}>
                <FaUserFriends />
                {isOpen && <span>Schedule</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin-dashboard/complains" 
                className={({ isActive }) => isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem}>
                <FaEnvelope />
                {isOpen && <span>Complains</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin-dashboard/modules" 
                className={({ isActive }) => isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem}>
                <FaBook />
                {isOpen && <span>Modules</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin-dashboard/settings" 
                className={({ isActive }) => isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem}>
                <FaCog />
                {isOpen && <span>Settings</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <div className={styles.dashboardContent}>
          <Routes>
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="mentors" element={<MentorsContent />} />
            <Route path="mentees" element={<MenteesContent />} />
            <Route path="reports" element={<ReportContent />} />
            <Route path="schedule" element={<ScheduleComponent />} />
            <Route path="complains" element={<ComplainsContent />} />
            <Route path="modules" element={<ModulesContent />} />
            <Route path="settings/account" element={<AccountContent />} />
            <Route path="settings/create-mentor" element={<CreateMentorContent />} />
            <Route path="settings/analytics" element={<AnalyticsReportsContent />} />
            <Route path="settings" element={<SettingsContent />} />
            <Route path="logout" element={<LogoutComponent />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

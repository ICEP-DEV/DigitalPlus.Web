import React, { useState } from 'react';
import styles from './AdminDashboard.module.css'; // Import as a module
import { Link, Route, Routes } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import DepartmentContent from './DepartmentContent';
import MentorsContent from '../Admin/MentorsContent';
import MenteesContent from './MenteesContent';
import ComplainsContent from './ComplainsContent';
import ModulesContent from './ModulesContent';
import LogoutComponent from './LogoutComponent';
import SettingsContent from './SettingsContent';
// Import settings-related components
import AccountContent from './AccountContent';
import CreateMentorContent from './CreateMentorContent';
import AnalyticsReportsContent from './AnalyticsReportsContent';
import { FaBars, FaCog, FaSignOutAlt, FaEnvelope, FaBook, FaUserFriends, FaHome } from 'react-icons/fa';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true); // State to toggle the sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar between open and closed
  };

  return (
    <div className={styles.adminDashboardContainer}>
      <header className={styles.adminHeader}>
        <div className={styles.adminInfo}>
          <i className={styles.adminIcon}>👤</i>
          <span>Admin</span>
        </div>
      </header>

      <div className={styles.adminDashboard}>
        {/* Sidebar with toggle functionality */}
        <nav className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <FaBars />
          </button>
          <ul>
            <li>
              <Link to="/admin-dashboard/dashboard" className={styles.sidebarItem}>
                <FaHome />
                {isOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/department" className={styles.sidebarItem}>
                <FaUserFriends />
                {isOpen && <span>Department</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/mentors" className={styles.sidebarItem}>
                <FaUserFriends />
                {isOpen && <span>Mentors</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/mentees" className={styles.sidebarItem}>
                <FaUserFriends />
                {isOpen && <span>Mentees</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/complains" className={styles.sidebarItem}>
                <FaEnvelope />
                {isOpen && <span>Complains</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/modules" className={styles.sidebarItem}>
                <FaBook />
                {isOpen && <span>Modules</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/settings" className={styles.sidebarItem}>
                <FaCog />
                {isOpen && <span>Settings</span>}
              </Link>
            </li>
          </ul>
          <div className={styles.sidebarLogout}>
            <Link to="/admin-dashboard/logout" className={styles.sidebarItem}>
              <FaSignOutAlt />
              {isOpen && <span>Logout</span>}
            </Link>
          </div>
        </nav>

        {/* Main content */}
        <div className={styles.dashboardContent}>
          <Routes>
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="department" element={<DepartmentContent />} />
            <Route path="mentors" element={<MentorsContent />} />
            <Route path="mentees" element={<MenteesContent />} />
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

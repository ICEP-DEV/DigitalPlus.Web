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
import { FaBars, FaCog, FaBook, FaHome, FaPowerOff } from 'react-icons/fa'; // Imported FaPowerOff
import { SiCodementor } from "react-icons/si";
import { GoReport } from "react-icons/go";
import { GrSchedules } from "react-icons/gr";
import { GrCompliance } from "react-icons/gr";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true); // State to toggle the sidebar
  const [adminEmail, setAdminEmail] = useState(''); // State to store admin email
  const [profileImage, setProfileImage] = useState(null); // State to store profile image

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar between open and closed
  };

  // Fetch the admin email and profile image from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
    if (user && user.emailAddress) {
      setAdminEmail(user.emailAddress); // Set admin email from the API response
    }

    // Retrieve profile image from localStorage
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String); // Store image in localStorage
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
  };

  // Function to trigger file input click
  const handleImageClick = () => {
    document.getElementById('profileImageInput').click();
  };

  return (
    <div className={styles.adminDashboardContainer}>
      <header className={styles.adminHeader}>
        <div className={styles.adminInfo}>
          {/* Image placeholder that allows uploading a profile picture */}
          <div className={styles.adminIcon} onClick={handleImageClick}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Admin"
                className={styles.adminImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>Upload Image</div>
            )}
            {/* Hidden file input */}
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          <div className={styles.adminText}>
            <span>Admin</span>
            {adminEmail && <span className={styles.adminEmail}>{adminEmail}</span>} {/* Display the admin email */}
          </div>
        </div>
        {/* Updated logout button */}
        <NavLink to="/admin-dashboard/logout" className={styles.logoutButton}>
          <FaPowerOff /> {/* Red switch-off icon */}
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
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <FaHome />
                {isOpen && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/mentors"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <SiCodementor />
                {isOpen && <span>Mentors</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/mentees"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <SiCodementor />
                {isOpen && <span>Mentees</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/reports"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <GoReport />
                {isOpen && <span>Reports</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/schedule"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <GrSchedules />
                {isOpen && <span>Schedule</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/complains"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <GrCompliance />
                {isOpen && <span>Complains</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/modules"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <FaBook />
                {isOpen && <span>Modules</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/settings"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
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

import React, { useState } from 'react';
import { FaHome, FaUser, FaCog, FaBars, FaEnvelope, FaUserFriends, FaStar, FaSignOutAlt, FaQuestionCircle, FaBook } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom'; // Import NavLink and useLocation for routing

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const location = useLocation(); // Get the current route location

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleItemClick = (index) => {
        if (index === 7) { // Assuming "Log Out" is the last item (index 7)
            setShowLogoutConfirm(true);
        } else {
            setShowLogoutConfirm(false); // Hide confirmation if clicking other menu items
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <div style={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
            <div style={styles.toggleButton} onClick={toggleSidebar}>
                <FaBars />
            </div>
            <ul style={styles.menu}>
                {[
                    { text: 'Home', icon: <FaHome style={styles.icon} />, route: '/AnnouncementPage' },
                    { text: 'Profile', icon: <FaUser style={styles.icon} />, route: '/MentorProfile' },
                    { text: 'Booking', icon: <FaBook style={styles.icon} />, route: '/Booking' },
                    { text: 'Mentors', icon: <FaUserFriends style={styles.icon} />, route: '/Mentors' },
                    { text: 'Report', icon: <FaStar style={styles.icon} />, route: '/Report' },
                    { text: 'Settings', icon: <FaCog style={styles.icon} />, route: '/Settings' },
                ].map((item, index) => (
                    <li
                        key={index}
                        style={
                            hoveredItem === index || location.pathname === item.route
                                ? { ...styles.menuItem, ...styles.menuItemHover }
                                : styles.menuItem
                        }
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => handleItemClick(index)}
                    >
                        <NavLink to={item.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.icon}
                            {isOpen && <span style={styles.menuText}>{item.text}</span>}
                        </NavLink>
                    </li>
                ))}
                <li
                    style={
                        hoveredItem === 7
                            ? { ...styles.menuItem, ...styles.menuItemHover, ...styles.logoutButton }
                            : { ...styles.menuItem, ...styles.logoutButton }
                    }
                    onMouseEnter={() => setHoveredItem(7)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => handleItemClick(7)}
                >
                    <FaSignOutAlt style={styles.icon} />
                    {isOpen && (
                        <span style={styles.menuText}>
                            Log Out
                        </span>
                    )}
                </li>
            </ul>
            {showLogoutConfirm && (
                <div style={styles.logoutConfirm}>
                    <FaQuestionCircle style={styles.questionIcon} />
                    <p>Are you sure you want to log out?</p>
                    <div style={styles.buttonContainer}>
                        <NavLink to="/Login">
                            <button style={styles.confirmButton}>Yes</button>
                        </NavLink>
                        <button style={styles.cancelButton} onClick={handleCancelLogout}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    sidebarOpen: {
        width: '250px',
        height: '100vh',
        backgroundColor: '#000C24',
        color: '#fff',
        position: 'fixed',
        top: '0',
        left: '0',
        transition: 'width 0.3s',
        // paddingTop: '100px',
        marginTop: '140px',
    },
    sidebarClosed: {
        width: '80px',
        height: '100vh',
        backgroundColor: '#000C24',
        color: '#fff',
        position: 'fixed',
        top: '0',
        left: '0',
        transition: 'width 0.3s',
        // paddingTop: '100px',
        marginTop: '140px',
    },
    toggleButton: {
        fontSize: '24px',
        cursor: 'pointer',
        color: '#fff',
        padding: '15px',
        textAlign: 'center',
        borderBottom: '1px solid #444',
    },
    menu: {
        listStyleType: 'none',
        padding: '0',
        margin: '0',
        height: '100%', // Ensure the sidebar height takes full height
    },
    menuItem: {
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #444',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    menuItemHover: {
        backgroundColor: '#0E4C79', // Color to highlight on hover or when selected
    },
    logoutButton: {
        position: 'absolute',
        bottom: '20px', // Positions the log out button at the bottom
        width: '100%', // Ensures it stretches across the sidebar
    },
    icon: {
        fontSize: '20px',
        color: '#fff',
        marginRight: '10px',
    },
    menuText: {
        color: '#fff',
        fontSize: '16px',
    },
    logoutConfirm: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#D9D9D9',
        color: '#000',
        padding: '20px',
        borderRadius: '5px',
        border: '2px solid #000', // Added border
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        zIndex: 1000, // Ensure it appears above other elements
    },
    questionIcon: {
        fontSize: '100px',
        color: '#0E4C79',
        marginBottom: '10px', // Spacing between the icon and text
    },
    buttonContainer: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
    },
    confirmButton: {
        marginRight: '10px',
        backgroundColor: '#0E4C79',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
    },
    cancelButton: {
        backgroundColor: '#0E4C79',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
    },
};

export default Sidebar;

import React from 'react';
import styles from './logout.module.css';
import Header from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar';  // Import the CSS module

import { useNavigate } from 'react-router-dom'; 

const Logout = () => {
    const navigate = useNavigate(); // Move useNavigate here

    const handleLogout = (confirmation) => {
        if (confirmation) {
            // You can add your actual logout logic here, such as clearing tokens
            navigate('/'); // Example of redirecting after logout
        } else {
            navigate('/mentor-dashboard/announcementpage'); 
            // Add logic to handle cancellation or closing the dialog.
        }
    };

    return (
        <div>
    <Header />
    <SideBar />
        
        <div className={styles['logout-container']}>
            <div className={styles['logout-pending']}>LOGOUT PENDING...</div>
            <div className={styles['logout-dialog']}>
                <div className={styles['logout-icon']}>?</div>
                <div className={styles['logout-message']}>ARE YOU SURE YOU WANT TO LOG OUT?</div>
                <div className={styles['logout-buttons']}>
                    <button className={styles['logout-btn']} onClick={() => handleLogout(true)}>YES</button>
                    <button className={styles['logout-btn']} onClick={() => handleLogout(false)}>NO</button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Logout;

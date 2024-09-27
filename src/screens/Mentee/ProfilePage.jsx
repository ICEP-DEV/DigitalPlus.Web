// src/pages/ProfilePage/ProfilePage.js

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
// import Header from '../../components/Header';
// import SideBar from '../../components/SideBar';
import styles from './ProfilePage.module.css';
import profilePicture from '../../Assets/profile.jpeg';
import SideBarNavBar from './Navigation/SideBarNavBar';

const ProfilePage = () => {
  // Replace these with actual data from your state or API
  const user = {
    name: 'John',
    surname: 'Doe',
    email: '221417714@tut4life.ac.za',
    yearofstudy: '1st Year',
    contact: '0637234846',
    modules: ['PPAF05D', 'COHF05D', 'CFBF05D'],
    course: 'MULTIMEDIA COMPUTING',
  };

  return (
    <SideBarNavBar>
    <div className={styles.pageContainer}>
      {/* <Header />
      <SideBar /> */}
      <div className={styles.profileSection}>
        <div className={styles.contentContainer}>
          {/* Profile Picture Section */}
          <div className={styles.profilePictureSection}>
            <img 
              src={profilePicture} 
              alt="Profile" 
              className={styles.profilePicture} 
            />
            <h3 className={styles.courseName}>{user.course}</h3>
          </div>

          {/* Left: Personal Details */}
          <div className={styles.personalDetails}>
            <h2>Personal Details</h2>
            <p><strong>First Name:</strong> {user.name}</p>
            <p><strong>Last Name:</strong> {user.surname}</p>
            <p><strong>Student Email:</strong> {user.email}</p>
            <p><strong>Year of Study:</strong> {user.yearofstudy}</p>
            <p><strong>Contact:</strong> {user.contact}</p>

            {/* Add Edit Button */}
            <Link to="/settings" className={styles.editButton}>
              Edit Profile
            </Link>
          </div>

          {/* Right: Registered Modules */}
          <div className={styles.moduleDetails}>
            <h2>Registered Modules</h2>
            <ul>
              {user.modules.map((module, index) => (
                <li key={index}>{module}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </SideBarNavBar>
  );
};

export default ProfilePage;

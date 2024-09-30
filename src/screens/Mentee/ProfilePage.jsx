import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import styles from './ProfilePage.module.css';
import defaultProfilePicture from '../../Assets/profile.jpeg'; // Default profile picture
import SideBarNavBar from './Navigation/SideBarNavBar';

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture); // State for profile picture

  // Replace these with actual data from your state or API
  const user = {
    name: 'Nobuhle',
    surname: 'Mkhize',
    email: '221418714@tut4life.ac.za',
    yearofstudy: '1st Year',
    contact: '0637234846',
    modules: ['PPAF05D', 'COHF05D', 'CFBF05D'],
    course: 'MULTIMEDIA COMPUTING',
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Set the new profile picture
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <SideBarNavBar>
      <div className={styles.pageContainer}>
        {/* Profile Picture and Course Name Section */}
        <div className={styles.profilePictureSection}>
          <img 
            src={profilePicture} 
            alt="Profile" 
            className={styles.profilePicture} 
          />
          <h3 className={styles.courseName}>{user.course}</h3>
          {/* Image upload input */}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className={styles.fileInput} 
          />
        </div>

        {/* Profile Section with Personal Details and Module Details */}
        <div className={styles.profileSection}>
          {/* Left: Personal Details */}
          <div className={styles.leftSection}>
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
          </div>

          {/* Right: Registered Modules */}
          <div className={styles.rightSection}>
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

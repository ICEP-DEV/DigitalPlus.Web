import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import styles from './ProfilePage.module.css';
import defaultProfilePicture from '../../Assets/profile.jpeg'; 
import SideBarNavBar from './Navigation/SideBarNavBar';
import axios from 'axios';



const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture); 
  const [userData, setUserData] = useState(''); 
  const [department, setDepartment] = useState(''); 


  // New state to store registered modules
  const [registeredModules, setRegisteredModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const menteeId = user?.mentee_Id;
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); 
    if (user) {
      setUserData(user);
      
    }
  }, []);

  useEffect(() => {
    if (userData && userData.departmentId) {
      const getDepartment = async () => {
        try {
          const response = await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetDepartment/${userData.departmentId}`);
          if (response.data) {
             setDepartment(response.data.result.department_Name); 
            console.log(response.data.result.department_Name);
          }
        } catch (error) {
          console.error('Error fetching department:', error);
        }
      };
      getDepartment();
    }
  }, [userData]);

  useEffect(() => {
    // Only fetch modules if user data is available
    
     
      const fetchRegisteredModules = async () => {
        try {
          // Use the new endpoint for getting modules by mentee ID
          const response = await axios.get(`https://localhost:7163/api/AssignMod/getmodulesBy_MenteeId/${menteeId}`);
          
          if (response.data) {
            // Set the registered modules from the response
            setRegisteredModules(response.data);
          }
        } catch (error) {
          console.error('Error fetching registered modules:', error);
        } finally {
          // Ensure loading state is set to false
          setIsLoading(false);
        }
      };
      fetchRegisteredModules();
    
  }, [menteeId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  if (!userData) {
    return <div>Loading...</div>; 
  }

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
          <h3 className={styles.courseName}>
            {department ? department : 'Department not found'} 
          </h3>
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
              <div className={styles.detailGroup}>
                <label>FIRST NAME:</label>
                <input type="text" value={userData.firstName} readOnly />
              </div>
              <div className={styles.detailGroup}>
                <label>LAST NAME:</label>
                <input type="text" value={userData.lastName} readOnly />
              </div>
              <div className={styles.detailGroup}>
                <label>STUDENT EMAIL:</label>
                <input type="text" value={userData.studentEmail} readOnly />
              </div>
              <div className={styles.detailGroup}>
                <label>YEAR OF STUDY:</label>
                <input type="text" value={userData.semester} readOnly />
              </div>
              <div className={styles.detailGroup}>
                <label>CONTACT:</label>
                <input type="text" value={userData.contactNo} readOnly />
              </div>

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
              {isLoading ? (
                <p>Loading modules...</p>
              ) : registeredModules.length > 0 ? (
                <ul>
                  {registeredModules.map((module) => (
                    <li key={module.assignModId}>
                      {module.moduleCode} - {module.moduleName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No modules registered</p>
              )}
               
            </div>
          </div>
        </div>
      </div>
    </SideBarNavBar>
  );
};

export default ProfilePage;

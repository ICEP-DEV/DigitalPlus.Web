import React, { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import styles from './ProfilePage.module.css';
import defaultProfilePicture from '../../Assets/profile.jpeg'; // Default profile picture
import SideBarNavBar from './Navigation/SideBarNavBar';

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture); // State for profile picture
  const [userData, setUserData] = useState('');
//  const [department, setDepartment]=useState('');

 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
    if (user && user.departmentId && user.studentEmail && user.firstName && user.lastName && user.contactNo && user.semester) {
      setUserData(user)  ; // Set admin email from the API response
    }
    
    // const fetchDepartment = async () => {
    //   try{
    //     const response = await fetch(`https://localhost:7163/api/DigitalPlusCrud/GetDepartment/${userData.departmentId}`,{
    //       method:'GET',
    //     });
    //     const depRes=await response.json();
    //     setDepartment(depRes.department_Name);
    //     console.log(depRes.department_Name);
    //   }catch(err){
    //     console.log('Error fetching the department: ', err);
    //   }
    // };
  
    // fetchDepartment();
  }, []);
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
          <h3 className={styles.courseName}>
          Computer Science
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
            <div className="profile-details">
          <div className="detail-group">
            <label>FIRSTNAME:</label>
            <input type="text" value={userData.firstName}   readOnly />
          </div>
          <div className="detail-group">
            <label>LASTNAME:</label>
            <input type="text" value={userData.lastName}   readOnly />
          </div>
          <div className="detail-group">
            <label>STUDENT EMAIL:</label>
            <input type="text" value={userData.studentEmail}   readOnly />
          </div>
          <div className="detail-group">
            <label>YEAR OF STUDY:</label>
            <input type="text" value={userData.semester}   readOnly />
          </div>
          <div className="detail-group">
            <label>CONTACT:</label>
            <input type="text" value={userData.contactNo}   readOnly />
          </div>
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
              {/* <ul>
                {user.modules.map((module, index) => (
                  <li key={index}>{module}</li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>
      </div>
    </SideBarNavBar>
  );
};

export default ProfilePage;

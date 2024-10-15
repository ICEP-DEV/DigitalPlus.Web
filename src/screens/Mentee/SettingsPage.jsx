import React, { useState,useEffect } from 'react';
import styles from './SettingsPage.module.css';  // Import the module.css file
import SideBarNavBar from './Navigation/SideBarNavBar';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('changePassword'); // Default to 'Change Password'
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode
  const [userData, setUserData] = useState('');


  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.departmentId && user.studentEmail && user.firstName && user.lastName && user.contactNo && user.semester) {
      setUserData(user)  ; // Set admin email from the API response
    }
  },[]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false); // Submit and exit edit mode
  };

  return (
    <SideBarNavBar>
    <div className={styles.settingsContainer}>
      <h2>Account Settings</h2>
      {/* Tabs */}
      <div className={styles.settingsTabs}>
        <button
          className={activeTab === 'personalDetails' ? styles.activeTab : ''}
          onClick={() => setActiveTab('personalDetails')}
        >
          Personal Details
        </button>
        <button
          className={activeTab === 'changePassword' ? styles.activeTab : ''}
          onClick={() => setActiveTab('changePassword')}
        >
          Change Password
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'personalDetails' && (
          <div>
            <div className={styles.profileContainer}>
              <form className={styles.profileForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.studentEmail}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Contact:</label>
                  <input
                    type="text"
                    name="contact"
                    value={userData.contactNo}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Year of Study:</label>
                  <input
                    type="text"
                    name="yearOfStudy"
                    value={userData.semester}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroupFullWidth}>
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    onChange={handleChange}
                    disabled={!isEditing} // Make it editable only when isEditing is true
                  >
                    <option value="">Select Department</option>
                    <option value="1">Computer Science</option>
                    <option value="2">Multimedia</option>
                    <option value="3">Informations</option>
                    <option value="4">Computer systems Engineering</option>
                    <option value="5">Information Technology</option>
                    
                  </select>
                </div>

                <div className={styles.formButtons}>
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={handleEdit}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  {isEditing && (
                    <button type="submit" className={styles.updateButton}>
                      Update
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'changePassword' && (
          <div>
            <div className={styles.passwordForm}>
              <div className={styles.formGroup}>
                <label>Current Password:</label>
                <input type="password" name="currentPassword" />
              </div>
              <div className={styles.formGroup}>
                <label>New Password:</label>
                <input type="password" name="newPassword" />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm Password:</label>
                <input type="password" name="confirmPassword" />
              </div>
            </div>
            <button className={styles.changePasswordButton}>Change Password</button>
          </div>
        )}
      </div>
    </div>
    </SideBarNavBar>
  );
};

export default Settings;

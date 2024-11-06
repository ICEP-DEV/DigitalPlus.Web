import React, { useState, useEffect } from 'react';
import styles from './SettingsPage.module.css'; // Import the module.css file
import SideBarNavBar from './Navigation/SideBarNavBar';
import axios from 'axios';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('changePassword'); // Default to 'Change Password'
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode
  const [userData, setUserData] = useState({});
  const [department, setDepartment] = useState(''); 
  const [departments, setDepartments] = useState([]);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.departmentId && user.studentEmail && user.firstName && user.lastName && user.contactNo && user.semester) {
      setUserData(user); // Set user data from local storage
    }
  }, []);

  useEffect(() => {
    if (userData && userData.departmentId) {
      const getDepartment = async () => {
        try {
          const response = await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetDepartment/${userData.departmentId}`);
          if (response.data) {
            setDepartment(response.data.result.department_Name); 
          }
        } catch (error) {
          console.error('Error fetching department:', error);
        }
      };
      getDepartment();
    }
  }, [userData]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllDepartments');
        setDepartments(response.data.result);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  const updateDetails = async () => {
    try {
      const response = await axios.put(`https://localhost:7163/api/DigitalPlusUser/UpdateMentee/${userData.mentee_Id}`, {
        mentee_Id: userData.mentee_Id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        studentEmail: userData.studentEmail,
        contactNo: userData.contactNo,
        departmentId: userData.departmentId,
        password: userData.password,
        semester: userData.semester,
        activated: userData.activated ? true : false
      },{ headers: { 'Content-Type': 'application/json' } });
      if (response.status === 200) {
        alert('User details updated successfully');
        localStorage.setItem('user', JSON.stringify(userData)); // Update local storage
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing); 
  };
 

  const handleSubmit = (e) => {
    e.preventDefault();
    if(activeTab === 'personalDetails')
    {
      updateDetails();
    }
      
  };

  return (
    <SideBarNavBar>
      <div className={styles.settingsContainer}>
        <h2>Account Settings</h2>
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
                      name="studentEmail"
                      value={userData.studentEmail}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contact:</label>
                    <input
                      type="text"
                      name="contactNo"
                      value={userData.contactNo}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Year of Study:</label>
                    <input
                      type="text"
                      name="semester"
                      value={userData.semester}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className={styles.formGroupFullWidth}>
                    <label htmlFor="department">Department</label>
                    <select
                      id="department"
                      name="departmentId"
                      value={userData.departmentId}
                      onChange={handleChange}
                      disabled={!isEditing} 
                    >
                      <option value="">{department || 'Department not found'}</option>
                      {departments.map((dep) => (
                        <option key={dep.department_Id} value={dep.department_Id}>
                          {dep.department_Name}
                        </option>
                      ))}
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
                      <button type="submit" className={styles.updateButton} onClick={updateDetails}>
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
              <button className={styles.changePasswordButton} >Change Password</button>
            </div>
          )}
        </div>
      </div>
    </SideBarNavBar>
  );
};

export default Settings;

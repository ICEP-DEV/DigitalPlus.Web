import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './SettingsPage.module.css'; // Import the module.css file
import SideBarNavBar from './Navigation/SideBarNavBar';
import axios from 'axios';

const Settings = () => {
  const navigate = useNavigate();


  const [activeTab, setActiveTab] = useState('changePassword'); // Default to 'Change Password'
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode
  const [userData, setUserData] = useState({});
  const [department, setDepartment] = useState(''); 
  const [departments, setDepartments] = useState([]);
  const [email, setEmail] = useState('');
  const [currentPassword,setCurrentPassword] = useState('');
  const [oldPassword,setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationFeedback, setValidationFeedback] = useState([
      "At least 8 characters long",
      "At least one uppercase letter",
      "At least one lowercase letter",
      "At least one digit",
      "At least one special character"
  ]);


  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.departmentId && user.studentEmail && user.firstName && user.lastName && user.contactNo && user.semester) {
      setUserData(user); // Set user data from local storage
      setOldPassword(user.password);
      setEmail(user.studentEmail);
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

  useEffect(() => {
    if (successMessage || errorMessage) {
        const timer = setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
        }, 1000); // 10 seconds

        return () => clearTimeout(timer);
    }
}, [successMessage, errorMessage]);


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



  
  const handlePasswordChange = (password) => {
    setNewPassword(password);

    const newValidationFeedback = [];

    if (password.length < 8) {
        newValidationFeedback.push("At least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
        newValidationFeedback.push("At least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
        newValidationFeedback.push("At least one lowercase letter");
    }

    if (!/\d/.test(password)) {
        newValidationFeedback.push("At least one digit");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newValidationFeedback.push("At least one special character");
    }

    setValidationFeedback(newValidationFeedback);
};

const resetPassword = () => {
  if (oldPassword !== currentPassword) {
    setErrorMessage('Incorrect current password');
      return;
  }

  if (newPassword !== confirmPassword) {
    setErrorMessage('Passwords do not match!');
      return;
  }

  if (validationFeedback.length > 0) {
    setErrorMessage('Password does not meet all requirements.');
      return;
  }

  // Prepare data for the API request
  const data = {
      email: email,  // Use the password from localStorage
      newPassword: newPassword
  };

  // Send the resetPassword request
  axios.post('https://localhost:7163/api/DigitalPlusUser/resetPassword', data)
      .then(response => {
          if (response.data.success) {
            setSuccessMessage('Password Changed Successfully!!!');
              
              
              // Redirect to login after a brief delay to allow the user to see the message
              setTimeout(() => {
                  navigate('/settings');  // Navigate to login page after success
              }, 2000);  // 2 second delay before redirecting
          } else {
              console.error(response.data.message);
          }
      })
      .catch(() => {
          console.error('An error occurred');
      });
};




  //HANDLES

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

              {successMessage && <div style={{ marginTop: '20px', marginBottom: '20px', color: 'green' }}>{successMessage}</div>}
              {errorMessage && <div style={{ marginTop: '20px', marginBottom: '20px', color: 'red' }}>{errorMessage}</div>}
              <div className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label>Current Password:</label>
                  <input type="password" name="currentPassword" 
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>New Password:</label>
                  <input type="password" name="newPassword" 
                  onChange={(event) => handlePasswordChange(event.target.value)}
                  />
                </div>
                 {/* Display only the unmet validation requirements */}
                 {validationFeedback.length > 0 && (
                        <ul className={styles.validationFeedback}>
                            {validationFeedback.map((feedback, index) => (
                                <li key={index} className={styles.invalid}>
                                    {feedback}
                                </li>
                            ))}
                        </ul>
                    )}
                <div className={styles.formGroup}>
                  <label>Confirm Password:</label>
                  <input type="password" name="confirmPassword" 
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
              </div>
              <button className={styles.changePasswordButton} onClick={resetPassword}>Change Password</button>
            </div>
          )}
        </div>
      </div>
    </SideBarNavBar>
  );
};

export default Settings;

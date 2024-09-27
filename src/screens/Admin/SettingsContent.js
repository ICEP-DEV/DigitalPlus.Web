import React, { useState } from 'react';
import styles from './SettingsContent.module.css'; // Updated import

const SettingsContent = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Mark',
    lastName: 'Jhonsan',
    email: 'mark@example.com',
    username: 'jhonsanmark',
    website: '',
    street: '',
    city: '',
    state: '',
    password: '************',
    confirmPassword: '************',
    profilePic: '/path/to/profile-pic.jpg',
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
    setActiveTab('Edit');
  };

  const handleCancelClick = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setActiveTab('Profile');
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.profileCard}>
        <img src={formData.profilePic} alt="Profile" className={styles.profilePic} />
        <h3>{formData.firstName} {formData.lastName}</h3>
        <p>UI/UX Engineer</p>
        <div className={styles.contactInfo}>
          <p>{formData.email}</p>
          <p>www.example.com</p>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2>{activeTab === 'Profile' ? 'Profile' : 'Edit Profile'}</h2>
          {!isEditing && (
            <button className={styles.editButton} onClick={handleEditClick}>
              Edit
            </button>
          )}
        </div>

        <div className={styles.tabsContainer}>
          <div
            className={`${styles.tab} ${activeTab === 'Profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('Profile')}
          >
            Profile
          </div>
          <div
            className={`${styles.tab} ${activeTab === 'Messages' ? styles.active : ''}`}
            onClick={() => setActiveTab('Messages')}
          >
            Messages
          </div>
        </div>

        {activeTab === 'Profile' && !isEditing && (
          <div className={styles.formSection}>
            <div className={styles.formField}>
              <label>First Name</label>
              <input type="text" value={formData.firstName} disabled />
            </div>
            <div className={styles.formField}>
              <label>Last Name</label>
              <input type="text" value={formData.lastName} disabled />
            </div>
            <div className={styles.formField}>
              <label>Email</label>
              <input type="email" value={formData.email} disabled />
            </div>
          </div>
        )}

        {isEditing && (
          <div className={styles.formSection}>
            <div className={styles.formField}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Change Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleProfilePicChange} />
            </div>

            <div className={styles.formField}>
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Address</label>
              <div className={styles.addressFields}>
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.formField}>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formFooter}>
              <button className={styles.cancelButton} onClick={handleCancelClick}>
                Cancel
              </button>
              <button className={styles.saveButton} onClick={handleSaveClick}>
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Messages' && !isEditing && (
          <div className={styles.messagesSection}>
            <p className={styles.infoMessage}>Info! Lorem Ipsum is simply dummy text.</p>
            <div className={styles.messageItem}>
              <p>Here is your latest summary report...</p>
              <span>3 hrs ago</span>
            </div>
            <div className={styles.messageItem}>
              <p>There has been a request on your account...</p>
              <span>Yesterday</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsContent;

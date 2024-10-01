import React, { useState, useEffect } from 'react';
import styles from './SettingsPage.module.css'; // Create a CSS file for styling
import SideBarNavBar from './Navigation/SideBarNavBar';

const SettingsPage = () => {
  // Initialize state for user data
  const [user, setUser] = useState({
    name: '',
    surname: '',
    email: '',
    yearofstudy: '',
    contact: '',
    modules: [],
  });

  // UseEffect to fetch user data from localStorage when component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser({
        name: storedUser.firstName || '',
        surname: storedUser.lastName || '',
        email: storedUser.studentEmail || '',
        yearofstudy: storedUser.yearofstudy || '',
        contact: storedUser.contactNo || '',
        modules: storedUser.modules || [],
      });
    }
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Handle form submission (you can connect this to a backend or API)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated user details:', user);
    // Add your logic to save updated data
    // Optionally, save the updated user data back to localStorage
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <SideBarNavBar>
      <div className={styles.pageContainer}>
        <div className={styles.settingsFormSection}>
          <h1>Edit Your Profile</h1>
          <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">First Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="surname">Last Name:</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={user.surname}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="yearofstudy">Year of Study:</label>
              <input
                type="text"
                id="yearofstudy"
                name="yearofstudy"
                value={user.yearofstudy}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="contact">Contact:</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={user.contact}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={styles.saveButton}>Save Changes</button>
          </form>
        </div>
      </div>
    </SideBarNavBar>
  );
};

export default SettingsPage;

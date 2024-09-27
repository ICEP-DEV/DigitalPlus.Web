// src/pages/SettingsPage/SettingsPage.js

import React, { useState } from 'react';
// import Header from '../../components/Header';
// import SideBar from '../../components/SideBar';
import styles from './SettingsPage.module.css'; // Create a CSS file for styling
import SideBarNavBar from './Navigation/SideBarNavBar';

const SettingsPage = () => {
  // Example state for user data. In a real app, fetch from a backend or state management store.
  const [user, setUser] = useState({
    name: 'John',
    surname: 'Doe',
    email: '221417714@tut4life.ac.za',
    yearofstudy: '1st Year',
    contact: '0637234846',
    modules: ['PPAF05D', 'COHF05D', 'CFBF05D'],
  });

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
  };

  return (
    <SideBarNavBar>
    <div className={styles.pageContainer}>
      {/* <Header />
      <SideBar /> */}
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

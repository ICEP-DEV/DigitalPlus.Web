import React from 'react';
import styles from './CreateMentorContent.module.css'; // Import the module CSS

const CreateMentorContent = ({ onMentorCreated }) => {
  return (
    <div className={styles.createMentorContent}>
      <h2>Create Mentor</h2>
      <form className={styles.createMentorContentForm}>
        <input className={styles.createMentorContentInput} type="text" placeholder="First Name" />
        <input className={styles.createMentorContentInput} type="text" placeholder="Last Name" />
        <input className={styles.createMentorContentInput} type="email" placeholder="Student Email" />
        <input className={styles.createMentorContentInput} type="email" placeholder="Personal Email Address" />
        <input className={styles.createMentorContentInput} type="text" placeholder="Contact" />
        <input className={styles.createMentorContentInput} type="password" placeholder="Mentor Password" />
        <input className={styles.createMentorContentInput} type="password" placeholder="Confirm Password" />
        <select className={styles.createMentorContentSelect}>
          <option value="">Select Faculty</option>
        </select>
        <div className={styles.createButtons}>
          <button type="button" className={styles.createButton} onClick={onMentorCreated}>Create Mentor</button>
          <button type="reset" className={styles.createButton}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default CreateMentorContent;

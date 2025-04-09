import React from 'react';
import styles from './AccountContent.module.css'; // Import the module.css file

const AccountContent = () => {
  return (
    <div className={styles.accountContent}>
      <div className={styles.accountHeader}>
        <img src="/path-to-photo1.png" alt="Account" className={styles.accountPhoto} />
        <button className={styles.uploadButton}>Upload</button>
      </div>
      <div className={styles.accountDetails}>
        <div className={styles.accountItem}>
          <span>Full Name</span>
          <p>Michael Banjy PJ</p>
          <button className={styles.editButton}>Edit</button>
        </div>
        <div className={styles.accountItem}>
          <span>Email Address</span>
          <p>michaelbanjy2020@gmail.com</p>
          <button className={styles.editButton}>Edit</button>
        </div>
        <div className={styles.accountItem}>
          <span>Contact</span>
          <p>0803215678</p>
          <button className={styles.editButton}>Edit</button>
        </div>
        <div className={styles.accountItem}>
          <span>Password</span>
          <p>********</p>
          <button className={styles.editButton}>Edit</button>
        </div>
      </div>
      <button className={styles.saveButton}>Save</button>
    </div>
  );
};

export default AccountContent;

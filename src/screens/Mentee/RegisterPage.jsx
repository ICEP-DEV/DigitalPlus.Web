import React, { useState } from 'react';
import HeaderAnnouncementPage from '../Mentor/Headers/HeaderAnnouncementPage';
import SideBar from './Navigation/SideBar';
import styles from './RegisterPage.module.css'; // Import CSS module

const RegisterPage = () => {
  const [selectedModule, setSelectedModule] = useState('');
  const [mentors, setMentors] = useState([]);
  const [rating, setRating] = useState(0); // State to manage the slider value

  // Define mentors for each module
  const moduleMentors = {
    'PPA F05D': ['B Buthelezi', 'S Vinjwa', 'T Mmethi'],
    'PPB 216D': ['A Nkosi', 'L Dlamini', 'K Ndlovu'],
    'OOP 216D': ['M Khumalo', 'R Sithole', 'S Ncube'],
    'AOP 316D': ['J Moyo', 'C Hadebe', 'G Mthethwa'],
  };

  // Handle module change
  const handleModuleChange = (event) => {
    const selected = event.target.value;
    setSelectedModule(selected);
    setMentors(moduleMentors[selected] || []);
  };

  // Handle rating change
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <HeaderAnnouncementPage />
      <SideBar />
      <div className={styles.registerPageContainer}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            {/* <h1 className={styles.headerTitle}>REGISTER</h1> */}
            {/* <div className={styles.userInfo}>B MDLULI</div> */}
          </div>
          <div className={styles.formWrapper}>
            <div className={styles.formContainer}>
              <form>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Student Number:</label>
                  <input type="text" placeholder="Enter student number" className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Module Code:</label>
                  <select value={selectedModule} onChange={handleModuleChange} className={styles.input}>
                    <option value="" disabled>Select the module</option>
                    <option value="PPA F05D">PPA F05D</option>
                    <option value="PPB 216D">PPB 216D</option>
                    <option value="OOP 216D">OOP 216D</option>
                    <option value="AOP 316D">AOP 316D</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Choose Mentor:</label>
                  <select className={styles.input}>
                    <option value="" disabled>Select mentor</option>
                    {mentors.map((mentor, index) => (
                      <option key={index} value={mentor}>{mentor}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rating:</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={rating} // Bind the value to the state
                    onChange={handleRatingChange} // Handle the slider value change
                    className={styles.rangeSlider}
                  />
                  <div className={styles.sliderLabels}>
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                  </div>
                </div>

                <div className={styles.buttonContainer}>
                  <button type="submit" className={styles.submitButton}>Submit</button>
                </div>
              </form>
            </div>
            <div className={styles.commentContainer}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Comment:</label>
                <textarea placeholder="Write your comment" className={styles.textarea} />
                <i className={`fas fa-upload ${styles.uploadIcon}`}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

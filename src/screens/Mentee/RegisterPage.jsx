import React, { useState, useEffect } from 'react';
import styles from './RegisterPage.module.css'; // Import CSS module
import SideBarNavBar from './Navigation/SideBarNavBar';

const RegisterPage = () => {
  const [selectedModule, setSelectedModule] = useState('');
  const [mentors, setMentors] = useState([]);
  const [rating, setRating] = useState(0); // State to manage the slider value
  const [menteeID, setMenteeID] = useState(''); // State to store mentee ID
  const [fetchedMenteeID, setFetchedMenteeID] = useState(''); // New state for displaying mentor ID

  // Fetch Mentee ID from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.menteeID) {
      setMenteeID(storedUser.menteeID);
      setFetchedMenteeID(storedUser.menteeID); // Display mentee ID in Student Number field
    }
  }, []);

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
    <SideBarNavBar>
      <div className={styles.pageContainer}>
        <h1 className={styles.registerTitle}>REGISTER TO BE SIGNED AFTER THE SESSION</h1> 
        <div className={styles.registerPageContainer}>
          <div className={styles.mainContent}>
            <div className={styles.formWrapper}>
              <div className={styles.formContainer}>
                <form>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Student Number:</label>
                    {/* Display Mentee ID in the input field */}
                    <input 
                      
                      value={fetchedMenteeID} 
                      className={styles.input} 
                      readOnly
                      disabled 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Module Code:</label>
                    <select value={selectedModule} onChange={handleModuleChange} className={styles.input}>
                      <option value="" disabled>Module Code</option>
                      <option value="PPA F05D">PPA F05D</option>
                      {/* Add more modules as needed */}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mentor's Name:</label>
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
                      {[...Array(11).keys()].map((num) => (
                        <span key={num}>{num}</span>
                      ))}
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
    </SideBarNavBar>
  );
};

export default RegisterPage;

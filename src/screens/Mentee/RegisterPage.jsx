
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RegisterPage.module.css';
import SideBarNavBar from './Navigation/SideBarNavBar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullNames: ''
  });
  const [selectedModule, setSelectedModule] = useState('');
  const [mentors, setMentors] = useState([]);
  const [rating, setRating] = useState(0);
  const [isInactive, setIsInactive] = useState(true);
  const [moduleRegisters, setModuleRegisters] = useState([]);

  // Mock module-to-ID mapping
  const moduleToIdMapping = {
    'PPA F05D': 1,
    'PPB 216D': 2,
    'OOP 216D': 3,
    'AOP 316D': 4,
  };

  // Fetch user data and update state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        studentNumber: user.mentee_Id || '',
        fullNames: `${user.firstName} ${user.lastName}` || ''
      }));
    } else {
      console.warn('User data not found in localStorage');
    }
  }, []);

  // Handle module selection and fetch data
  const handleModuleChange = async (event) => {
    const selected = event.target.value;
    setSelectedModule(selected);

    // Map module to ID
    const moduleId = moduleToIdMapping[selected];

    // Fetch mentor registers for the selected module
    try {
      const response = await axios.get(
        `https://localhost:7163/api/MenteeAndMentorRegister/GetMentorRegister/ByModuleId/${moduleId}`
      );
      setModuleRegisters(response.data); // Save fetched data to state
      console.log('Fetched Mentor Registers:', response.data);

      // Update mentors based on response (optional if mentors are predefined)
      setMentors(response.data.map((register) => register.MentorId));
    } catch (error) {
      console.error('Error fetching mentor registers:', error);
    }
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const menteeRegisterData = {
      menteeID: formData.studentNumber,
      moduleCode: selectedModule,
      mentorName: event.target.mentor.value,
      rating: rating,
      comment: event.target.comment.value,
    };

    try {
      const response = await axios.post(
        'https://localhost:7163/api/MenteeAndMentorRegister/InsertMenteeRegister',
        menteeRegisterData
      );
      console.log('Mentee Register Added:', response.data);
    } catch (error) {
      console.error('Error adding mentee register:', error);
    }
  };

  return (
    <SideBarNavBar>
      <div className={`${styles.pageContainer} ${isInactive ? styles.inactivePage : ''}`}>
        <h1 className={styles.registerTitle}>REGISTER TO BE SIGNED AFTER THE SESSION</h1>
        <div className={styles.registerPageContainer}>
          <div className={styles.mainContent}>
            <div className={styles.formWrapper}>
              <div className={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Student Number:</label>
                    <input
                      type="text"
                      value={formData.studentNumber || 'Not Found'}
                      placeholder="Mentee ID"
                      disabled
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Module Code:</label>
                    <select
                      value={selectedModule}
                      onChange={handleModuleChange}
                      className={styles.input}
                    >
                      <option value="" disabled>
                        Module Code
                      </option>
                      {Object.keys(moduleToIdMapping).map((module) => (
                        <option key={module} value={module}>
                          {module}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mentor's Name:</label>
                    <select name="mentor" className={styles.input}>
                      <option>
                        Select mentor
                      </option>
                      {mentors.map((mentor, index) => (
                        <option key={index} value={mentor}>
                          {mentor}
                        </option>
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
                      value={rating}
                      onChange={handleRatingChange}
                      className={styles.rangeSlider}
                    />
                  </div>

                  <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.submitButton} disabled={isInactive}>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div className={styles.commentContainer}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Comment:</label>
                  <textarea
                    name="comment"
                    placeholder="Write your comment"
                    className={styles.textarea}
                  />
                  <i className={`fas fa-upload ${styles.uploadIcon}`} />
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


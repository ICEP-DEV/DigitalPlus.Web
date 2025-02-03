import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RegisterPage.module.css';
import SideBarNavBar from './Navigation/SideBarNavBar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullNames: '',
  });
  const [modules, setModules] = useState([]); // Modules from backend
  const [selectedModule, setSelectedModule] = useState(''); // User-selected module
  const [mentors, setMentors] = useState([]); // Mentors for the selected module
  const [rating, setRating] = useState(0);
  const [isInactive, setIsInactive] = useState(true);

  // Fetch user data and update form state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        studentNumber: user.mentee_Id || '',
        fullNames: `${user.firstName} ${user.lastName}` || '',
      }));
    } else {
      console.warn('User data not found in localStorage');
    }
  }, []);

  // Fetch all modules dynamically from backend
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(
          'https://localhost:7163/api/MenteeAndMentorRegister/GetRegisterByStatus?activation=true'
        );
        console.log("Modules fetched from API:", response.data);  // Log modules from the backend
        setModules(response.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchModules();
  }, []);

  // Fetch mentors for the selected module
  useEffect(() => {
    if (!selectedModule) {
      return;
    }

    const fetchMentorsForModule = async () => {
      try {
        console.log("Selected Module:", selectedModule); // Log selected module
        console.log("Modules:", modules); // Log entire modules array

        // Get the module object from the selected module code
        const module = modules.find((module) => module.moduleCode === selectedModule);

        console.log("Found Module:", module);  // Log the module object

        if (!module) {
          console.warn('Module with the selected moduleCode not found');
          return;
        }

        const moduleId = module.moduleId;  // Get moduleId from the module object
        console.log('Module ID:', moduleId);  // Log moduleId to ensure it's correct

        if (!moduleId) {
          console.warn('Module ID is missing or invalid');
          return;
        }

        const response = await axios.get(
          `https://localhost:7163/api/AssignMod/getmentorsBy_ModuleId/${moduleId}`
        );
        setMentors(response.data?.Mentors || []);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentorsForModule();
  }, [selectedModule, modules]);

  // Handle module selection
  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value); // Update selected module
    console.log("Selected Module Code:", event.target.value);  // Log selected module code
  };

  // Handle rating change
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const menteeRegisterData = {
      menteeID: formData.studentNumber,
      moduleCode: selectedModule,
      mentorID: event.target.mentor.value,
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
                        Select Module Code
                      </option>
                      {modules.map((module) => (
                        <option key={module.moduleId} value={module.moduleCode}>
                          {module.moduleCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mentor's Name:</label>
                    <select name="mentor" className={styles.input}>
                      <option value="" disabled>
                        Select Mentor
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

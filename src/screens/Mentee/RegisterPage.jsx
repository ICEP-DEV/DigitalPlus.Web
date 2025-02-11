import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RegisterPage.module.css';
import SideBarNavBar from './Navigation/SideBarNavBar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullNames: '',
  });
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [mentors, setMentors] = useState([]);
  const [rating, setRating] = useState(0);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [comment, setComment] = useState('');
  


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData({
        studentNumber: user.mentee_Id || '',
        fullNames: `${user.firstName} ${user.lastName}` || '',
      });
    } else {
      console.warn('User data not found in localStorage');
    }
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(
          'https://localhost:7163/api/MenteeAndMentorRegister/GetRegisterByStatus?activation=true'
        );

        // Remove duplicate modules based on moduleCode
        const uniqueModules = Array.from(
          new Map(response.data.map((mod) => [mod.moduleCode, mod])).values()
        );

        setModules(uniqueModules);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    if (!selectedModule || modules.length === 0) return;

    const fetchMentorsForModule = async () => {
      try {
        const module = modules.find((mod) => mod.moduleCode === selectedModule);
        if (!module) return;

        const response = await axios.get(
          `https://localhost:7163/api/MenteeAndMentorRegister/GetRegisterByStatusAndModuleId?activation=true&moduleId=${module.moduleId}`
        );
        setMentors(response.data || []);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
    fetchMentorsForModule();
  }, [selectedModule, modules]);

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleMentorChange = (event) => {
    setSelectedMentor(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedMentor || !comment || !selectedModule) {
      console.error('Please select a mentor, module, and comment');
      return;
    }
  
    // Log the selected values to check if they're set correctly
    console.log('Selected Mentor:', selectedMentor);
    console.log('Selected Module:', selectedModule);
  
    // Find the selected module by code
    const selectedModuleData = modules.find(m => m.moduleCode === selectedModule);
  
    // Ensure that the module and mentor IDs are being passed correctly
    const menteeRegisterData = {
      menteeID: Number(formData.studentNumber) || 0,
      moduleId: selectedModuleData ? selectedModuleData.moduleId : 0, // Use the found moduleId
      mentorID: Number(selectedMentor) || 0, // Use the selected mentor ID
      rating: rating,
      comment: comment,
    };
  
    console.log('Submitting Data:', menteeRegisterData); // Debugging log
  
    try {
      const response = await axios.post(
        'https://localhost:7163/api/MenteeAndMentorRegister/InsertMenteeRegister',
        menteeRegisterData,
        
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      console.log('Mentee Register Added:', response.data);
      alert('Successfully submitted!');
    } catch (error) {
      console.error('Error adding mentee register:', error);
  
      if (error.response) {
        console.error('Backend Response:', error.response.data);
        alert(`Submission failed: ${error.response.data.message || 'Unknown error'}`);
      } else {
        alert('Error: Unable to connect to backend.');
      }
    }
  };
  
  
  
  

  return (
    <SideBarNavBar>
      <div className={styles.pageContainer}>
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
                    <select
                      name="mentor"
                      value={selectedMentor}
                      onChange={handleMentorChange}
                      className={styles.input}
                    >
                      <option value="" disabled>
                        Select Mentor
                      </option>
                      {mentors.map((mentor, index) => (
                        <option key={index} value={mentor.mentorID}>
                          {mentor.mentorName}
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
                      <div className={styles.ratingLabels}>
                        {[...Array(11).keys()].map((num) => (
                          <span key={num} className={styles.ratingNumber}>
                            {num}
                          </span>
                        ))}
                      </div>
                  </div>


                  <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.submitButton}>
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
                    value={comment}
                    onChange={handleCommentChange}
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

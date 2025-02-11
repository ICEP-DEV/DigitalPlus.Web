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
  const [mentors, setMentors] = useState([]);
  const [rating, setRating] = useState(0);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null); // Use index for module selection
  const [selectedMentorIndex, setSelectedMentorIndex] = useState(null); // Use index for mentor selection
  const [comment, setComment] = useState('');
  const [registerDetails, setRegisterDetails] = useState([]);

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
    if (selectedModuleIndex === null || modules.length === 0) return;

    const fetchMentorsForModule = async () => {
      try {
        const selectedModuleData = modules[selectedModuleIndex];
        if (!selectedModuleData) return;

        const response = await axios.get(
          `https://localhost:7163/api/MenteeAndMentorRegister/GetRegisterByStatusAndModuleId?activation=true&moduleId=${selectedModuleData.moduleId}`
        );
        setMentors(response.data || []);
        console.log(mentors);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
    fetchMentorsForModule();
  }, [selectedModuleIndex, modules]);

  useEffect(()  =>{
    const fetchRegisterDetails = async() =>{
      const selectedModuleData = modules[selectedModuleIndex];
      try{
        const response = await axios.get(`https://localhost:7163/api/MenteeAndMentorRegister/GetRegisterByMentorIdAndModuleId?mentorId=${selectedMentorIndex}&moduleId=${selectedModuleData.moduleId}&activation=true`);
        setRegisterDetails(response.data);
        console.log(response.data || []);
      }catch(error){
        console.error('Error fetching register details:', error);
      }
    }

    fetchRegisterDetails();
  } ,[selectedModuleIndex, modules,selectedMentorIndex])

  const handleModuleChange = (event) => {
    setSelectedModuleIndex(Number(event.target.value)); // Set index instead of code
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleMentorChange = (event) => {
    console.log("Selected Mentor Value:", event.target.value); // Debugging
    setSelectedMentorIndex(Number(event.target.value)); // Set index of the selected mentor
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (selectedMentorIndex === null || selectedModuleIndex === null || !comment) {
      console.error('Please select a mentor, module, and comment');
      return;
    }
  
    const selectedModuleData = modules[selectedModuleIndex];
    const selectedMentorData = mentors[selectedMentorIndex];
  
    // Log the mentorID to the console before submitting
    console.log('Selected Mentor ID:', selectedMentorIndex ? selectedMentorIndex : 0);
  
    const menteeRegisterData = {
      MentorRegisterID: registerDetails[0].mentorRegisterID,
      menteeID: Number(formData.studentNumber) || 0,
      moduleId: selectedModuleData ? selectedModuleData.moduleId : 0, // Use the found moduleId
      mentorId: selectedMentorIndex ? selectedMentorIndex : 0, // Use the selected mentor ID
      ModuleCode: selectedModuleData ? selectedModuleData.moduleCode : '',
      rating: rating,
      comment: comment,
    };
  
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
                      value={selectedModuleIndex || ''}
                      onChange={handleModuleChange}
                      className={styles.input}
                    >
                      <option value="" disabled>
                        Select Module Code
                      </option>
                      {modules.map((module, index) => (
                        <option key={module.moduleId} value={index}>
                          {module.moduleCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mentor's Name:</label>
                    <select
                      value={selectedMentorIndex || ''}
                      onChange={handleMentorChange}
                      className={styles.input}
                    >
                      <option value="" disabled>
                        Select Mentor
                      </option>
                      {mentors.map((mentor, index) => (
                        <option key={index} value={mentor.mentorId}>
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

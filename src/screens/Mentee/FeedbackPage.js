import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FeedbackPage.module.css'; 
import { FaCheckCircle } from 'react-icons/fa';
import SideBarNavBar from './Navigation/SideBarNavBar';

const FeedbackPage = () => {
  const [complains, setComplains] = useState({
    menteeEmail: '',
    mentorEmail: '',
    moduleName: '',
    complaint: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(''); 
  const [allMentors, setAllMentors] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [mentorsByModule, setMentorsByModule] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplains({ ...complains, [name]: value });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); 
    if (user) {
      setUserData(user);
      setComplains(prevState => ({
        ...prevState,
        menteeEmail: user.studentEmail
      }));
    }

    const fetchAllMentors = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentors');
        if (response.data) {
          setAllMentors(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAllModules = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
        if (response.data) {
          setAllModules(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllMentors();
    fetchAllModules();
  }, []);

  // Fetch mentors when module is selected
  const handleModuleChange = async (e) => {
    const selectedModuleCode = e.target.value;
    
    if (selectedModuleCode) {
      try {
        // Assuming you have an endpoint to get mentors by module code
        const response = await axios.get(`https://localhost:7163/api/AssignMod/getmentorsBy_ModuleId/${selectedModuleCode}`);
        if (response.data) {
          setMentorsByModule(response.data);
        }
      } catch (error) {
        console.error('Error fetching mentors by module:', error);
      }
      
      setComplains({
        ...complains,
        moduleName: selectedModuleCode,
        mentorEmail: '' // Reset mentor email when module changes
      });
    } else {
      setMentorsByModule([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      menteeEmail: complains.menteeEmail,
      mentorEmail: complains.mentorEmail,
      moduleName: complains.moduleName,
      complaintDescription: complains.complaint,
      dateLogged: new Date().toISOString(),
      status: 'Pending',
      action: 0,
    };

    try {
      const response = await axios.post(
        'https://localhost:7163/api/DigitalPlusCrud/AddComplaint',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      clearForm();
    } catch (error) {
      console.error('Error during form submission:', error);
      if (error.response) {
        console.error('Backend response error:', error.response.data);
      }
    }
  };

  const clearForm = () => {
    setComplains({
      menteeEmail: userData.studentEmail,
      mentorEmail: '',
      moduleName: '',
      complaint: '',
    });
    setMentorsByModule([]);
  };

  return (
    <SideBarNavBar>
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.complaintsSection}>
            <h1 className={styles.complaintsTitle}>We Value Your Complaints</h1>
            <p className={styles.anonymityNotice}>
              Please provide your complaint below. Your responses will remain anonymous.
            </p>
            <form onSubmit={handleSubmit} className={styles.complaintsForm}>
              <div className={styles.inputGroup}>
                <div className={styles.inputContainer}>
                  <label htmlFor="menteeEmail">MENTEE's EMAIL:</label>
                  <input
                    type="email"
                    id="menteeEmail"
                    name="menteeEmail"
                    value={userData.studentEmail || ''}
                    onChange={handleChange}
                    className={styles.inputField}
                    required
                    readOnly
                  />
                </div>
              </div>
              
              <div className={styles.inputContainer}>
                <label htmlFor="moduleName">MODULE NAME:</label>
                <select
                  id="moduleName"
                  name="moduleName"
                  value={complains.moduleName}
                  onChange={handleModuleChange}
                  className={styles.inputField}
                  required
                >
                  <option value="">Select a module</option>
                  {allModules.map((module) => (
                    <option key={module.module_Code} value={module.module_Code}>
                      {module.module_Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="mentorEmail">MENTOR's NAME:</label>
                <select
                  id="mentorEmail"
                  name="mentorEmail"
                  value={complains.mentorEmail}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                  disabled={!complains.moduleName}
                >
                  <option value="">Select a mentor</option>
                  {mentorsByModule.length > 0 ? (
                    mentorsByModule.map((mentor) => (
                      <option key={mentor.studentEmail} value={mentor.studentEmail}>
                        {mentor.firstName} {mentor.lastName}
                      </option>
                    ))
                  ) : (
                    allMentors.map((mentor) => (
                      <option key={mentor.studentEmail} value={mentor.studentEmail}>
                        {mentor.firstName} {mentor.lastName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="complaint">YOUR COMPLAINT:</label>
                <textarea
                  id="complaint"
                  name="complaint"
                  value={complains.complaint}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Share your complaint"
                  className={styles.textArea}
                  required
                />
              </div>
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton}>Submit Complaint</button>
                <button type="button" onClick={clearForm} className={styles.clearButton}>Clear Form</button>
              </div>
            </form>
          </div>
        </div>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <FaCheckCircle className={styles.modalIcon} />
              <p>Thank you for your complaint!</p>
              <p>Timestamp: {new Date().toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </SideBarNavBar>
  );
};

export default FeedbackPage;
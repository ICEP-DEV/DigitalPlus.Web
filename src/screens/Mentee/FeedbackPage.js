import React, { useState } from 'react';
import axios from 'axios'; // Make sure to import axios
import styles from './FeedbackPage.module.css'; 
import { FaCheckCircle } from 'react-icons/fa'; // Import success icon
import SideBarNavBar from './Navigation/SideBarNavBar';

const FeedbackPage = () => {
  const [complains, setComplains] = useState({
    menteeEmail: '',
    mentorEmail: '',
    moduleName: '',
    complaint: '',
  });
  const [showModal, setShowModal] = useState(false); // State for showing modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplains({ ...complains, [name]: value });
  };

  // Sample mentor options
  const mentors = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7163/api/DigitalPlusCrud/AddComplaint', complains);
      console.log('ComplainsSent', response.data);
      setShowModal(true); // Show modal after form submission
      setTimeout(() => {
        setShowModal(false); // Hide modal after 3 seconds
      }, 3000);
      clearForm();
    } catch (error) {
      console.log(error);
    }
  };

  // Clear form fields
  const clearForm = () => {
    setComplains({
      menteeEmail: '',
      mentorEmail: '',
      moduleName: '',
      complaint: '',
    });
  };

  return (
    <SideBarNavBar>
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {/* Complaints Section */}
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
                    name="menteeEmail" // Ensure name matches state
                    value={complains.menteeEmail}
                    onChange={handleChange}
                    placeholder="Enter mentee's email"
                    className={styles.inputField}
                    required
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label htmlFor="mentorEmail">MENTOR's EMAIL:</label>
                  <input
                    type="text"
                    id="mentorEmail"
                    name="mentorEmail" // Ensure name matches state
                    value={complains.mentorEmail}
                    onChange={handleChange}
                    placeholder="Enter mentor email"
                    className={styles.inputField}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="moduleName">MODULE NAME:</label>
                <input
                  type="text"
                  id="moduleName"
                  name="moduleName" // Ensure name matches state
                  value={complains.moduleName}
                  onChange={handleChange}
                  placeholder="Enter module name"
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="mentorSelect">MENTOR's NAME:</label>
                <select
                  id="mentorSelect"
                  name="mentorEmail" // Ensure name matches state
                  value={complains.mentorEmail}
                  onChange={(e) => {
                    const selectedMentor = mentors.find(mentor => mentor.email === e.target.value);
                    setComplains({ ...complains, mentorEmail: selectedMentor ? selectedMentor.email : '' });
                  }}
                  className={styles.inputField}
                  required
                >
                  <option value="">Select a mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.email} value={mentor.email}>
                      {mentor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="complaint">YOUR COMPLAINT:</label>
                <textarea
                  id="complaint"
                  name="complaint" // Ensure name matches state
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

        {/* Modal for thank you message */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <FaCheckCircle className={styles.modalIcon} />
              <p>Thank you for your complaint!</p>
              <p>Timestamp: {new Date().toLocaleString()}</p> {/* Display timestamp */}
            </div>
          </div>
        )}
      </div>
    </SideBarNavBar>
  );
};

export default FeedbackPage;

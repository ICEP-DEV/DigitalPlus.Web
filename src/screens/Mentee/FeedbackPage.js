import React, { useState } from 'react';
import styles from './FeedbackPage.module.css'; 
import { FaCheckCircle } from 'react-icons/fa'; // Import success icon
import SideBarNavBar from './Navigation/SideBarNavBar';

const FeedbackPage = () => {
  const [menteeEmail, setMenteeEmail] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [complaint, setComplaint] = useState('');
  const [showModal, setShowModal] = useState(false); // State for showing modal

  // Sample mentor options
  const mentors = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show modal after form submission
    setTimeout(() => {
      setShowModal(false); // Hide modal after 3 seconds
    }, 3000);
    clearForm();
  };

  // Clear form fields
  const clearForm = () => {
    setMenteeEmail('');
    setMentorEmail('');
    setModuleName('');
    setComplaint('');
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
                    value={menteeEmail}
                    onChange={(e) => setMenteeEmail(e.target.value)}
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
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
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
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder="Enter module name"
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="mentorSelect">MENTOR's NAME:</label>
                <select
                  id="mentorSelect"
                  value={mentorEmail}
                  onChange={(e) => {
                    const selectedMentor = mentors.find(mentor => mentor.email === e.target.value);
                    setMentorEmail(selectedMentor ? selectedMentor.email : '');
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
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
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

// src/pages/FeedbackPage/FeedbackPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './FeedbackPage.module.css'; 
import { FaCheckCircle, FaUserCircle } from 'react-icons/fa'; // Import profile icon
import SideBarNavBar from './Navigation/SideBarNavBar';

const FeedbackPage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false); // State for showing modal

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
    setName('');
    setSurname('');
    setComment('');
  };

  return (
    <SideBarNavBar>
    <div className={styles.pageContainer}>


      <div className={styles.contentWrapper}>

        {/* Feedback Section */}
        <div className={styles.feedbackSection}>
          <h1 className={styles.feedbackTitle}>We Value Your Feedback</h1>
          <p className={styles.anonymityNotice}>
            Please provide your feedback below...Your responses will remain anonymous.
          </p>
          <form onSubmit={handleSubmit} className={styles.feedbackForm}>
            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <label htmlFor="name">MENTOR'S NAME:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter mentor's first name"
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="surname">MENTOR'S SURNAME</label>
                <input
                  type="text"
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Enter mentor's last name"
                  className={styles.inputField}
                  required
                />
              </div>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="comment">YOUR FEEDBACK:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                placeholder="Share your experience or any concerns"
                className={styles.textArea}
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton}>Submit Feedback</button>
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
            <p>Thank you for your feedback!</p>
          </div>
        </div>
      )}
    </div>
    </SideBarNavBar>
  );
};

export default FeedbackPage;

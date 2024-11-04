import React, { useState,useEffect } from 'react';
import { FaUser, FaBook, FaClock, FaPen, FaIdCard, FaCheckCircle } from 'react-icons/fa'; // Importing icons
import styles from './BookingPage.module.css'; // Import the CSS Module
import SideBarNavBar from "./Navigation/SideBarNavBar";
import axios from 'axios'; // Import axios for API requests

const Booking = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullNames: '',
    moduleId: '',
    mentorId: '',
    lessonType: '',
    dateTime: ''
   
  });

  const [showSuccess, setShowSuccess] = useState(false); // State to control success popup visibility


  useEffect(() =>{
     
      const user=JSON.parse(localStorage.getItem('user'));
      if(user){
        setFormData((prevData) => ({
          ...prevData,
          studentNumber:user.mentee_Id,
          fullNames : `${user.firstName} ${user.lastName}`
        }));
      }
      
  },[]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await axios.post( 'https://localhost:7163/api/DigitalPlusCrud/AddAppointment', formData); // Replace with your API endpoint
      console.log(response.data);

      // Show success popup
      setShowSuccess(true);

      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      setFormData({
      moduleId: '',
      mentorId: '',
      lessonType: '',
      dateTime: ''
    });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <SideBarNavBar>
    <div className={styles.bookingContainer}>
      <h2 className={styles.bookingTitle}>BOOK A MENTOR</h2>
      <form className={styles.bookingForm} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>STUDENT NUMBER:</label>
            <div className={styles.inputGroup}>
              <FaIdCard className={styles.icon} />
              <input
                type="text"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                placeholder={formData.studentNumber}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>NAME AND SURNAME:</label>
            <div className={styles.inputGroup}>
              <FaUser className={styles.icon} />
              <input
                type="text"
                name="fullNames"
                value={formData.fullNames}
                onChange={handleChange}
                placeholder={formData.fullNames}
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>MODULE:</label>
            <div className={styles.inputGroup}>
              <FaBook className={styles.icon} />
              <select name="moduleId" value={formData.moduleId} onChange={handleChange}>
                <option value="">Select Module</option>
                <option value="1">PPA</option>
                <option value="2">PPB</option>
                <option value="3">OOP</option>
                <option value="4">AOP</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>MENTOR:</label>
            <div className={styles.inputGroup}>
              <FaUser className={styles.icon} />
              <select name="mentorId" value={formData.mentorId} onChange={handleChange}>
                <option value="">Select a mentee</option>
                <option value="1">Danny Dietz</option>
                <option value="2">Mike Murphy</option>
                <option value="3">Axelson</option>
                <option value="4">Marcus Luttrell</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>LESSON TYPE:</label>
            <div className={styles.inputGroup}>
              <FaPen className={styles.icon} />
              <select name="lessonType" value={formData.lessonType} onChange={handleChange}>
                <option value="">Select lesson type</option>
                <option value="Contact">Contact</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>TIME:</label>
            <div className={styles.inputGroup}>
              <FaClock className={styles.icon} />
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>SUBMIT</button>
        </div>
      </form>

      {/* Success Popup */}
      {showSuccess && (
        <div className={styles.successPopup}>
          <FaCheckCircle className={styles.successIcon} />
          <p>YOU SUCCESSFULLY CREATED YOUR BOOKING. CHECK YOUR NOTIFICATIONS FOR MENTOR’S RESPONSE</p>
        </div>
      )}
    </div>
    </SideBarNavBar>
  );
};

export default Booking;

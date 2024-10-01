import React, { useState } from 'react';
import { FaUser, FaBook, FaClock, FaPen, FaIdCard, FaCheckCircle } from 'react-icons/fa'; // Importing icons
import styles from './Booking.module.css';  // Import CSS module
import SideBarNavBar from './Navigation/SideBarNavBar';
const Booking = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    module: '',
    mentor: '',
    name: '',
    time: '',
    lessonType: '',
  });

  const [showSuccess, setShowSuccess] = useState(false); // State to control success popup visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
    // Show success popup
    setShowSuccess(true);

    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <SideBarNavBar>
    <div className={styles['booking-container']}>
      <h2 className={styles['booking-title']}>BOOK A MENTOR</h2>
      <form className={styles['booking-form']} onSubmit={handleSubmit}>
        <div className={styles['form-row']}>
          <div className={styles['form-group']}>
            <label>STUDENT NUMBER:</label>
            <div className={styles['input-group']}>
              <FaIdCard className={styles.icon} />
              <input
                type="text"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                placeholder="Enter student number"
              />
            </div>
          </div>
          <div className={styles['form-group']}>
            <label>MODULE:</label>
            <div className={styles['input-group']}>
              <FaBook className={styles.icon} />
              <select name="module" value={formData.module} onChange={handleChange}>
                <option value="">Select a module</option>
                <option value="Math">INT316D</option>
                <option value="Physics">MOB316D</option>
                <option value="Programming">DBP316D</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles['form-row']}>
          <div className={styles['form-group']}>
            <label>MENTOR:</label>
            <div className={styles['input-group']}>
              <FaUser className={styles.icon} />
              <select name="mentor" value={formData.mentor} onChange={handleChange}>
                <option value="">Select a mentor</option>
                <option value="Danny Dietz">Danny Dietz</option>
                <option value="Mike Murphy">Mike Murphy</option>
                <option value="Axelson">Axelson</option>
                <option value="Marcus Luttrell">Marcus Luttrell</option>
              </select>
            </div>
          </div>
          <div className={styles['form-group']}>
            <label>NAME AND SURNAME:</label>
            <div className={styles['input-group']}>
              <FaUser className={styles.icon} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name and surname"
              />
            </div>
          </div>
        </div>

        <div className={styles['form-row']}>
          <div className={styles['form-group']}>
            <label>LESSON TYPE:</label>
            <div className={styles['input-group']}>
              <FaPen className={styles.icon} />
              <select name="lessonType" value={formData.lessonType} onChange={handleChange}>
                <option value="">Select lesson type</option>
                <option value="Theory">Contact</option>
                <option value="Practical">Online</option>
              </select>
            </div>
          </div>
          <div className={styles['form-group']}>
            <label>TIME:</label>
            <div className={styles['input-group']}>
              <FaClock className={styles.icon} />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles['submit-container']}>
          <button type="submit" className={styles['submit-button']}>SUBMIT</button>
        </div>
      </form>

      {/* Success Popup */}
      {showSuccess && (
        <div className={styles['success-popup']}>
          <FaCheckCircle className={styles['success-icon']} />
          <p>YOU SUCCESSFULLY CREATED YOUR BOOKING
          CHECK YOUR NOTIFICATIONS FOR MENTOR’S RESPONSE
          </p>
        </div>
      )}
    </div>
    </SideBarNavBar>
  );
};

export default Booking;

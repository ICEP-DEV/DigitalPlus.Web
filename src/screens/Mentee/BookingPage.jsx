import React, { useState,useEffect } from 'react';
import { FaUser, FaBook, FaClock, FaPen, FaIdCard, FaCheckCircle } from 'react-icons/fa'; // Importing icons
import styles from './BookingPage.module.css'; // Import the CSS Module
import SideBarNavBar from "./Navigation/SideBarNavBar";
import axios from 'axios'; 

const Booking = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullNames: '',
    moduleId: '',
    mentorId: '',
    lessonType: '',
    dateTime: ''
   
  });

  const[allmodules, setAllModules] = useState([])
  const [showSuccess, setShowSuccess] = useState(false); 
  const [mentors, setMentors] = useState([]); // State to store mentors based on moduleId
 

  useEffect(() =>{
     
      const user=JSON.parse(localStorage.getItem('user'));
      if(user){
        setFormData((prevData) => ({
          ...prevData,
          studentNumber:user.mentee_Id,
          fullNames : `${user.firstName} ${user.lastName}`
        }));
      }

      const fetchAllModules = async () => {
        try{
         const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
         if(response.data){
           setAllModules(response.data.result)
         }
   
        }catch(error){
          console.log(error)
        }
     }
  
      
      fetchAllModules()
  },[]);

  const fetchMentorsByModule = async (moduleId) => {
    try {
      const response = await axios.get(`https://localhost:7163/api/AssignMod/module/${moduleId}/mentors`);
      console.log(response.data.data);
      if (response.data && response.data.data) {
        setMentors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentors([]); // Reset mentors on error
    }
  };

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'moduleId' && value) {
      fetchMentorsByModule(value);
      // Reset mentor selection when module changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        mentorId: '' // Reset mentor selection
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await axios.post( 'https://localhost:7163/api/DigitalPlusCrud/AddAppointment', formData); 
      console.log(response.data);

      // Show success popup
      setShowSuccess(true);

      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      setFormData(prev =>({
        ...prev,
      moduleId: '',
      mentorId: '',
      lessonType: '',
      dateTime: ''
    }));
    setMentors([]); // Clear mentors list
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
                disabled
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
                disabled
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
                {allmodules.map((module,mid) => (
              <option key={mid+1} value={mid+1}>
                {module.module_Code}
              </option>
            ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>MENTOR:</label>
            <div className={styles.inputGroup}>
              <FaUser className={styles.icon} />
              <select name="mentorId" value={formData.mentorId} onChange={handleChange} disabled={!formData.moduleId}>
              <option value="">Select a mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.mentorId} value={mentor.mentorId}>
                      {`${mentor.firstName} ${mentor.lastName}`}
                    </option>
                  ))}
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

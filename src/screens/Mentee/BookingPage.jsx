import React, { useState, useEffect } from 'react'; 
import { FaUser, FaBook, FaClock, FaPen, FaIdCard, FaCheckCircle } from 'react-icons/fa'; 
import styles from './BookingPage.module.css'; 
import SideBarNavBar from "./Navigation/SideBarNavBar";
import axios from 'axios'; 

const Booking = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullNames: '',
    mentorId: '',
    moduleId: '', // For selected module from mentor's assigned modules
    lessonType: '',
    dateTime: ''
  });

  const [allMentors, setAllMentors] = useState([]);
  const [mentorModules, setMentorModules] = useState([]); // Modules assigned to selected mentor
  const [showSuccess, setShowSuccess] = useState(false); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        studentNumber: user.mentee_Id,
        fullNames: `${user.firstName} ${user.lastName}`
      }));
    }

    const fetchMentors = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentors');
        if (response.data) {
          setAllMentors(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMentors();
  }, []);

  const fetchModulesByMentor = async (mentorId) => {
    try {
      const response = await axios.get(`https://localhost:7163/api/AssignMod/getmodulesBy_MentorId/${mentorId}`);
      console.log(response.data);
      if (response.data && response.data) {
        setMentorModules(response.data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      setMentorModules([]); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'mentorId' && value) {
      fetchModulesByMentor(value); // Fetch modules when a mentor is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await axios.post('https://localhost:7163/api/DigitalPlusCrud/AddAppointment', formData); 
      console.log(response.data);

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      setFormData(prev => ({
        ...prev,
        mentorId: '',
        moduleId: '', // Clear selected module after submission
        lessonType: '',
        dateTime: ''
      }));
      setMentorModules([]);
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
                  placeholder={formData.fullNames}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>MENTOR:</label>
              <div className={styles.inputGroup}>
                <FaUser className={styles.icon} />
                <select name="mentorId" value={formData.mentorId} onChange={handleChange}>
                  <option value="">Select a mentor</option>
                  {allMentors.map((mentor) => (
                    <option key={mentor.mentorId} value={mentor.mentorId}>
                      {`${mentor.firstName} ${mentor.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>MODULE:</label>
              <div className={styles.inputGroup}>
                <FaBook className={styles.icon} />
                <select name="moduleId" value={formData.moduleId} onChange={handleChange} disabled={!formData.mentorId}>
                  <option value="">Select Module</option>
                  {mentorModules.map((module) => (
                    <option key={module.assignModId} value={module.assignModId}>
                      {module.moduleCode}
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

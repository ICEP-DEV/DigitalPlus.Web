import React, { useState, useEffect } from 'react';
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
  const [userData, setUserData] = useState(''); 
  const [mentorsdetails, setMentorsDetails] = useState([]);
  const[allmodules, setAllModules] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplains({ ...complains, [name]: value });
  };
  

  // Retrieving data from the local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); 
    if (user) {
      setUserData(user);
      console.log(user) 
      setComplains((prevState) => ({
        ...prevState,
        menteeEmail: user.studentEmail // Automatically set the mentee's email
      }));
    }

    const fetchMentordetails = async () => {
      try{
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentors');
        if(response.data){
          setMentorsDetails(response.data)
          console.log(response.data)
        }
   
      }catch(error){
        console.log(error);
      }
    }

    const fetchAllModules = async () => {
      try{
       const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
       if(response.data){
         setAllModules(response.data.result)
         console.log(response.data.result)
       }
 
      }catch(error){
        console.log(error)
      }
   }

    fetchMentordetails()
    fetchAllModules()
  }, []);

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare the payload according to the structure expected by the backend
  const payload = {
    menteeEmail: complains.menteeEmail,
    mentorName: complains.mentorName, // Ensure that this field exists in your state
    mentorEmail: complains.mentorEmail,
    moduleName: complains.moduleName,
    complaintDescription: complains.complaint, // Map 'complaint' to 'complaintDescription'
    dateLogged: new Date().toISOString(), // Use current date and time
    status: 'Pending', // Example status, adjust as necessary
    action: 0, // Assuming '0' is the default value for action
  };

  try {
    // Log the payload before sending to verify its structure
    console.log('Payload being sent:', payload);

    const response = await axios.post(
      'https://localhost:7163/api/DigitalPlusCrud/AddComplaint',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('ComplainsSent', response.data);

    // Show modal after form submission
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false); // Hide modal after 3 seconds
    }, 3000);

    // Clear form after successful submission
    clearForm();
  } catch (error) {
    console.error('Error during form submission:', error);

    // Log backend error response if available
    if (error.response) {
      console.error('Backend response error:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
};




  // Clear form fields
  const clearForm = () => {
    setComplains({
      menteeEmail: userData.studentEmail,
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
                    value={userData.studentEmail}
                    onChange={handleChange}
                    placeholder={userData.studentEmail}
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
          <select
            id="moduleName"
            name="moduleName"
            value={allmodules.module_Code}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="">Select a module</option>
            {allmodules.map((module,mid) => (
              <option key={mid} value={module.module_Code}>
                {module.module_Code}
              </option>
            ))}
          </select>
        </div>
              <div className={styles.inputContainer}>
                <label htmlFor="mentorSelect">MENTOR's NAME:</label>
                <select
                  id="mentorSelect"
                  name="mentorEmail" // Ensure name matches state
                  value={complains.mentorEmail}
                  onChange={(e) => {
                    const selectedMentor = mentorsdetails.find(mentor => mentor.studentEmail === e.target.value);
                    setComplains({ ...complains, mentorEmail: selectedMentor ? selectedMentor.studentEmail : '' });
                  }}
                  className={styles.inputField}
                  required
                >
                  <option value="">Select a mentor</option>
                  {mentorsdetails.map((mentor) => (
                    <option key={mentor.studentEmail} value={mentor.studentEmail}>
                      {mentor.firstName}
                      {" "}
                      {mentor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="complaint">YOUR COMPLAINT:</label>
                <textarea
                  id="complaint"
                  name="complaint" // Ensure name matches state
                  value={complains.complaintDescription}
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

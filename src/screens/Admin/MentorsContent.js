import React, { useState, useEffect } from 'react';
import styles from './MentorsContent.module.css';
import axios from 'axios';

const MentorsContent = () => {
  const modules = ['Module 1', 'Module 2', 'Module 3', 'Module 4'];
  const labs = ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4'];

  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mentorForm, setMentorForm] = useState({
    firstName: '',
    lastName: '',
    studentEmail: '',
    personalEmail: '',
    contactNo: '',
    password: '',
    activated: true,
    module: '',
    lab: '',
    mentorId: null // Store mentorId for editing
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentors');
        const data = response.data.map(mentor => ({
          ...mentor,
          activated: !!mentor.activated, // Convert bit to boolean
          mentorId: mentor.mentorId // Store mentorId
        }));
        setMentors(data); // Set fetched mentors
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
    fetchMentors();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.studentEmail.toLowerCase().includes(searchTerm)
  );

  const handleFormChange = (field, value) => {
    setMentorForm({ ...mentorForm, [field]: value });
  };

  const handleAddMentor = async () => {
    try {
      // Construct the new mentor object
      const newMentor = {
        mentorId: 0, // Set to 0, as the server will assign a new ID
        firstName: mentorForm.firstName,
        lastName: mentorForm.lastName,
        studentEmail: mentorForm.studentEmail,
        personalEmail: mentorForm.personalEmail,
        contactNo: mentorForm.contactNo,
        password: mentorForm.password,
        available: mentorForm.available !== undefined ? mentorForm.available : 0, // Default available to 0 if undefined
        activated: mentorForm.activated ? true : false // Ensure activated is boolean
      };
  
      console.log('New Mentor Payload:', newMentor); // Log the payload for debugging
  
      // Make the API request to add the new mentor
      const response = await axios.post(
        `https://localhost:7163/api/DigitalPlusUser/AddMentor`,
        newMentor,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Add the new mentor to the state if the response is successful
      setMentors([...mentors, response.data]); // Assuming the response contains the newly created mentor
      resetForm();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding mentor:', error.response ? error.response.data : error.message);
    }
  };
  

  const handleEditMentor = async () => {
    try {
      // Ensure mentorId is not null or undefined
      if (!mentorForm.mentorId) {
        console.error('MentorId is null or undefined');
        return;
      }
  
      // Construct the updated mentor object with mentorId and available fields
      const updatedMentor = {
        mentorId: mentorForm.mentorId,  // Include mentorId in the payload
        firstName: mentorForm.firstName,
        lastName: mentorForm.lastName,
        studentEmail: mentorForm.studentEmail,
        personalEmail: mentorForm.personalEmail,
        contactNo: mentorForm.contactNo,
        password: mentorForm.password,
        available: mentorForm.available !== undefined ? mentorForm.available : 0, // Ensure available is provided
        activated: mentorForm.activated ? true : false // Ensure activated is boolean
      };
  
      console.log('MentorId for update:', mentorForm.mentorId); // Log mentorId for debugging
      console.log('Updated Mentor Payload:', updatedMentor); // Log the payload for debugging
  
      // Make the API request to update the mentor using mentorForm.mentorId
      const response = await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateMentor/${mentorForm.mentorId}`,
        updatedMentor,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Update the state with the edited mentor if the response is successful
      const updatedMentors = mentors.map(mentor =>
        mentor.mentorId === mentorForm.mentorId ? { ...mentor, ...updatedMentor } : mentor
      );
      setMentors(updatedMentors);
      resetForm();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating mentor:', error.response ? error.response.data : error.message);
    }
  };
  
  
  
  
  const openAddMentorModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const openEditMentorModal = (mentor) => {
    console.log('Opening edit for mentor:', mentor); // Log mentor data
    setMentorForm(mentor); // Load mentor data into the form including mentorId
    setIsEditing(true);
    setIsModalVisible(true);
  };
  

  const toggleStatus = (studentEmail) => {
    const updatedMentors = mentors.map(mentor => {
      if (mentor.studentEmail === studentEmail) {
        return {
          ...mentor,
          activated: !mentor.activated // Toggle activation status
        };
      }
      return mentor;
    });
    setMentors(updatedMentors);
  };

  const resetForm = () => {
    setMentorForm({
      firstName: '',
      lastName: '',
      studentEmail: '',
      personalEmail: '',
      contactNo: '',
      password: '',
      activated: true,
      module: '',
      lab: '',
      mentorId: null // Reset mentorId
    });
  };

  const downloadCSV = () => {
    const headers = ['First Name', 'Last Name', 'Student Email', 'Personal Email', 'Contact No', 'Password', 'Activated', 'Module', 'Lab'];
    const rows = mentors.map(mentor => [
      mentor.firstName,
      mentor.lastName,
      mentor.studentEmail,
      mentor.personalEmail,
      mentor.contactNo,
      mentor.password,
      mentor.activated ? 'ACTIVATED' : 'DEACTIVATED',
      mentor.module,
      mentor.lab
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'mentors_list.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={styles.mentorsContainer}>
      <div className={styles.header}>
        <div className={styles.searchBarContainer}>
          <input
            type="text"
            placeholder="Search by Student Email"
            className={styles.searchBar}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.downloadCsvButton} onClick={downloadCSV}>
            Download List
          </button>
          <button className={styles.addMentorButton} onClick={openAddMentorModal}>
            Add Mentor
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.mentorsTable}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Student Email</th>
              <th>Personal Email</th>
              <th>Contact No</th>
              <th>Password</th>
              <th>Status</th>
              <th>Module</th>
              <th>Lab</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor, index) => (
                <tr key={index}>
                  <td>{mentor.firstName}</td>
                  <td>{mentor.lastName}</td>
                  <td>{mentor.studentEmail}</td>
                  <td>{mentor.personalEmail}</td>
                  <td>{mentor.contactNo}</td>
                  <td>{mentor.password}</td>
                  <td>
                    <button
                      className={`${styles.statusToggleButton} ${mentor.activated ? styles.activate : styles.deactivate}`}
                      onClick={() => toggleStatus(mentor.studentEmail)}
                    >
                      {mentor.activated ? 'ACTIVATED' : 'DEACTIVATED'}
                    </button>
                  </td>
                  <td>{mentor.module}</td>
                  <td>{mentor.lab}</td>
                  <td>
                    <button className={styles.manageButton} onClick={() => openEditMentorModal(mentor)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className={styles.noMentorsMessage}>
                  No mentors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{isEditing ? 'Edit Mentor' : 'Add Mentor'}</h2>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={mentorForm.firstName}
                onChange={(e) => handleFormChange('firstName', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={mentorForm.lastName}
                onChange={(e) => handleFormChange('lastName', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Student Email:</label>
              <input
                type="email"
                value={mentorForm.studentEmail}
                onChange={(e) => handleFormChange('studentEmail', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Personal Email:</label>
              <input
                type="email"
                value={mentorForm.personalEmail}
                onChange={(e) => handleFormChange('personalEmail', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Contact No:</label>
              <input
                type="text"
                value={mentorForm.contactNo}
                onChange={(e) => handleFormChange('contactNo', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={mentorForm.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                value={mentorForm.activated}
                onChange={(e) => handleFormChange('activated', parseInt(e.target.value))}
                className={styles.selectField}
              >
                <option value={1}>ACTIVATED</option>
                <option value={0}>DEACTIVATED</option>
              </select>
            </div>
            <div>
              <label>Module:</label>
              <select
                value={mentorForm.module}
                onChange={(e) => handleFormChange('module', e.target.value)}
                className={styles.selectField}
              >
                <option value="">Select Module</option>
                {modules.map((module, index) => (
                  <option key={index} value={module}>{module}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Lab:</label>
              <select
                value={mentorForm.lab}
                onChange={(e) => handleFormChange('lab', e.target.value)}
                className={styles.selectField}
              >
                <option value="">Select Lab</option>
                {labs.map((lab, index) => (
                  <option key={index} value={lab}>{lab}</option>
                ))}
              </select>
            </div>
            <div className={styles.modalButtons}>
              <button onClick={isEditing ? handleEditMentor : handleAddMentor}>
                {isEditing ? 'Update Mentor' : 'Add Mentor'}
              </button>
              <button onClick={() => setIsModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorsContent;

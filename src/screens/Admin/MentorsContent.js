import React, { useState, useEffect } from 'react';
import styles from './MentorsContent.module.css';
import axios from 'axios';

const MentorsContent = () => {
  const modules = ['Module 1', 'Module 2', 'Module 3', 'Module 4'];
  const labs = ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4'];

  // State to store mentors
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mentorForm, setMentorForm] = useState({
    firstName: '',
    lastName: '',
    studentEmail: '',
    personalEmail: '',
    contactNo: '',
    password: '',
    activated: 1, // Default is activated
    module: '',
    lab: ''
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch mentors from the API when the component mounts
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentors');
        setMentors(response.data); // Set the fetched mentors in state
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.studentEmail.toLowerCase().includes(searchTerm)
  );

  const handleFormChange = (field, value) => {
    setMentorForm({ ...mentorForm, [field]: value });
  };

  const handleAddMentor = () => {
    setMentors([...mentors, mentorForm]);
    resetForm();
    setIsModalVisible(false);
  };

  const handleEditMentor = () => {
    const updatedMentors = mentors.map(mentor =>
      mentor.studentEmail === mentorForm.studentEmail ? mentorForm : mentor
    );
    setMentors(updatedMentors);
    resetForm();
    setIsModalVisible(false);
  };

  const openAddMentorModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const openEditMentorModal = (mentor) => {
    setMentorForm(mentor);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  // Toggle activated status based on the "activated" field
  const toggleStatus = (studentEmail) => {
    const updatedMentors = mentors.map((mentor) => {
      if (mentor.studentEmail === studentEmail) {
        return {
          ...mentor,
          activated: mentor.activated === 1 ? 0 : 1, // Toggle between 1 (ACTIVATED) and 0 (DEACTIVATED)
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
      activated: 1, // Default to activated
      module: '',
      lab: ''
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
      mentor.activated === 1 ? 'ACTIVATED' : 'DEACTIVATED',
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
                      className={styles.statusToggleButton}
                      onClick={() => toggleStatus(mentor.studentEmail)}
                    >
                      {mentor.activated === 1 ? 'ACTIVATED' : 'DEACTIVATED'}
                    </button>
                  </td>
                  <td>{mentor.module}</td>
                  <td>{mentor.lab}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => openEditMentorModal(mentor)}>
                      Edit
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

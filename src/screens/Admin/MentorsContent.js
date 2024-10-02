import React, { useState, useEffect } from 'react';
import styles from './MentorsContent.module.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    mentorId: null
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentors');
        const data = response.data.map(mentor => ({
          ...mentor,
          activated: !!mentor.activated,
          mentorId: mentor.mentorId
        }));
        setMentors(data);
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
      const newMentor = {
        mentorId: 0,
        firstName: mentorForm.firstName,
        lastName: mentorForm.lastName,
        studentEmail: mentorForm.studentEmail,
        personalEmail: mentorForm.personalEmail,
        contactNo: mentorForm.contactNo,
        password: mentorForm.password,
        available: mentorForm.available !== undefined ? mentorForm.available : 0,
        activated: mentorForm.activated ? true : false
      };

      const response = await axios.post(
        `https://localhost:7163/api/DigitalPlusUser/AddMentor`,
        newMentor,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setMentors([...mentors, response.data]);
      resetForm();
      setIsModalVisible(false);

      toast.success('Mentor added successfully!');
    } catch (error) {
      console.error('Error adding mentor:', error.response ? error.response.data : error.message);
      toast.error('Failed to add mentor. Please try again.');
    }
  };

  const handleEditMentor = async () => {
    try {
      if (!mentorForm.mentorId) {
        console.error('MentorId is null or undefined');
        return;
      }

      const updatedMentor = {
        mentorId: mentorForm.mentorId,
        firstName: mentorForm.firstName,
        lastName: mentorForm.lastName,
        studentEmail: mentorForm.studentEmail,
        personalEmail: mentorForm.personalEmail,
        contactNo: mentorForm.contactNo,
        password: mentorForm.password,
        available: mentorForm.available !== undefined ? mentorForm.available : 0,
        activated: mentorForm.activated ? true : false
      };

      const response = await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateMentor/${mentorForm.mentorId}`,
        updatedMentor,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedMentors = mentors.map(mentor =>
        mentor.mentorId === mentorForm.mentorId ? { ...mentor, ...updatedMentor } : mentor
      );
      setMentors(updatedMentors);
      resetForm();
      setIsModalVisible(false);

      toast.success('Mentor updated successfully!');
    } catch (error) {
      console.error('Error updating mentor:', error.response ? error.response.data : error.message);
      toast.error('Failed to update mentor. Please try again.');
    }
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
      mentorId: null
    });
    setShowPassword(false); // Reset password visibility
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
// Show the modal
function showModal() {
  document.querySelector('.modal').style.display = 'flex';
  document.body.classList.add('body-modal-active');
}

// Hide the modal
function hideModal() {
  document.querySelector('.modal').style.display = 'none';
  document.body.classList.remove('body-modal-active');
}

  return (
    <div className={styles.mentorsContainer}>
      <ToastContainer />

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
              <th>Status</th>
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
                  <td>
                    <button
                      className={`${styles.statusToggleButton} ${mentor.activated ? styles.activate : styles.deactivate}`}
                    >
                      {mentor.activated ? 'ACTIVATED' : 'DEACTIVATED'}
                    </button>
                  </td>
                  <td>
                    <button className={styles.manageButton} onClick={() => openEditMentorModal(mentor)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noMentorsMessage}>
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
            <div className={styles.passwordField}>
              <label>Password:</label>
              <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={mentorForm.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                value={mentorForm.activated ? 1 : 0}
                onChange={(e) => handleFormChange('activated', !!parseInt(e.target.value))}
                className={styles.selectField}
              >
                <option value={1}>ACTIVATED</option>
                <option value={0}>DEACTIVATED</option>
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

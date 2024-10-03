import React, { useState, useEffect } from 'react';
import styles from './MenteesContent.module.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MenteesContent = () => {
  const [mentees, setMentees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menteeForm, setMenteeForm] = useState({
    mentee_Id: '', // Editable Mentee_Id field
    firstName: '',
    lastName: '',
    studentEmail: '',
    personalEmail: '',
    contactNo: '',
    password: '',
    semester: '', // Semester field
    activated: true,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // Fetch mentees data from the API
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentees');
        const data = response.data.map(mentee => ({
          ...mentee,
          activated: !!mentee.activated, // Convert bit to boolean
          mentee_Id: mentee.mentee_Id, // Use menteeId
        }));
        setMentees(data);
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };
    fetchMentees();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter mentees based on search term
  const filteredMentees = mentees.filter(mentee =>
    mentee.studentEmail.toLowerCase().includes(searchTerm)
  );

  // Handle form input change
  const handleFormChange = (field, value) => {
    setMenteeForm({ ...menteeForm, [field]: value });
  };

  // Handle adding a new mentee
  const handleAddMentee = async () => {
    try {
      const newMentee = {
        mentee_Id: menteeForm.mentee_Id, // Use the user-entered mentee_Id
        firstName: menteeForm.firstName,
        lastName: menteeForm.lastName,
        studentEmail: menteeForm.studentEmail,
        personalEmail: menteeForm.personalEmail,
        contactNo: menteeForm.contactNo,
        password: menteeForm.password,
        semester: menteeForm.semester,
        activated: menteeForm.activated ? true : false,
      };

      const response = await axios.post(
        'https://localhost:7163/api/DigitalPlusUser/AddMentee',
        newMentee,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMentees([...mentees, response.data]); // Add new mentee to the list
      resetForm();
      setIsModalVisible(false);
      toast.success('Mentee added successfully!');
    } catch (error) {
      console.error('Error adding mentee:', error.response ? error.response.data : error.message);
      toast.error('Failed to add mentee. Please try again.');
    }
  };

  // Handle editing an existing mentee
  const handleEditMentee = async () => {
    try {
      if (!menteeForm.mentee_Id) {
        console.error('Mentee_Id is null or undefined');
        return;
      }

      const updatedMentee = {
        mentee_Id: menteeForm.mentee_Id, // Use the user-entered mentee_Id
        firstName: menteeForm.firstName,
        lastName: menteeForm.lastName,
        studentEmail: menteeForm.studentEmail,
        personalEmail: menteeForm.personalEmail,
        contactNo: menteeForm.contactNo,
        password: menteeForm.password,
        semester: menteeForm.semester,
        activated: menteeForm.activated ? true : false,
      };

      await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateMentee/${menteeForm.mentee_Id}`,
        updatedMentee,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Update the mentees list locally after the update
      const updatedMentees = mentees.map(mentee =>
        mentee.mentee_Id === menteeForm.mentee_Id ? { ...mentee, ...updatedMentee } : mentee
      );
      setMentees(updatedMentees);
      resetForm();
      setIsModalVisible(false);
      toast.success('Mentee updated successfully!');
    } catch (error) {
      console.error('Error updating mentee:', error.response ? error.response.data : error.message);
      toast.error('Failed to update mentee. Please try again.');
    }
  };

  // Open modal for adding a mentee
  const openAddMenteeModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalVisible(true);
  };

  // Open modal for editing an existing mentee
  const openEditMenteeModal = (mentee) => {
    setMenteeForm(mentee);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  // Reset form fields
  const resetForm = () => {
    setMenteeForm({
      mentee_Id: '', // Reset the mentee_Id field
      firstName: '',
      lastName: '',
      studentEmail: '',
      personalEmail: '',
      contactNo: '',
      password: '',
      semester: '',
      activated: true,
    });
    setShowPassword(false); // Reset password visibility
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.menteesContainer}>
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
          <button className={styles.addMenteeButton} onClick={openAddMenteeModal}>
            Add Mentee
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.menteesTable}>
          <thead>
            <tr>
              <th>Mentee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Student Email</th>
              <th>Personal Email</th>
              <th>Contact No</th>
              <th>Password</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentees.length > 0 ? (
              filteredMentees.map((mentee, index) => (
                <tr key={index}>
                  <td>{mentee.mentee_Id}</td>
                  <td>{mentee.firstName}</td>
                  <td>{mentee.lastName}</td>
                  <td>{mentee.studentEmail}</td>
                  <td>{mentee.personalEmail}</td>
                  <td>{mentee.contactNo}</td>
                  <td>{mentee.password}</td>
                  <td>{mentee.semester}</td>
                  <td>
                    <button
                      className={`${styles.statusToggleButton} ${mentee.activated ? styles.activate : styles.deactivate}`}
                    >
                      {mentee.activated ? 'ACTIVATED' : 'DEACTIVATED'}
                    </button>
                  </td>
                  <td>
                    <button className={styles.manageButton} onClick={() => openEditMenteeModal(mentee)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className={styles.noMenteesMessage}>
                  No mentees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{isEditing ? 'Edit Mentee' : 'Add Mentee'}</h2>
            <div>
              <label>Mentee ID:</label>
              <input
                type="text"
                value={menteeForm.mentee_Id}
                onChange={(e) => handleFormChange('mentee_Id', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={menteeForm.firstName}
                onChange={(e) => handleFormChange('firstName', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={menteeForm.lastName}
                onChange={(e) => handleFormChange('lastName', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Student Email:</label>
              <input
                type="email"
                value={menteeForm.studentEmail}
                onChange={(e) => handleFormChange('studentEmail', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Personal Email:</label>
              <input
                type="email"
                value={menteeForm.personalEmail}
                onChange={(e) => handleFormChange('personalEmail', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Contact No:</label>
              <input
                type="text"
                value={menteeForm.contactNo}
                onChange={(e) => handleFormChange('contactNo', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.passwordField}>
              <label>Password:</label>
              <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                {showPassword ? '🙈' : '👁️'}
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={menteeForm.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label>Semester:</label>
              <select
                value={menteeForm.semester}
                onChange={(e) => handleFormChange('semester', e.target.value)}
                className={styles.selectField}
              >
                <option value="">Select Semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="3rd">3rd Semester</option>
                <option value="4th">4th Semester</option>
              </select>
            </div>
            <div>
              <label>Status:</label>
              <select
                value={menteeForm.activated ? 1 : 0}
                onChange={(e) => handleFormChange('activated', !!parseInt(e.target.value))}
                className={styles.selectField}
              >
                <option value={1}>ACTIVATED</option>
                <option value={0}>DEACTIVATED</option>
              </select>
            </div>
            <div className={styles.modalButtons}>
              <button onClick={isEditing ? handleEditMentee : handleAddMentee}>
                {isEditing ? 'Update Mentee' : 'Add Mentee'}
              </button>
              <button onClick={() => setIsModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteesContent;

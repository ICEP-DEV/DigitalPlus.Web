import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { Add, Save, Update, ManageAccounts } from '@mui/icons-material'; // Material UI icons
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './MentorsContent.module.css';

const MentorsContent = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mentorForm, setMentorForm] = useState({
    mentorId: '',
    firstName: '',
    lastName: '',
    studentEmail: '',
    personalEmail: '',
    contactNo: '',
    password: '',
    activated: true,
    available: 0,
    module: '',
    lab: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    if (field === 'mentorId') {
      const studentEmail = `${value}@tut4life.ac.za`;
      setMentorForm({ ...mentorForm, mentorId: value, studentEmail });
    } else {
      setMentorForm({ ...mentorForm, [field]: value });
    }
  };

  const handleAddMentor = async () => {
    try {
      const newMentor = {
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

      const response = await axios.post(
        `https://localhost:7163/api/DigitalPlusUser/AddMentor`,
        newMentor,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMentors([...mentors, response.data]);
      resetForm();
      setIsDialogOpen(false);
      toast.success('Mentor added successfully!');
    } catch (error) {
      console.error('Error adding mentor:', error.response ? error.response.data : error.message);
      toast.error('Failed to add mentor. Please try again.');
    }
  };

  const handleEditMentor = async () => {
    if (!mentorForm.mentorId) {
      toast.error('Mentor ID is missing');
      return;
    }

    try {
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

      await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateMentor/${mentorForm.mentorId}`,
        updatedMentor,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const updatedMentors = mentors.map(mentor =>
        mentor.mentorId === mentorForm.mentorId ? { ...mentor, ...updatedMentor } : mentor
      );
      setMentors(updatedMentors);
      resetForm();
      setIsDialogOpen(false);
      toast.success('Mentor updated successfully!');
    } catch (error) {
      console.error('Error updating mentor:', error.response ? error.response.data : error.message);
      toast.error('Failed to update mentor. Please try again.');
    }
  };

  const openAddMentorDialog = () => {
    resetForm();
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditMentorDialog = (mentor) => {
    setMentorForm(mentor);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setMentorForm({
      mentorId: '',
      firstName: '',
      lastName: '',
      studentEmail: '',
      personalEmail: '',
      contactNo: '',
      password: '',
      activated: true,
      available: 0,
      module: '',
      lab: ''
    });
    setShowPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={styles.mentorsContainer}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className={styles.header}>
        <div className={styles.searchBarContainer}>
          <input type="text" style={{ display: 'none' }} autoComplete="off" />
          <input
            type="search"
            placeholder="Search by Student Email"
            className={styles.searchBar}
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
            name="unique-search-email"
            id="search-email-unique"
          />
        </div>
        <div className={styles.buttonGroup}>
          <Button 
            onClick={openAddMentorDialog} 
            startIcon={<Add />} 
            variant="contained" 
            sx={{ color: 'black', backgroundColor: 'lightgray' }} // Black text color
          >
            Add
          </Button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.mentorsTable}>
          <thead>
            <tr>
              <th>Mentor ID</th>
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
                  <td>{mentor.mentorId}</td>
                  <td>{mentor.firstName}</td>
                  <td>{mentor.lastName}</td>
                  <td>{mentor.studentEmail}</td>
                  <td>{mentor.personalEmail}</td>
                  <td>{mentor.contactNo}</td>
                  <td>
                    <Button
                      startIcon={mentor.activated ? <Save /> : <Update />}
                      variant="outlined"
                      sx={{ color: 'black' }} // Black text color
                      className={`${styles.statusToggleButton} ${mentor.activated ? styles.activate : styles.deactivate}`}
                    >
                      {mentor.activated ? 'ACTIVATED' : 'DEACTIVATED'}
                    </Button>
                  </td>
                  <td>
                    <Button
                      startIcon={<ManageAccounts />}
                      variant="outlined"
                      sx={{ color: 'black' }} // Black text color
                      className={styles.manageButton}
                      onClick={() => openEditMentorDialog(mentor)}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noMentorsMessage}>
                  No mentors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog for Adding/Editing Mentor */}
      <Dialog
        open={isDialogOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            closeDialog();
          }
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>{isEditing ? 'Edit Mentor' : 'Add Mentor'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Mentor ID (Student Number)"
            value={mentorForm.mentorId}
            onChange={(e) => handleFormChange('mentorId', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="First Name"
            value={mentorForm.firstName}
            onChange={(e) => handleFormChange('firstName', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            value={mentorForm.lastName}
            onChange={(e) => handleFormChange('lastName', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Student Email"
            value={mentorForm.studentEmail}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Personal Email"
            value={mentorForm.personalEmail}
            onChange={(e) => handleFormChange('personalEmail', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contact No"
            value={mentorForm.contactNo}
            onChange={(e) => handleFormChange('contactNo', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={mentorForm.password}
            onChange={(e) => handleFormChange('password', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Select
            label="Status"
            value={mentorForm.activated}
            onChange={(e) => handleFormChange('activated', e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value={true}>Activated</MenuItem>
            <MenuItem value={false}>Deactivated</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary" sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button 
            onClick={isEditing ? handleEditMentor : handleAddMentor} 
            startIcon={isEditing ? <Update /> : <Save />} 
            color="primary" 
            sx={{ color: 'black' }} // Black text color
          >
            {isEditing ? 'Update Mentor' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MentorsContent;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { Add, Save, Update, ManageAccounts, Delete } from '@mui/icons-material'; // Material UI icons
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './MentorsContent.module.css';

const MentorsContent = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Control the delete confirmation dialog
  const [mentorToDelete, setMentorToDelete] = useState(null); // Track the mentor to be deleted

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
  const [errors, setErrors] = useState({
    mentorId: '',
    firstName: '',
    lastName: '',
    personalEmail: '',
    contactNo: '',
    password: ''
  });

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
  const handleDeleteMentor = async () => {
    if (mentorToDelete) {
      try {
        await axios.delete(`https://localhost:7163/api/DigitalPlusUser/DeleteMentor/${mentorToDelete.mentorId}`);
        setMentors(mentors.filter(mentor => mentor.mentorId !== mentorToDelete.mentorId));
        toast.success('Mentor deleted successfully!');
        setDeleteDialogOpen(false); // Close the dialog after deletion
        setMentorToDelete(null); // Clear the mentor to delete
      } catch (error) {
        console.error('Error deleting mentor:', error);
        toast.error('Failed to delete mentor. Please try again.');
      }
    }
  };
  const openDeleteDialog = (mentor) => {
    setMentorToDelete(mentor); // Set the mentor to delete
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const validateForm = () => {
    const newErrors = {};

    if (!mentorForm.mentorId || mentorForm.mentorId.length !== 9) {
      newErrors.mentorId = 'Mentor ID must be exactly 9 digits.';
    }
    if (!mentorForm.firstName) {
      newErrors.firstName = 'First Name is required.';
    }
    if (!mentorForm.lastName) {
      newErrors.lastName = 'Last Name is required.';
    }
    if (!mentorForm.personalEmail) {
      newErrors.personalEmail = 'Personal Email is required.';
    }
    if (!mentorForm.contactNo) {
      newErrors.contactNo = 'Contact No is required.';
    }
    if (!mentorForm.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const generatePassword = () => {
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const passwordArray = [];

    // Ensure at least one character from each required category
    passwordArray.push(lowercaseLetters.charAt(Math.floor(Math.random() * lowercaseLetters.length)));
    passwordArray.push(uppercaseLetters.charAt(Math.floor(Math.random() * uppercaseLetters.length)));
    passwordArray.push(digits.charAt(Math.floor(Math.random() * digits.length)));
    passwordArray.push(specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length)));

    // Fill the remaining 4 characters with random choices from all categories
    const allCharacters = lowercaseLetters + uppercaseLetters + digits + specialCharacters;
    for (let i = 0; i < 4; i++) {
      passwordArray.push(allCharacters.charAt(Math.floor(Math.random() * allCharacters.length)));
    }

    // Shuffle the password array to randomize character order
    const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5).join('');

    return shuffledPassword;
  };

  const handleAddMentor = async () => {
    if (!validateForm()) return; // Validate before proceeding

    try {
      const generatedPassword = generatePassword(); // Generate random password
      const newMentor = {
        mentorId: mentorForm.mentorId,
        firstName: mentorForm.firstName,
        lastName: mentorForm.lastName,
        studentEmail: mentorForm.studentEmail,
        personalEmail: mentorForm.personalEmail,
        contactNo: mentorForm.contactNo,
        password: generatedPassword, // Use the generated password
        available: mentorForm.available !== undefined ? mentorForm.available : 0,
        activated: mentorForm.activated ? true : false
      };

      // Add the mentor
      const response = await axios.post(
        `https://localhost:7163/api/DigitalPlusUser/AddMentor`,
        newMentor,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Add the new mentor to the state
      setMentors([...mentors, response.data]);
      resetForm();
      setIsDialogOpen(false);

      // Send the welcome email to the mentor using HTML formatting for the email body

      const emailMessage = `
      <p>Hi ${newMentor.firstName.charAt(0)} ${newMentor.lastName},</p>
      <p>Your account has been created by the administrator. Please use your student email <strong>${newMentor.studentEmail}</strong> and password <strong>${generatedPassword}</strong> to log in. You can access the platform using the following link:</p>
      <p><a href="http://localhost:3000/" target="_blank">http://localhost:3000/</a></p>
      <p>You are reminded to change your password by clicking on the 'Forgotten Password' link on the login page.</p>
      <p>Regards,<br>Administrator</p>
    `;


      // Make the API call to send the email
      await axios.post(
        'https://localhost:7163/api/Email/Send',
        {
          email: newMentor.studentEmail,
          subject: 'Your Mentor Account is Created',
          message: emailMessage
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.success('Mentor added and Email sent to the mentor successfully!');
    } catch (error) {
      console.error('Error adding mentor or sending email:', error.response ? error.response.data : error.message);
      toast.error('Failed to add mentor or send email. Please try again.');
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
        password: mentorForm.password, // Keep the existing password
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
    setErrors({}); // Reset errors on form reset
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={styles.mentorsContainer}>
      <ToastContainer />
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button
                        startIcon={<ManageAccounts />}
                        variant="outlined"
                        sx={{ color: 'black' }} // Black text color
                        className={styles.manageButton}
                        onClick={() => openEditMentorDialog(mentor)}
                      >
                      </Button>

                      <Button
                        startIcon={<Delete />}
                        variant="outlined"
                        sx={{ color: 'red' }} // Red text for delete
                        className={styles.deleteButton}
                        onClick={() => openDeleteDialog(mentor)} // Open delete dialog
                      >
                      </Button>
                    </div>
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
            label="Mentor ID (9 digits)"
            value={mentorForm.mentorId}
            onChange={(e) => handleFormChange('mentorId', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!errors.mentorId}
            helperText={errors.mentorId} // Display error message
          />
          <TextField
            label="First Name"
            value={mentorForm.firstName}
            onChange={(e) => handleFormChange('firstName', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!errors.firstName}
            helperText={errors.firstName} // Display error message
          />
          <TextField
            label="Last Name"
            value={mentorForm.lastName}
            onChange={(e) => handleFormChange('lastName', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!errors.lastName}
            helperText={errors.lastName} // Display error message
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
            error={!!errors.personalEmail}
            helperText={errors.personalEmail} // Display error message
          />
          <TextField
            label="Contact No"
            value={mentorForm.contactNo}
            onChange={(e) => handleFormChange('contactNo', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!errors.contactNo}
            helperText={errors.contactNo} // Display error message
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={mentorForm.password}
            onChange={(e) => handleFormChange('password', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password} // Display error message
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
          <Button
            onClick={closeDialog}
            sx={{
              backgroundColor: '#f0ad4e', // Light orange background
              color: '#fff', // White text color
              '&:hover': {
                backgroundColor: '#ec971f', // Darker orange on hover
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={isEditing ? handleEditMentor : handleAddMentor}
            startIcon={isEditing ? <Update /> : <Save />}
            sx={{
              backgroundColor: '#5bc0de', // Light blue background
              color: '#fff', // White text color
              '&:hover': {
                backgroundColor: '#31b0d5', // Darker blue on hover
              },
            }}
          >
            {isEditing ? 'Update Mentor' : 'Save'}
          </Button>

        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#f8f9fa', // Light background for better contrast
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>

        <DialogContent>
          <p style={{ color: '#333', fontSize: '16px', fontWeight: '500' }}>
            Are you sure you want to delete this mentor? This action cannot be undone.
          </p>
        </DialogContent>

        <DialogActions sx={{ padding: '16px' }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: '#fff',
              backgroundColor: '#6c757d',
              '&:hover': {
                backgroundColor: '#5a6268',
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteMentor}
            sx={{
              color: '#fff',
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#c62828',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  );
};

export default MentorsContent;

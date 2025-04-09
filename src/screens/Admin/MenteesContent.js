import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { Add, Save, Update, ManageAccounts, Delete } from '@mui/icons-material'; // Material UI icons
import { ToastContainer, toast } from 'react-toastify';
import { Icon, Typography, IconButton,CircularProgress } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import styles from './MenteesContent.module.css';
import { SiCodementor } from "react-icons/si";
import { useNotification } from './NotificationContext';

const MenteesContent = () => {
  const [mentees, setMentees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [menteeForm, setMenteeForm] = useState({
    mentee_Id: '',
    firstName: '',
    lastName: '',
    studentEmail: '',
    contactNo: '',
    password: '',
    semester: '',
    activated: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menteeToDelete, setMenteeToDelete] = useState(null); // Track which mentee to delete
const { showNotification } = useNotification();

  const [errors, setErrors] = useState({
    mentee_Id: '',
    firstName: '',
    lastName: '',
    studentEmail: '',
    contactNo: '',
    password: '',
    semester: '',
  });

  useEffect(() => {
    const fetchMentees = async () => {
      setIsLoading(true); 
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentees');
        setTimeout(() =>{
        const data = response.data.map(mentee => ({
          ...mentee,
          activated: !!mentee.activated,
          mentee_Id: mentee.mentee_Id,
        }));
        setMentees(data);
        setIsLoading(false); // Stop loading after 2 seconds
        }, 200);
      } catch (error) {
        console.error('Error fetching mentees:', error);
        setIsLoading(false); // Stop loading on error
      }
    };
    fetchMentees();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredMentees = mentees.filter(mentee =>
    mentee.studentEmail.toLowerCase().includes(searchTerm)
  );

  const handleFormChange = (field, value) => {
    let newForm = { ...menteeForm, [field]: value };

    // Auto-fill studentEmail based on mentee_Id
    if (field === 'mentee_Id') {
      newForm.studentEmail = `${value}@tut4life.ac.za`;
    }

    setMenteeForm(newForm);
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

    // Fill the remaining characters with random choices from all categories
    const allCharacters = lowercaseLetters + uppercaseLetters + digits + specialCharacters;
    for (let i = 0; i < 4; i++) {
      passwordArray.push(allCharacters.charAt(Math.floor(Math.random() * allCharacters.length)));
    }

    // Shuffle the password array to randomize character order
    const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5).join('');

    return shuffledPassword;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!menteeForm.mentee_Id || menteeForm.mentee_Id.length !== 9) {
      newErrors.mentee_Id = 'Mentee ID must be 9 digits.';
    }
    if (!menteeForm.firstName) {
      newErrors.firstName = 'First Name is required.';
    }
    if (!menteeForm.lastName) {
      newErrors.lastName = 'Last Name is required.';
    }
    if (!menteeForm.studentEmail) {
      newErrors.studentEmail = 'Student Email is required.';
    }
    if (!menteeForm.contactNo) {
      newErrors.contactNo = 'Contact No is required.';
    }
    if (!menteeForm.password) {
      newErrors.password = 'Password is required.';
    }
    if (!menteeForm.semester) {
      newErrors.semester = 'Semester is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleDeleteMentee = async () => {
    if (menteeToDelete) {
      try {
        await axios.delete(`https://localhost:7163/api/DigitalPlusUser/DeleteMentee/${menteeToDelete.mentee_Id}`);
        setMentees(mentees.filter(mentee => mentee.mentee_Id !== menteeToDelete.mentee_Id));
        showNotification('Mentee deleted successfully!');
        setDeleteDialogOpen(false); // Close the dialog after deletion
        setMenteeToDelete(null); // Clear the mentee to delete
      } catch (error) {
        console.error('Error deleting mentee:', error);
        toast.error('Failed to delete mentee. Please try again.');
      }
    }
  };
  const handleEditMentee = async () => {
    if (!menteeForm.mentee_Id) {
      toast.error('Mentee ID is missing');
      return;
    }

    try {
      const updatedMentee = {
        mentee_Id: menteeForm.mentee_Id,
        firstName: menteeForm.firstName,
        lastName: menteeForm.lastName,
        studentEmail: menteeForm.studentEmail,
        contactNo: menteeForm.contactNo,
        password: menteeForm.password, // Keep the existing password
        semester: menteeForm.semester,
        activated: menteeForm.activated ? true : false
      };

      await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateMentee/${menteeForm.mentee_Id}`,
        updatedMentee,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const updatedMentees = mentees.map(mentee =>
        mentee.mentee_Id === menteeForm.mentee_Id ? { ...mentee, ...updatedMentee } : mentee
      );
      setMentees(updatedMentees);
      resetForm();
      setIsDialogOpen(false);
      showNotification('Mentee updated successfully!');
    } catch (error) {
      console.error('Error updating mentee:', error.response ? error.response.data : error.message);
      toast.error('Failed to update mentee. Please try again.');
    }
  };


  const openDeleteDialog = (mentee) => {
    setMenteeToDelete(mentee); // Set the mentee to delete
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleAddMentee = async () => {
    if (!validateForm()) return; // Validate before proceeding

    try {
      const generatedPassword = generatePassword(); // Generate random password
      const newMentee = {
        ...menteeForm,
        password: generatedPassword, // Use the generated password
        activated: menteeForm.activated ? true : false,
      };

      // Add the mentee
      const response = await axios.post(
        'https://localhost:7163/api/DigitalPlusUser/AddMentee',
        newMentee,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMentees([...mentees, response.data]);
      resetForm();
      setIsDialogOpen(false);
      showNotification('Mentee added and Email sent to the mentee successfully!');

      // Send the welcome email to the mentee using HTML formatting for the email body
      const emailMessage = `
  <p>Hi ${newMentee.firstName.charAt(0)} ${newMentee.lastName},</p>
  <p>Your account has been created by the administrator. Please use your student email <strong>${newMentee.studentEmail}</strong> and password <strong>${generatedPassword}</strong> to log in. You can access the platform using the following link:</p>
  <p><a href="http://localhost:3000/" target="_blank">http://localhost:3000/</a></p>
  <p>You are reminded to change your password by clicking on the 'Forgotten Password' link on the login page.</p>
  <p>Regards,<br>Administrator</p>
`;


      // Make the API call to send the email
      await axios.post(
        'https://localhost:7163/api/Email/Send',
        {
          email: newMentee.studentEmail,
          subject: 'Your Mentee Account is Created',
          message: emailMessage
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      showNotification('Email sent to the mentee successfully!');
    } catch (error) {
      console.error('Error adding mentee or sending email:', error.response ? error.response.data : error.message);
      toast.error('Failed to add mentee or send email. Please try again.');
    }
  };


  const openAddMenteeDialog = () => {
    resetForm();
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditMenteeDialog = (mentee) => {
    setMenteeForm(mentee);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setMenteeForm({
      mentee_Id: '',
      firstName: '',
      lastName: '',
      studentEmail: '',
      contactNo: '',
      password: '',
      semester: '',
      activated: true,
    });
    setShowPassword(false);
    setErrors({}); // Reset errors on form reset
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };



  return (
<div className={styles.menteesContainer}>
  <h2><SiCodementor /> MENTEES</h2>
  <div className={styles.dividerContainer}>
  <div className={styles.dividerLine}></div>
  <div className={`${styles.dividerTab} ${styles.left}`}></div>
  <div className={`${styles.dividerTab} ${styles.right}`}></div>
</div>


  <ToastContainer />
  
  <div className={styles.header}>
    <div className={styles.searchBarContainer}>
      <input
        type="search"
        placeholder="Search by Student Email"
        className={styles.searchBar}
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
    <div className={styles.buttonGroup}>
      <Button
        onClick={openAddMenteeDialog}
        startIcon={<Add />}
        variant="contained"
        sx={{ color: 'black', backgroundColor: 'lightgray' }}
      >
        Add
      </Button>
    </div>
  </div>
  
  <div className={styles.tableWrapper}>
    {isLoading ? (
      <div className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6">Loading Mentees...</Typography>
      </div>
    ) : (
      <table className={styles.menteesTable}>
        <thead>
          <tr>
            <th>Mentee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Student Email</th>
            <th>Contact No</th>
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
                <td>{mentee.contactNo}</td>
                <td>
                  <Button
                    startIcon={mentee.activated ? <Save /> : <Update />}
                    variant="outlined"
                    sx={{ color: 'black' }}
                    className={`${styles.statusToggleButton} ${mentee.activated ? styles.activate : styles.deactivate}`}
                  >
                    {mentee.activated ? 'ACTIVATED' : 'DEACTIVATED'}
                  </Button>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      startIcon={<ManageAccounts />}
                      variant="outlined"
                      sx={{ color: 'black' }}
                      className={styles.manageButton}
                      onClick={() => openEditMenteeDialog(mentee)}
                    >
                    </Button>

                    <Button
                      startIcon={<Delete />}
                      variant="outlined"
                      sx={{ color: 'red' }}
                      className={styles.deleteButton}
                      onClick={() => openDeleteDialog(mentee)}
                    >
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className={styles.noMenteesMessage}>
                No mentees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>

      {/* Dialog for Adding/Editing Mentee */}
      <Dialog
        open={isDialogOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            closeDialog();
          }
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>{isEditing ? 'Edit Mentee' : 'Add Mentee'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Mentee ID"
            value={menteeForm.mentee_Id}
            onChange={(e) => handleFormChange('mentee_Id', e.target.value)}
            fullWidth
            margin="normal"
            required
            className={styles.fieldMargin}
            InputLabelProps={{
              classes: { root: styles.labelSpacing } // Apply label spacing class
            }}
            error={!!errors.mentee_Id}
            helperText={errors.mentee_Id} // Display error message
          />
          <TextField
            label="First Name"
            value={menteeForm.firstName}
            onChange={(e) => handleFormChange('firstName', e.target.value)}
            fullWidth
            margin="normal"
            required
            className={styles.fieldMargin}
            InputLabelProps={{
              classes: { root: styles.labelSpacing } // Apply label spacing class
            }}
            error={!!errors.firstName}
            helperText={errors.firstName} // Display error message
          />
          <TextField
            label="Last Name"
            value={menteeForm.lastName}
            onChange={(e) => handleFormChange('lastName', e.target.value)}
            fullWidth
            margin="normal"
            required
            className={styles.fieldMargin}
            InputLabelProps={{
              classes: { root: styles.labelSpacing } // Apply label spacing class
            }}
            error={!!errors.lastName}
            helperText={errors.lastName} // Display error message
          />
          <TextField
            label="Student Email"
            value={menteeForm.studentEmail}
            fullWidth
            margin="normal"
            required
            disabled
            className={styles.fieldMargin}
            InputLabelProps={{
              classes: { root: styles.labelSpacing } // Apply label spacing class
            }}
            error={!!errors.studentEmail}
            helperText={errors.studentEmail} // Display error message
          />
          <TextField
            label="Contact No"
            value={menteeForm.contactNo}
            onChange={(e) => handleFormChange('contactNo', e.target.value)}
            fullWidth
            margin="normal"
            required
            className={styles.fieldMargin}
            InputLabelProps={{
              classes: { root: styles.labelSpacing } // Apply label spacing class
            }}
            error={!!errors.contactNo}
            helperText={errors.contactNo} // Display error message
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={menteeForm.password}
            onChange={(e) => handleFormChange('password', e.target.value)}
            fullWidth
            margin="normal"
            required
            className={styles.fieldMargin}
            InputLabelProps={{
              classes: { root: styles.labelSpacing } // Apply label spacing class
            }}
            error={!!errors.password}
            helperText={errors.password} // Display error message
          />
          <Select
            label="Semester"
            value={menteeForm.semester}
            onChange={(e) => handleFormChange('semester', e.target.value)}
            fullWidth
            margin="normal"
            required
            className={styles.fieldMargin}
            InputLabelProps={{
              classes: { root: styles.labelSpacing } // Apply label spacing class
            }}
            error={!!errors.semester}
            helperText={errors.semester} // Display error message
          >
            <MenuItem value="1st">1st Semester</MenuItem>
            <MenuItem value="2nd">2nd Semester</MenuItem>
            <MenuItem value="3rd">3rd Semester</MenuItem>
            <MenuItem value="4th">4th Semester</MenuItem>
          </Select>
          <Select
            label="Status"
            value={menteeForm.activated}
            onChange={(e) => handleFormChange('activated', e.target.value)}
            fullWidth
            margin="normal"
            required
            className={styles.fieldMargin}
            InputLabelProps={{
              classes: { root: styles.labelSpacing } // Apply label spacing class
            }}
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
            onClick={isEditing ? handleEditMentee : handleAddMentee}
            startIcon={isEditing ? <Update /> : <Save />}
            sx={{
              backgroundColor: '#5bc0de', // Light blue background
              color: '#fff', // White text color
              '&:hover': {
                backgroundColor: '#31b0d5', // Darker blue on hover
              },
            }}
          >
            {isEditing ? 'Update Mentee' : 'Save'}
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
            Are you sure you want to delete this mentee? This action cannot be undone.
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
            onClick={handleDeleteMentee}
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

export default MenteesContent;

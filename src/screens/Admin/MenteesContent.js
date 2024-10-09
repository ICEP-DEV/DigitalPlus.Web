import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { Add, Save, Update, ManageAccounts } from '@mui/icons-material'; // Material UI icons
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './MenteesContent.module.css';

const MenteesContent = () => {
  const [mentees, setMentees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menteeForm, setMenteeForm] = useState({
    mentee_Id: 0,
    firstName: '',
    lastName: '',
    studentEmail: '',
    personalEmail: '',
    contactNo: '',
    password: '',
    semester: '',
    activated: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentees');
        const data = response.data.map(mentee => ({
          ...mentee,
          activated: !!mentee.activated,
          mentee_Id: mentee.mentee_Id,
        }));
        setMentees(data);
      } catch (error) {
        console.error('Error fetching mentees:', error);
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
    setMenteeForm({ ...menteeForm, [field]: value });
  };

  const handleAddMentee = async () => {
    try {
      const newMentee = {
        ...menteeForm,
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

      setMentees([...mentees, response.data]);
      resetForm();
      setIsDialogOpen(false);
      toast.success('Mentee added successfully!');
    } catch (error) {
      console.error('Error adding mentee:', error.response ? error.response.data : error.message);
      toast.error('Failed to add mentee. Please try again.');
    }
  };

  const handleEditMentee = async () => {
    if (!menteeForm.mentee_Id) {
      toast.error('Mentee ID is missing');
      return;
    }

    try {
      const updatedMentee = {
        ...menteeForm,
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

      const updatedMentees = mentees.map(mentee =>
        mentee.mentee_Id === menteeForm.mentee_Id ? { ...mentee, ...updatedMentee } : mentee
      );
      setMentees(updatedMentees);
      resetForm();
      setIsDialogOpen(false);
      toast.success('Mentee updated successfully!');
    } catch (error) {
      console.error('Error updating mentee:', error.response ? error.response.data : error.message);
      toast.error('Failed to update mentee. Please try again.');
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
      mentee_Id: 0,
      firstName: '',
      lastName: '',
      studentEmail: '',
      personalEmail: '',
      contactNo: '',
      password: '',
      semester: '',
      activated: true,
    });
    setShowPassword(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.menteesContainer}>
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
            sx={{ color: 'black', backgroundColor: 'lightgray' }} // Setting text color to black
          >
            Add
          </Button>
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
                  <td>
                    <Button
                      startIcon={mentee.activated ? <Save /> : <Update />}
                      variant="outlined"
                      sx={{ color: 'black' }} // Black text color
                      className={`${styles.statusToggleButton} ${mentee.activated ? styles.activate : styles.deactivate}`}
                    >
                      {mentee.activated ? 'ACTIVATED' : 'DEACTIVATED'}
                    </Button>
                  </td>
                  <td>
                    <Button
                      startIcon={<ManageAccounts />}
                      variant="outlined"
                      sx={{ color: 'black' }} // Black text color
                      className={styles.manageButton}
                      onClick={() => openEditMenteeDialog(mentee)}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noMenteesMessage}>
                  No mentees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            fullWidth
            margin="normal"
            disabled={isEditing}
            required
          />
          <TextField
            label="First Name"
            value={menteeForm.firstName}
            onChange={(e) => handleFormChange('firstName', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            value={menteeForm.lastName}
            onChange={(e) => handleFormChange('lastName', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Student Email"
            value={menteeForm.studentEmail}
            onChange={(e) => handleFormChange('studentEmail', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Personal Email"
            value={menteeForm.personalEmail}
            onChange={(e) => handleFormChange('personalEmail', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contact No"
            value={menteeForm.contactNo}
            onChange={(e) => handleFormChange('contactNo', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={menteeForm.password}
            onChange={(e) => handleFormChange('password', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Select
            label="Semester"
            value={menteeForm.semester}
            onChange={(e) => handleFormChange('semester', e.target.value)}
            fullWidth
            margin="normal"
            required
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
            onClick={isEditing ? handleEditMentee : handleAddMentee} 
            startIcon={isEditing ? <Update /> : <Save />} 
            color="primary" 
            sx={{ color: 'black' }} // Black text color
          >
            {isEditing ? 'Update Mentee' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MenteesContent;

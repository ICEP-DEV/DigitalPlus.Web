import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'; // Import MUI components
import { useNavigate } from 'react-router-dom';
import styles from './LogoutComponent.module.css'; // Import the CSS module

const LogoutComponent = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true); // State to control dialog visibility

  const handleClose = () => {
    setOpen(false);
  };

  const handleYesClick = () => {
    // Clear all session-related data from localStorage
    localStorage.clear(); // Clears all data from localStorage
    navigate('/'); // Redirect to the home or login page
  };

  const handleNoClick = () => {
    setOpen(false);
    navigate('/admin-dashboard/dashboard');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <div className={styles.questionIcon}>?</div>
        <h2>ARE YOU SURE YOU WANT TO LOG OUT?</h2>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleYesClick} sx={{ color: 'red' }}>
          YES
        </Button>
        <Button onClick={handleNoClick} sx={{ color: 'blue' }}>
          NO
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutComponent;

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import styles from './LogoutComponent.module.css';

const LogoutComponent = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleYesClick = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const handleNoClick = () => {
    setOpen(false);
    navigate('/admin-dashboard/dashboard');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon sx={{ color: 'red', fontSize: 32 }} />
        Confirm Logout
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Are you sure you want to log out?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            You will need to log in again to access your account.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={handleYesClick} variant="contained" color="error" sx={{ width: 100 }}>
          Yes
        </Button>
        <Button onClick={handleNoClick} variant="outlined" color="primary" sx={{ width: 100 }}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutComponent;

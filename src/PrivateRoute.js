import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const [open, setOpen] = useState(false); // State to control dialog visibility
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Assuming user is logged in by default
    const user = localStorage.getItem('user'); // Check if user exists in localStorage

    useEffect(() => {
        if (!user) {
            setIsAuthenticated(false); // If no user found, set authenticated state to false
            setOpen(true); // Open the dialog
        }
    }, [user]); // Runs once on component mount

    const handleClose = () => {
        setOpen(false); // Close the dialog
    };

    const handleRedirectToLogin = () => {
        setOpen(false); // Close the dialog
        window.location.href = '/login'; // Redirect to login page
    };

    if (!isAuthenticated) {
        return (
            <>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Access Denied</DialogTitle>
                    <DialogContent>
                        You need to log in to access this page.
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleRedirectToLogin}
                            sx={{ color: 'blue' }}
                        >
                            Go to Login
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    // If authenticated, return the children (protected components)
    return children;
};

export default PrivateRoute;

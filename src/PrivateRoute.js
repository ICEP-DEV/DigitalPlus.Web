import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PrivateRoute.module.css';
import { FaLock } from 'react-icons/fa';

const PrivateRoute = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const user = localStorage.getItem('user');

    useEffect(() => {
        if (!user) {
            setIsAuthenticated(false);
            setOpen(true);
        }
    }, [user]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleRedirectToLogin = () => {
        setOpen(false);
        window.location.href = '/login';
    };

    if (!isAuthenticated) {
        return (
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className={styles.dialogContainer}
                    >
                        <Dialog open={open} onClose={handleClose} className={styles.dialog}>
                            <DialogTitle className={styles.title}>
                                <FaLock /> Access Denied
                            </DialogTitle>
                            <DialogContent className={styles.content}>
                                You need to log in to access this page.
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleRedirectToLogin} className={styles.button}>
                                    Go to Login
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return children;
};

export default PrivateRoute;
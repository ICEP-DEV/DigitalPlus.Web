import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@mui/material';
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
                        <div className={styles.dialog}>
                            <div className={styles.title}>
                                <FaLock size={32} />
                            </div>
                            <Button onClick={handleRedirectToLogin} className={styles.button}>
                                Go to Login
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return children;
};

export default PrivateRoute;
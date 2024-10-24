import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');  // State to hold the email
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // On component mount, get the email from localStorage and set it to the email state
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);  // Set the email from localStorage
        } else {
            toast.error('Email not found. Please try again.');
            navigate('/send-otp');  // Redirect if no email is in localStorage
        }
    }, [navigate]);

    const resetPassword = () => {
        if (!email) {
            toast.warn('Email not found');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warn('Passwords do not match');
            return;
        }

        // Prepare data for the API request
        const data = {
            email: email,  // Use the email from localStorage
            newPassword: newPassword
        };

        // Send the resetPassword request
        axios.post('https://localhost:7163/api/DigitalPlusUser/resetPassword', data)
            .then(response => {
                if (response.data.success) {
                    // Display the message from the API (e.g. "Password updated")
                    toast.success(response.data.message || 'Password updated');
                    
                    // Clear email from localStorage
                    localStorage.removeItem('email');
                    
                    // Redirect to login after a brief delay to allow the user to see the message
                    setTimeout(() => {
                        navigate('/login');  // Navigate to login page after success
                    }, 2000);  // 2 second delay before redirecting
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch(() => {
                toast.error('An error occurred');
            });
    };

    return (
        <div className={styles.forgotPasswordContainer}>
            <ToastContainer />
            <div className={styles.formBox}>
                <h2 className={styles.formTitle}>Reset Your Password</h2>
                <div className={styles.form}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}  // Pre-fill with the email from localStorage
                        readOnly  // Make the field non-editable
                        className={styles.inputField}
                    />
                    <label className={styles.label}>New Password</label>
                    <input
                        type="password"
                        onChange={(event) => setNewPassword(event.target.value)}
                        className={styles.inputField}
                        placeholder="Enter new password"
                    />
                    <label className={styles.label}>Confirm Password</label>
                    <input
                        type="password"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className={styles.inputField}
                        placeholder="Confirm new password"
                    />
                    <button onClick={resetPassword} className={styles.submitBtn}>Reset Password</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

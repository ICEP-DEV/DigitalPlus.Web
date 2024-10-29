import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from './ForgotPassword.module.css';
import { Link } from 'react-router-dom';
function ForgotPassword() {
    const navigate = useNavigate();
    useEffect(() => {
        // This will update the URL to display only 'We-me-ntor' on every route
        window.history.pushState({}, '', '/we.men.tor.ac.za');
      }, []);
    const [email, setEmail] = useState('');  // State to hold the email
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationFeedback, setValidationFeedback] = useState([
        "At least 8 characters long",
        "At least one uppercase letter",
        "At least one lowercase letter",
        "At least one digit",
        "At least one special character"
    ]);

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

    // Function to validate the password and remove criteria that are satisfied
    const handlePasswordChange = (password) => {
        setNewPassword(password);

        const newValidationFeedback = [];

        if (password.length < 8) {
            newValidationFeedback.push("At least 8 characters long");
        }

        if (!/[A-Z]/.test(password)) {
            newValidationFeedback.push("At least one uppercase letter");
        }

        if (!/[a-z]/.test(password)) {
            newValidationFeedback.push("At least one lowercase letter");
        }

        if (!/\d/.test(password)) {
            newValidationFeedback.push("At least one digit");
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            newValidationFeedback.push("At least one special character");
        }

        setValidationFeedback(newValidationFeedback);
    };

    const resetPassword = () => {
        if (!email) {
            toast.warn('Email not found');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warn('Passwords do not match');
            return;
        }

        if (validationFeedback.length > 0) {
            toast.warn('Please meet all password requirements.');
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
                <h2 className={styles.formTitle}>Create Password</h2>
                <div className={styles.form}>
                    <label className={styles.label}>Password:</label>
                    <input
                        type="password"
                        onChange={(event) => handlePasswordChange(event.target.value)}
                        className={styles.inputField}
                        placeholder="Enter new password"
                    />

                    {/* Display only the unmet validation requirements */}
                    {validationFeedback.length > 0 && (
                        <ul className={styles.validationFeedback}>
                            {validationFeedback.map((feedback, index) => (
                                <li key={index} className={styles.invalid}>
                                    {feedback}
                                </li>
                            ))}
                        </ul>
                    )}

                    <label className={styles.label}>Confirm Password:</label>
                    <input
                        type="password"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className={styles.inputField}
                        placeholder="Confirm new password"
                    />
                    <button onClick={resetPassword} className={styles.submitBtn}>Reset Password</button>
                 {/* Link to login page */}
                 <p className={styles.loginLink}>
                        Remember your mind? <Link to="/login">Go to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

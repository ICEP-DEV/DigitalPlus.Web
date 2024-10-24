import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from './SendOTP.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; // Import the edit icon

function SendOTP() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);  // State to manage OTP being sent
    const [isLoading, setIsLoading] = useState(false);  // Loading state

    const sendOTP = () => {
        if (!email) {
            toast.warn('Please enter your email');
            return;
        }

        setIsLoading(true); // Start loading
        const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
        const subject = "Your OTP Code";
        const message = `Your One-Time Password (OTP) is ${otpCode}. Please use this to reset your password.`;

        const data = {
            email: email,
            subject: subject,
            message: message
        };

        axios.post('https://localhost:7163/api/Email/send', data)
            .then(response => {
                if (response.status === 200) {
                    toast.success('OTP sent to your email');
                    localStorage.setItem('otp', otpCode); // Temporarily store OTP for verification
                    localStorage.setItem('email', email); // Store the email in localStorage
                    setOtpSent(true);  // OTP was sent, show the confirm OTP field
                } else {
                    toast.error('Failed to send OTP');
                }
            })
            .catch((err) => {
                console.error('Error sending OTP:', err);
                toast.error('An error occurred');
            })
            .finally(() => {
                setIsLoading(false); // Stop loading after the request is done
            });
    };

    const confirmOTP = () => {
        if (!otp) {
            toast.warn('Please enter the OTP');
            return;
        }

        const storedOtp = localStorage.getItem('otp');
        if (otp === storedOtp) {
            toast.success('OTP verified');
            localStorage.removeItem('otp'); // Clear OTP after successful verification
            navigate('/forgot-password');  // Navigate to Reset Password page after OTP verification
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    // Function to edit the email (Reset the OTP process)
    const editEmail = () => {
        localStorage.removeItem('email');  // Optionally clear stored email
        setOtpSent(false);  // Reset OTP sent state
        setOtp('');  // Clear OTP input field
    };

    return (
        <div className={styles.sendOTPContainer}>
            <ToastContainer />
            <div className={styles.formBox}>
                <h2 className={styles.formTitle}>{otpSent ? 'Confirm OTP' : 'Send OTP'}</h2>
                <div className={styles.form}>
                    {!otpSent && (
                        <>
                            <label className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className={styles.inputField}
                                placeholder="Enter your email"
                            />
                            <button onClick={sendOTP} className={styles.submitBtn} disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </>
                    )}

                    {otpSent && (
                        <>
                            <label className={styles.label}>OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(event) => setOtp(event.target.value)}
                                className={styles.inputField}
                                placeholder="Enter the OTP sent to your email"
                            />
                            <button onClick={confirmOTP} className={styles.submitBtn}>Confirm OTP</button>
                            <button onClick={editEmail} className={styles.editEmailBtn} title="Edit Email">
    <FontAwesomeIcon icon={faEdit} /> {/* This displays the edit icon */}
    <span className={styles.editEmailText}> Edit Email</span>
</button>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SendOTP;

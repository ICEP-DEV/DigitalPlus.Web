import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import styles from './SendOTP.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

function SendOTP() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const [otpExpired, setOtpExpired] = useState(false); // New state to track expiration

    useEffect(() => {
        if (otpSent && timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else if (timer === 0 && !otpExpired) {
            toast.warn('OTP expired. Please resend OTP.');
            setOtpExpired(true); // Mark OTP as expired to prevent duplicate toasts
            setOtpSent(false); // Allow resending the OTP
            setOtp('');
        }
    }, [otpSent, timer, otpExpired]);

    const sendOTP = () => {
        if (!email) {
            toast.warn('Please enter your email');
            return;
        }

        setIsLoading(true);
        const otpCode = Math.floor(100000 + Math.random() * 900000);
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
                    localStorage.setItem('otp', otpCode);
                    localStorage.setItem('email', email);
                    setOtpSent(true);
                    setTimer(120); // Reset timer to 2 minutes
                    setOtpExpired(false); // Reset expiration state
                } else {
                    toast.error('Failed to send OTP');
                }
            })
            .catch((err) => {
                console.error('Error sending OTP:', err);
                toast.error('An error occurred');
            })
            .finally(() => {
                setIsLoading(false);
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
            localStorage.removeItem('otp');
            navigate('/forgot-password');
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    const editEmail = () => {
        localStorage.removeItem('email');
        setOtpSent(false);
        setOtp('');
        setTimer(120); // Reset timer if editing email
        setOtpExpired(false); // Reset expiration state
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
                                <FontAwesomeIcon icon={faEdit} />
                                <span className={styles.editEmailText}> Edit Email</span>
                            </button>
                            <p className={styles.timerText}>
                                Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                            </p>
                        </>
                    )}
                    <p className={styles.loginLink}>
                        Remember your password? <Link to="/login">Go to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SendOTP;
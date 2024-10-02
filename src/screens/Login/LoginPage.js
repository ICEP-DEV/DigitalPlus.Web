import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link and useNavigate
import styles from './LoginPage.module.css'; // Import the CSS module

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('https://localhost:7163/api/DigitalPlusLogin/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok && data.success) {
                // Store the entire user object (including email) in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
    
                // Redirect user based on their role
                if (data.role === 'Admin') {
                    navigate('/admin-dashboard/dashboard');
                } else if (data.role === 'Mentor') {
                    navigate('/mentor-dashboard/AnnouncementPage');
                } else if (data.role === 'Mentee') {
                    navigate('/mentee-dashboard/home');
                } else {
                    setError('Invalid user role');
                }
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Login failed. Please check your network or try again.');
        }
    };
    
    return (
        <div className={styles.loginContainer}>
            <div className={styles.formBox}>
                <h1 className={styles.formTitle}>WE-MEN-TOR</h1>
                <h2 className={styles.loginTitle}>LOGIN</h2>
                <form onSubmit={handleLogin} className={styles.form}>
                    <label className={styles.label}>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="username@gmail.com" 
                        required 
                        className={styles.inputField}
                    />
                    
                    <label className={styles.label}>Password:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" 
                        required 
                        className={styles.inputField}
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button className={styles.forgotPassword} type="button">Forgot Password?</button>

                    <input type="submit" value="Sign in" className={styles.submitBtn} />
                </form>

                <p className={styles.signupText}>
                    Don’t have an account yet? <Link to="/signup" className={styles.signupLink}>Sign Up</Link> {/* Using Link */}
                </p>
            </div>
        </div>
    );
};

export default Login;

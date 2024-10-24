import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'We-me-ntor'; // Update page title

        // Modify the URL to remove the '/login' path and replace it with 'We-me-ntor'
        window.history.pushState({}, '', '/We-me-ntor');
    }, []);

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
                localStorage.setItem('user', JSON.stringify(data.user));

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

                    <Link to="/Send-OTP" className={styles.forgotPassword}>
                        Forgot Password?
                    </Link>

                    <input type="submit" value="Sign in" className={styles.submitBtn} />
                </form>

                <p className={styles.signupText}>
                    Don’t have an account yet? <Link to="/SignUp" className={styles.signupLink}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

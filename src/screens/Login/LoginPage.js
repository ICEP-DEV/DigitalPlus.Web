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

        // Simulating the login behavior without a backend
        try {
            const response = await mockLoginApi(email, password); // Using the mock API function
            
            // Redirect user based on their role
            if (response.user.role === 'mentor') {
                navigate('/mentor-dashboard/home'); // Mentor dashboard
            } else if (response.user.role === 'mentee') {
                navigate('/mentee-dashboard/home'); // Mentee dashboard
            } else if (response.user.role === 'admin') {
                navigate('/admin-dashboard/dashboard'); // Admin dashboard
            } else {
                setError('Invalid user role');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
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

// Mocking an API request since there's no backend
const mockLoginApi = (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // This simulates different users based on the email
            if (email === 'mentor@test.com') {
                resolve({ user: { name: 'Mentor User', role: 'mentor' } });
            } else if (email === 'mentee@test.com') {
                resolve({ user: { name: 'Mentee User', role: 'mentee' } });
            } else if (email === 'admin@test.com') {
                resolve({ user: { name: 'Admin User', role: 'admin' } });
            } else {
                reject('Invalid credentials');
            }
        }, 1000); // Simulates a 1-second response delay
    });
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoTUT from '../../Assets/TUT_Logo_Transparent.png';
import background from '../../Assets/Login Background.jpeg';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true); // Start loading
    setError(''); // Clear any previous errors

    const loginRequest = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://192.168.1.238:7163/api/DigitalPlusLogin/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });

      const data = await response.json();

      if (data.Success) {
        toast.success(data.Message); // Show success message

        // Redirect based on the role
        if (data.Role === 'Admin') {
          navigate('/adminDashboard');
        } else if (data.Role === 'Mentor') {
          navigate('/mentorDashboard');
        } else if (data.Role === 'Mentee') {
          navigate('/menteeDashboard');
        }
      } else {
        setError(data.Message); // Set error if login fails
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className={styles.loginPage}>
      <img src={background} alt="Background" className={styles.background} />
      <div className={styles.loginBox}>
        <h2>WE-MEN-TOR</h2>
        <h3>LOGIN</h3>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="username@gmail.com"
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <a href="#forgot-password" className={styles.forgotPassword}>Forgot Password?</a>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>
        <p>Don't have an account yet? <Link to="/registerPage">Sign Up</Link></p>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default LoginPage;

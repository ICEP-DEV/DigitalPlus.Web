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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        toast.success('Login successful!', {
          position: 'top-right',
        });
        setTimeout(() => {
          navigate('/aboutPage');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid email or password');
        toast.error(errorData.error || 'Invalid email or password', {
          position: 'top-right',
        });
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An unexpected error occurred. Please try again later.');
      toast.error('An unexpected error occurred. Please try again later.', {
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <img src={background} alt="Background" className={styles.background} />
      <div className={styles.loginBox}>
        <h2>WE-MEN-TOR</h2>
        <h3>LOGIN</h3>
        <form onSubmit={handleSubmit}>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoTUT from '../../Assets/TUT_Logo_Transparent.png'; 
import background from '../../Assets/Login Background.jpeg'; 
import styles from './RegisterPage.module.css'; 
import axios from 'axios';

const SignUp = () => {
    const [mentee, setMentee] = useState({
        Mentee_Id: '',  // Added for Student Number
        FirstName: '',
        LastName: '',
        StudentEmail: '',
        ContactNo: '',
        DepartmentId: '',
        Password: '',
        Semester: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to clear messages after 10 seconds
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 1000); // 10 seconds

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [successMessage, errorMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMentee({ ...mentee, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if the Mentee_Id (Student Number) exists
            const checkResponse = await axios.get(`https://localhost:7163/api/DigitalPlusUser/CheckMentee/${mentee.Mentee_Id}`);
            if (checkResponse.data.exists) {
                setErrorMessage('Student number already exists!');
                return; // Exit if student number exists
            }
            
            // Proceed to register if Mentee_Id doesn't exist
            const response = await axios.post('https://localhost:7163/api/DigitalPlusUser/AddMentee', mentee);
            console.log('Mentee registered:', response.data);
            setSuccessMessage('Successfully registered a Mentee!');
            
            // Reset form
            setMentee({
                Mentee_Id: '',  // Reset Student Number
                FirstName: '',
                LastName: '',
                StudentEmail: '',
                ContactNo: '',
                DepartmentId: '',
                Password: '',
                Semester: ''
            });
            setErrorMessage(''); // Clear any existing error messages
        } catch (error) {
            console.error('There was an error registering the mentee!', error);
            setErrorMessage('An error occurred while registering. Please try again.');
        }
    };

    return (
        <div className={styles.registerPage}>
            <img src={background} alt="Background" className={styles.registerPageBackground} />
            <header className={styles.registerPageHeader}>
                <img src={logoTUT} alt="TUT Logo" className={styles.registerPageTutLogo} />
                <nav className={styles.registerPageNavigation}>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </nav>
            </header>
            <div className={styles.registerPageContainer}>
                <div className={styles.registerPageBox}>
                    <h2 className={styles.registerPageTitle}>WE-MEN-TOR</h2>
                    <div className={styles.registerPageFormSection + ' ' + styles.registerPageFormSectionLeft}>
                        <h3>SIGN UP</h3>
                        {successMessage && <div style={{ marginTop: '20px', marginBottom: '20px', color: 'green' }}>{successMessage}</div>}
                        {errorMessage && <div style={{ marginTop: '20px', marginBottom: '20px', color: 'red' }}>{errorMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <label>Student Number:</label>
                            <input type="text" name="Mentee_Id" value={mentee.Mentee_Id} onChange={handleChange} required />

                            <label>First Name:</label>
                            <input type="text" name="FirstName" value={mentee.FirstName} onChange={handleChange} required />
                        
                            <label>Last Name:</label>
                            <input type="text" name="LastName" value={mentee.LastName} onChange={handleChange} required />
                        
                            <label>Email:</label>
                            <input type="email" name="StudentEmail" value={mentee.StudentEmail} onChange={handleChange} required />
                    
                            <label>Contact No:</label>
                            <input type="text" name="ContactNo" value={mentee.ContactNo} onChange={handleChange} required />
                    
                            <label>Department:</label>
                            <select name="DepartmentId" value={mentee.DepartmentId} onChange={handleChange} required>
                                <option value="">Select Department</option>
                                <option value="1">Computer Science</option>
                                <option value="2">Multimedia</option>
                                <option value="3">Information Technology</option>
                                <option value="4">Informatics</option>
                            </select>

                            <label>Semester:</label>
                            <input type="text" name="Semester" value={mentee.Semester} onChange={handleChange} required />
                        
                        </form>
                    </div>
                    <div className={styles.registerPageFormSection + ' ' + styles.registerPageFormSectionRight}>
                        <h3>CREATE PASSWORD</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Password:</label>
                            <input type="password" name="Password" value={mentee.Password} onChange={handleChange} required />
                           
                            <button type="submit">Sign Up</button>
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

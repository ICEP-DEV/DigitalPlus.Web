import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoTUT from '../../Assets/TUT_Logo_Transparent.png'; // Ensure the path to your logo is correct
import background from '../../Assets/Login Background.jpeg'; // Ensure the path to your background is correct
import styles from './RegisterPage.module.css'; // Import the CSS module
import axios from 'axios';


const SignUp = () => {
    // const navigate = useNavigate();
    const [mentee, setMentee] = useState({
        FirstName: '',
        LastName: '',
        StudentEmail: '',
        ContactNo: '',
        DepartmentId: '',
        Password: '',
        Semester: ''
    });

    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMentee({ ...mentee, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7163/api/DigitalPlusUser/AddMentee', mentee);
            console.log('Mentee registered:', response.data);
            setSuccessMessage('Successfully registered a Mentee!');
            // Reset form
            setMentee({
                FirstName: '',
                LastName: '',
                StudentEmail: '',
                ContactNo: '',
                DepartmentId: '',
                Password: '',
                Semester: ''
            });
        } catch (error) {
            console.error('There was an error registering the mentee!', error);
            // Handle error response
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
                        {successMessage && <div style={{ marginTop: '20px',marginBottom:'20px', color: 'green' }}>{successMessage}</div>}
                        <form onSubmit={handleSubmit}>
                        <label>First Name:</label>
                        <input type="text" name="FirstName" value={mentee.FirstName} onChange={handleChange} required />
                        
                        
                            <label>Last Name:</label>
                            <input type="text" name="LastName" value={mentee.LastName} onChange={handleChange} required />
                        
                      
                            <label>Email:</label>
                            <input type="email" name="StudentEmail" value={mentee.StudentEmail} onChange={handleChange} required />
                   
                      
                            <label>Contact No:</label>
                            <input type="text" name="ContactNo" value={mentee.ContactNo} onChange={handleChange} required />
                    
                            <label>Department:</label>
                            <select name="DepartmentId"  value={mentee.DepartmentId} onChange={handleChange} required>
                                <option value="">Select Department</option>
                                <option value="1">Computer Science</option>
                                <option value="2">Multimedia</option>
                                <option value="3">Information Technology</option>
                                <option value="4">Informatics</option>
                            </select>

                        <label>Semester:</label>
                       <input type="text" name="Semester"  value={mentee.Semester} onChange={handleChange} required />
                        </form>
                    </div>
                    <div className={styles.registerPageFormSection + ' ' + styles.registerPageFormSectionRight}>
                        <h3>CREATE PASSWORD</h3>
                        <form onSubmit={handleSubmit}>
                        <label>Password:</label>
                       <input type="password" name="Password" value={mentee.Password} onChange={handleChange} required />
                            {/* <label>Confirm Password:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={mentee.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                            /> */}
                           
                            <button type="submit">Sign Up</button>
                          
                            <p >
                             Already have an account? <Link to="/login" >Login</Link> {/* Using Link */}
                           </p>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoTUT from '../../Assets/TUT_Logo_Transparent.png'; 
import background from '../../Assets/Login Background.jpeg'; 
import styles from './RegisterPage.module.css'; 
import axios from 'axios';

const SignUp = () => {
    const [mentee, setMentee] = useState({
        Mentee_Id: '',
        FirstName: '',
        LastName: '',
        StudentEmail: '',
        ContactNo: '',
        DepartmentId: '',
        Password: '',
        ConfirmPassword: '',
        Semester: ''
    });

    
    const [departments,setDepartments]=useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        minLength: false,
        upperCase: false,
        lowerCase: false,
        digit: false,
        specialChar: false
    });

    // Password visibility toggle states
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // Function to clear messages after 10 seconds
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 1000); // 10 seconds

            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    useEffect(() =>{
    
        const FetchDepartments= async () =>{
          try {
            const response = await axios.get( 'https://localhost:7163/api/DigitalPlusCrud/GetAllDepartments');
          setDepartments(response.data.result);
          console.log(response.data.result);
          
          } catch(error) {
            console.error('Error fetching departments:', error);
          }
        }
      
  
      FetchDepartments()
    },[]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMentee({ ...mentee, [name]: value });

        if (name === 'Password') {
            checkPasswordStrength(value); // Call function to update password strength as user types
        }
    };

    // Function to check password strength
    const checkPasswordStrength = (password) => {
        setPasswordStrength({
            minLength: password.length >= 8,
            upperCase: /[A-Z]/.test(password),
            lowerCase: /[a-z]/.test(password),
            digit: /[0-9]/.test(password),
            specialChar: /[^A-Za-z0-9]/.test(password)
        });
    };

    // Check if all password requirements are fulfilled
    const areAllRequirementsMet = () => {
        return Object.values(passwordStrength).every(Boolean);
    };

    // Validate password confirmation and overall password strength
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isPasswordValid = areAllRequirementsMet();

        if (!isPasswordValid) {
            setErrorMessage('Password does not meet all requirements.');
            return;
        }

        if (mentee.Password !== mentee.ConfirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            // Check if the Mentee_Id (Student Number) exists
            const checkResponse = await axios.get(`https://localhost:7163/api/DigitalPlusUser/CheckMentee/${mentee.Mentee_Id}`);
            if (checkResponse.data.exists) {
                setErrorMessage('Student number already exists!');
                return;
            }

            // Proceed to register if Mentee_Id doesn't exist
            const response = await axios.post('https://localhost:7163/api/DigitalPlusUser/AddMentee', mentee);
            console.log('Mentee registered:', response.data);
            setSuccessMessage('Successfully registered a Mentee!');

            // Reset form
            setMentee({
                Mentee_Id: '',
                FirstName: '',
                LastName: '',
                StudentEmail: '',
                ContactNo: '',
                DepartmentId: '',
                Password: '',
                ConfirmPassword: '',
                Semester: ''
            });
            setErrorMessage('');
        } catch (error) {
            console.error('There was an error registering the mentee!', error);
            setErrorMessage('An error occurred while registering. Please try again.');
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
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
                        
                              <label >Email:</label>  
                              <input type="email" name="StudentEmail" value={mentee.StudentEmail} onChange={handleChange}  required />  
                    
                            <label>Contact No:</label>
                            <input type="text" name="ContactNo" value={mentee.ContactNo} onChange={handleChange} required />
                    
                            <label>Department:</label>
                            <select name="DepartmentId" value={mentee.DepartmentId} onChange={handleChange} required>
                            <option value="">Select department</option>
                                {departments.map((dep, xid) =>(
                                <option key={xid+1} value={xid+1}>
                                {dep.department_Name}
                            </option>
                            ))}
                            </select>

                            <label>Semester:</label>
                            <input type="text" name="Semester" value={mentee.Semester} onChange={handleChange} required />
                        
                        </form>
                    </div>
                    <div className={styles.registerPageFormSection + ' ' + styles.registerPageFormSectionRight}>
                        <h3>CREATE PASSWORD</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Password:</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="Password"
                                    value={mentee.Password}
                                    onChange={handleChange}
                                    required
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {passwordVisible ? '🙈' : '👁'}
                                </span>
                            </div>

                            {!areAllRequirementsMet() && (
                                <ul className={styles.passwordRequirements}>
                                    <li style={{ color: passwordStrength.minLength ? 'green' : 'red' }}>
                                        At least 8 characters long
                                    </li>
                                    <li style={{ color: passwordStrength.upperCase ? 'green' : 'red' }}>
                                        At least one uppercase letter
                                    </li>
                                    <li style={{ color: passwordStrength.lowerCase ? 'green' : 'red' }}>
                                        At least one lowercase letter
                                    </li>
                                    <li style={{ color: passwordStrength.digit ? 'green' : 'red' }}>
                                        At least one digit
                                    </li>
                                    <li style={{ color: passwordStrength.specialChar ? 'green' : 'red' }}>
                                        At least one special character
                                    </li>
                                </ul>
                            )}

                            <label>Confirm Password:</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    name="ConfirmPassword"
                                    value={mentee.ConfirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <span
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {confirmPasswordVisible ? '🙈' : '👁'}
                                </span>
                            </div>

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

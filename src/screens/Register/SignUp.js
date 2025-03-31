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

    const [departments, setDepartments] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        minLength: false,
        upperCase: false,
        lowerCase: false,
        digit: false,
        specialChar: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password visibility toggle states
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);

    // Function to clear messages after 10 seconds
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 10000); // 10 seconds
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    useEffect(() => {
        const FetchDepartments = async () => {
            try {
                const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllDepartments');
                setDepartments(response.data.result);
                console.log(response.data.result);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        }
        FetchDepartments();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Mentee_Id') {
            mentee.StudentEmail = `${value}@tut4life.ac.za`;
        }
        setMentee({ ...mentee, [name]: value });

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }

        if (name === 'Password') {
            checkPasswordStrength(value);
        }
    };

    // Function to validate form fields
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!mentee.Mentee_Id.trim()) {
            errors.Mentee_Id = 'Student number is required';
            isValid = false;
        }

        if (!mentee.FirstName.trim()) {
            errors.FirstName = 'First name is required';
            isValid = false;
        }

        if (!mentee.LastName.trim()) {
            errors.LastName = 'Last name is required';
            isValid = false;
        }

        if (!mentee.ContactNo.trim()) {
            errors.ContactNo = 'Contact number is required';
            isValid = false;
        }

        if (!mentee.DepartmentId) {
            errors.DepartmentId = 'Department is required';
            isValid = false;
        }

        if (!mentee.Semester.trim()) {
            errors.Semester = 'Semester is required';
            isValid = false;
        }

        if (!mentee.Password) {
            errors.Password = 'Password is required';
            isValid = false;
        } else if (!areAllRequirementsMet()) {
            errors.Password = 'Password does not meet requirements';
            isValid = false;
        }

        if (!mentee.ConfirmPassword) {
            errors.ConfirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (mentee.Password !== mentee.ConfirmPassword) {
            errors.ConfirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
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
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            // Check if the Mentee_Id (Student Number) exists
            const checkResponse = await axios.get(`https://localhost:7163/api/DigitalPlusUser/CheckMentee/${mentee.Mentee_Id}`);
            if (checkResponse.data.exists) {
                setErrorMessage('Student number already exists!');
                setIsSubmitting(false);
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
            setFormErrors({});
            setErrorMessage('');

            //EMAIL MESSAGE
            const emailMessage = `
                <p>Hi ${mentee.FirstName.charAt(0)} ${mentee.LastName},</p>
                <p>Your account has been created Successfully. Please use your student email <strong>${mentee.StudentEmail}</strong> and password to log in. You can access the platform using the following link:</p>
                <p><a href="http://localhost:3000/" target="_blank">http://localhost:3000/</a></p>
                <p>You are reminded to change your password by clicking on the 'Forgotten Password' link on the login page.</p>
                <p>Regards,<br>Administrator</p>
            `;

            await axios.post(
                'https://localhost:7163/api/Email/Send',
                {
                    email: mentee.StudentEmail,
                    subject: 'Your Mentee Account Created Successfully',
                    message: emailMessage
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
            
        } catch (error) {
            console.error('There was an error registering the mentee! and Sending an email', error);
            setErrorMessage('An error occurred while registering. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                    <h2 className={styles.registerPageTitle}>WE-MEN-TOR <span role="img" aria-label="alert" style={{ fontSize: '24px' }}>❗</span></h2>
                    <div className={styles.registerPageFormSection + ' ' + styles.registerPageFormSectionLeft}>
                        <h3>SIGN UP </h3>
                        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <label>Student Number:</label>
                            <input 
                                type="text" 
                                name="Mentee_Id" 
                                value={mentee.Mentee_Id} 
                                onChange={handleChange} 
                                className={formErrors.Mentee_Id ? styles.errorInput : ''}
                            />
                            {formErrors.Mentee_Id && <span className={styles.errorText}>{formErrors.Mentee_Id}</span>}

                            <label>First Name:</label>
                            <input 
                                type="text" 
                                name="FirstName" 
                                value={mentee.FirstName} 
                                onChange={handleChange} 
                                className={formErrors.FirstName ? styles.errorInput : ''}
                            />
                            {formErrors.FirstName && <span className={styles.errorText}>{formErrors.FirstName}</span>}
                        
                            <label>Last Name:</label>
                            <input 
                                type="text" 
                                name="LastName" 
                                value={mentee.LastName} 
                                onChange={handleChange} 
                                className={formErrors.LastName ? styles.errorInput : ''}
                            />
                            {formErrors.LastName && <span className={styles.errorText}>{formErrors.LastName}</span>}
                        
                            <label>Email:</label>  
                            <input 
                                type="email" 
                                name="StudentEmail" 
                                value={mentee.StudentEmail} 
                                onChange={handleChange}  
                                placeholder={`${mentee.Mentee_Id ? mentee.Mentee_Id + '@tut4life.ac.za' : '@tut4life.ac.za'}`} 
                                readOnly 
                                className={formErrors.StudentEmail ? styles.errorInput : ''}
                            />  
                    
                            <label>Contact No:</label>
                            <input 
                                type="text" 
                                name="ContactNo" 
                                value={mentee.ContactNo} 
                                onChange={handleChange} 
                                className={formErrors.ContactNo ? styles.errorInput : ''}
                            />
                            {formErrors.ContactNo && <span className={styles.errorText}>{formErrors.ContactNo}</span>}
                    
                            <label>Department:</label>
                            <select 
                                name="DepartmentId" 
                                value={mentee.DepartmentId} 
                                onChange={handleChange} 
                                className={formErrors.DepartmentId ? styles.errorInput : ''}
                            >
                                <option value="">Select department</option>
                                {departments.map((dep) => (
                                    <option key={dep.department_Id} value={dep.department_Id}>
                                        {dep.department_Name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.DepartmentId && <span className={styles.errorText}>{formErrors.DepartmentId}</span>}

                            <label>Semester:</label>
                            <input 
                                type="text" 
                                name="Semester" 
                                value={mentee.Semester} 
                                onChange={handleChange} 
                                className={formErrors.Semester ? styles.errorInput : ''}
                            />
                            {formErrors.Semester && <span className={styles.errorText}>{formErrors.Semester}</span>}
                        
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
        className={formErrors.Password ? styles.errorInput : ''}
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
{formErrors.Password && <span className={styles.errorText}>{formErrors.Password}</span>}

<div style={{ display: 'flex', alignItems: 'center', gap: '1px', marginTop: '1px' }}>
    
    <span 
        style={{ cursor: 'pointer', fontSize: '18px', paddingBottom:'10px' }} 
        onClick={() => setShowPasswordInfo(!showPasswordInfo)}
    >
        ℹ️
    </span>
</div>

{showPasswordInfo && (
    <p style={{ fontSize: '14px', color: 'white' }}>
        <strong>Green ✅</strong> means the requirement is met.  
        <strong> Red ❌</strong> means it is not met.
    </p>
)}

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
                            <label>Confirm Password:</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    name="ConfirmPassword"
                                    value={mentee.ConfirmPassword}
                                    onChange={handleChange}
                                    className={formErrors.ConfirmPassword ? styles.errorInput : ''}
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
                            {formErrors.ConfirmPassword && <span className={styles.errorText}>{formErrors.ConfirmPassword}</span>}

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Sign Up'}
                            </button>
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles
import Header from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar'; 
import styles from './settings.module.css'; // Import the CSS module

const Settings = () => {
    const [activeTab, setActiveTab] = useState('personal-details');
    const [mentorForm, setMentorForm] = useState({
        mentorId: '', // Dynamically populate from API
        firstName: '',
        lastName: '',
        studentEmail: '',
        personalEmail: '',
        contactNo: '',
        password: '', // Not displayed but needed for password change
        activated: true,
        available: 0,
        module: '',
        lab: ''
    });

    // State for password fields
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Fetch the logged-in mentor's details
        const fetchMentorDetails = async () => {
            try {
                const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetMentor/1'); // Adjust endpoint as needed
                const mentorData = response.data;
                
                // Populate the form with the mentor data
                setMentorForm({
                    mentorId: mentorData.mentorId,
                    firstName: mentorData.firstName,
                    lastName: mentorData.lastName,
                    studentEmail: mentorData.studentEmail,
                    personalEmail: mentorData.personalEmail,
                    contactNo: mentorData.contactNo,
                    password: mentorData.password,
                    activated: !!mentorData.activated,
                    available: mentorData.available,
                    module: mentorData.module,
                    lab: mentorData.lab
                });
            } catch (error) {
                toast.error('Error fetching mentor details');
                console.error('Error fetching mentor details:', error);
            }
        };

        fetchMentorDetails();
    }, []);  

    // Handle input change for password fields
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({
            ...passwordForm,
            [name]: value
        });
    };

    // Handle form submission for password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Basic validation: Check if new password matches confirm password
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        try {
            const updatedMentorData = {
                ...mentorForm, // Include all the existing mentor details
                password: passwordForm.newPassword // Only change the password
            };

            const response = await axios.put(
                'https://localhost:7163/api/DigitalPlusUser/UpdateMentor/1',
                updatedMentorData
            );

            if (response.status === 200) {
                toast.success('Password updated successfully', {
                    position: 'top-right'
                });
                // Optionally clear the form after successful update
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error('Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Error updating password. Please try again.');
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    

    return (
        <div>
            <Header />
            <SideBar />
             {/* Toast container to show notifications */}
             <ToastContainer  
                style={{ zIndex: 10000 }}/>
      
            <div className={styles['settings-container']}>
                <h1 className={styles['settings-title']}>ACCOUNT SETTINGS</h1>
                <div className={styles['settings-tabs']}>
                    <button
                        className={`${styles['settings-tab']} ${activeTab === 'personal-details' ? styles['active'] : ''}`}
                        onClick={() => handleTabClick('personal-details')}>
                        PERSONAL DETAILS
                    </button>
                    <button
                        className={`${styles['settings-tab']} ${activeTab === 'change-password' ? styles['active'] : ''}`}
                        onClick={() => handleTabClick('change-password')}>
                        CHANGE PASSWORD
                    </button>
                </div>

                {activeTab === 'personal-details' && (
                    <form>
                    <div className={styles['settings-form-row']}>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="firstname" className={styles['settings-label']}>FIRSTNAME:</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                className={styles['settings-input']}
                                value={mentorForm.firstName}
                                readOnly
                            />
                        </div>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="lastname" className={styles['settings-label']}>LASTNAME:</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                className={styles['settings-input']}
                                value={mentorForm.lastName}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className={styles['settings-form-row']}>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="student-email" className={styles['settings-label']}>STUDENT EMAIL:</label>
                            <input
                                type="text"
                                id="student-email"
                                name="student-email"
                                className={styles['settings-input']}
                                value={mentorForm.studentEmail}
                                readOnly
                            />
                        </div>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="contact" className={styles['settings-label']}>CONTACT:</label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                className={styles['settings-input']}
                                value={mentorForm.contactNo}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className={styles['settings-form-row']}>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="module" className={styles['settings-label']}>Personal Email:</label>
                            <input
                                type="text"
                                id="personalEmail"
                                name="personalEmail"
                                className={styles['settings-input']}
                                value={mentorForm.personalEmail}
                                readOnly
                            />
                        </div>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="lab" className={styles['settings-label']}>Year of Study:</label>
                            <input
                                type="text"
                                id="yearOfStudy"
                                name="yearOfStudy"
                                className={styles['settings-input']}
                                value={mentorForm.lab}
                                readOnly
                            />
                        </div>
                    </div>
                </form>
                )}

                {activeTab === 'change-password' && (
                    <form onSubmit={handlePasswordSubmit}>
                        <div className={styles['settings-form-group']}>
                            <label htmlFor="current-password" className={styles['settings-label']}>CURRENT PASSWORD:</label>
                            <input
                                type="password"
                                id="current-password"
                                name="currentPassword"
                                className={styles['settings-input']}
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className={styles['settings-form-group']}>
                            <label htmlFor="new-password" className={styles['settings-label']}>NEW PASSWORD:</label>
                            <input
                                type="password"
                                id="new-password"
                                name="newPassword"
                                className={styles['settings-input']}
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className={styles['settings-form-group']}>
                            <label htmlFor="confirm-password" className={styles['settings-label']}>CONFIRM PASSWORD:</label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                className={styles['settings-input']}
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <button type="submit" className={styles['settings-button']}>CHANGE PASSWORD</button>
                    </form>
                )}
            </div>

           
        </div>
    );
};

export default Settings;

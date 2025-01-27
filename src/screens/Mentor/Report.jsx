import React, { useState } from 'react';
import styles from './Report.module.css';
import NavBar from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar';
import axios from 'axios';

const Report = () => {
    const [formData, setFormData] = useState({
        date: '',
        studentNumber: '',
        remarks: '',
        challenges: '',
        socialEngagement: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // To manage submission state
    const [modalOpen, setModalOpen] = useState(false); // To control the modal visibility
    const [modalMessage, setModalMessage] = useState(''); // To control the modal message

    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Get the current month
    const getCurrentMonth = () => {
        return new Date().toLocaleString('default', { month: 'long' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true); // Start submission
        const reportData = {
            mentorId: storedUser.mentorId, // Replace with the correct mentorId as needed
            date: formData.date,
            month: getCurrentMonth(), // Automatically get the current month
            noOfStudents: formData.studentNumber,
            remarks: formData.remarks,
            challenges: formData.challenges,
            socialEngagement: formData.socialEngagement,
        };

        try {
            const response = await axios.post('https://localhost:7163/api/MentorReport/add_Report', reportData);

            if (response.status === 200 || response.status === 201) {
                setModalMessage('Report submitted successfully!');
                setModalOpen(true); // Open modal on success
                handleReset(); // Reset form after submission
            } else {
                setModalMessage('Failed to submit the report.');
                setModalOpen(true); // Open modal on failure
            }
        } catch (error) {
            console.error('Error submitting the report:', error);
            setModalMessage(`Error: ${error.message}`);
            setModalOpen(true); // Open modal on error
        } finally {
            setIsSubmitting(false); // End submission state
        }
    };

    const handleReset = () => {
        setFormData({
            date: '',
            studentNumber: '',
            remarks: '',
            challenges: '',
            socialEngagement: ''
        });
    };

    const closeModal = () => {
        setModalOpen(false); // Close modal
    };

    return (
        <div>
            <NavBar />
            <SideBar />
            <div className={styles['report-form-container']}>
                <form onSubmit={handleSubmit}>
                    <h1>Mentor Monthly Report</h1>
                    <div className={styles['report-form-row']}>
                        <div className={styles['report-form-group']}>
                            <label htmlFor="student-number" className={styles['label']}>No. Of Students:</label>
                            <input
                                type="number"
                                id="student-number"
                                name="studentNumber"
                                value={formData.studentNumber}
                                onChange={handleChange}
                                required
                                className={styles['input-number']}
                            />
                        </div>
                    </div>
                    <div className={styles['report-form-group']}>
                        <label htmlFor="remarks" className={styles['label']}>REMARKS</label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            required
                            className={styles['textarea']}
                        />
                    </div>
                    <div className={styles['report-form-group']}>
                        <label htmlFor="challenges" className={styles['label']}>WRITE CHALLENGES/ RECOMMENDATIONS:</label>
                        <textarea
                            id="challenges"
                            name="challenges"
                            value={formData.challenges}
                            onChange={handleChange}
                            required
                            className={styles['textarea']}
                        />
                    </div>
                    <div className={styles['report-form-group']}>
                        <label htmlFor="social-engagement" className={styles['label']}>WRITE SOCIAL ENGAGEMENT:</label>
                        <textarea
                            id="social-engagement"
                            name="socialEngagement"
                            value={formData.socialEngagement}
                            onChange={handleChange}
                            required
                            className={styles['textarea']}
                        />
                    </div>
                    <div className={styles['report-button-container']}>
                        <button
                            type="button"
                            className={`${styles['report-btn']} ${styles['report-btn-clear']}`}
                            onClick={handleReset}
                            disabled={isSubmitting}
                        >
                            CLEAR FORM
                        </button>
                        <button
                            type="submit"
                            className={`${styles['report-btn']} ${styles['report-btn-submit']}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal for confirmation */}
            {modalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>{modalMessage}</p>
                        <button onClick={closeModal} className={styles['button']}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Report;

import React, { useState } from 'react';
import styles from './Report.module.css';
import Header from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar'; // Import the CSS module


const Report = () => {
    const [formData, setFormData] = useState({
        mentorName: '',
        date: '',
        studentNumber: '',
        remarks: '',
        challenges: '',
        socialEngagement: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form data:', formData);
        alert('Form submitted successfully!');
    };

    const handleReset = () => {
        setFormData({
            mentorName: '',
            date: '',
            studentNumber: '',
            remarks: '',
            challenges: '',
            socialEngagement: ''
        });
    };

    return (
        <div>
            <Header />
            <SideBar />
            
      
        <div className={styles['report-form-container']}>
            <form onSubmit={handleSubmit}>
                <div className={styles['report-form-row']}>
                    <div className={styles['report-form-group']}>
                        <label htmlFor="mentor-name">MENTOR'S NAME:</label>
                        <input
                            type="text"
                            id="mentor-name"
                            name="mentorName"
                            value={formData.mentorName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles['report-form-group']}>
                        <label htmlFor="date">DATE:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles['report-form-group']}>
                        <label htmlFor="student-number">No. Of Students:</label>
                        <input
                            type="number"
                            id="student-number"
                            name="studentNumber"
                            value={formData.studentNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className={styles['report-form-group']}>
                    <label htmlFor="remarks">REMARKS</label>
                    <textarea
                        id="remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles['report-form-group']}>
                    <label htmlFor="challenges">WRITE CHALLENGES/ RECOMMENDATIONS:</label>
                    <textarea
                        id="challenges"
                        name="challenges"
                        value={formData.challenges}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles['report-form-group']}>
                    <label htmlFor="social-engagement">WRITE SOCIAL ENGAGEMENT:</label>
                    <textarea
                        id="social-engagement"
                        name="socialEngagement"
                        value={formData.socialEngagement}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles['report-button-container']}>
                    <button type="button" className={`${styles['report-btn']} ${styles['report-btn-clear']}`} onClick={handleReset}>
                        CLEAR FORM
                    </button>
                    <button type="submit" className={`${styles['report-btn']} ${styles['report-btn-submit']}`}>
                        SUBMIT
                    </button>
                </div>
            </form>
        </div>
        </div>
       
    );
};

export default Report;

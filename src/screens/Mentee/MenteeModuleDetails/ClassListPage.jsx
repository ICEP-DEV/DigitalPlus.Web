import React, { useState, useEffect } from 'react';
import styles from './ClassListPage.module.css'; // Import the CSS module

const ClassListPage = () => {
    const [mentors, setMentors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Retrieve the module details from localStorage
        const storedModule = localStorage.getItem('selectedModule');
        if (storedModule) {
            const { moduleId } = JSON.parse(storedModule);
            if (moduleId) {
                fetch(`https://localhost:7163/api/AssignMod/getmentorsBy_ModuleId/${moduleId}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch mentors');
                        }
                        return response.json();
                    })
                    .then((data) => setMentors(data))
                    .catch((err) => setError(err.message));
            } else {
                setError('Module ID not found in local storage.');
            }
        } else {
            setError('No module selected. Please navigate from the modules page.');
        }
    }, []);

    const handleMessageClick = (mentorName) => {
        alert(`Message sent to ${mentorName}`);
        // Logic for messaging
    };

    return (
        <div className={styles.container}>
            <h1>Mentors for Selected Module</h1>
            {error ? (
                <p className={styles.error}>{error}</p>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STUDENT NUMBER</th>
                                <th>MENTOR NAME & SURNAME</th>
                                <th>EMAIL</th>
                                <th>DM MENTOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mentors.map((mentor) => (
                                <tr key={mentor.mentorId}>
                                    <td>{mentor.mentorId}</td>
                                    <td>{`${mentor.firstName} ${mentor.lastName}`}</td>
                                    <td>{mentor.studentEmail}</td>
                                    <td>
                                        <button
                                            className={styles.messageBtn}
                                            onClick={() => handleMessageClick(`${mentor.firstName} ${mentor.lastName}`)}
                                        >
                                            MESSAGE
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ClassListPage;

import React, { useState, useEffect } from 'react';
import styles from './ClassListPage.module.css'; // Import the CSS module
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ClassListPage = () => {
    const [students, setStudents] = useState([]); // State for mentees
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error handling
    const { moduleId } = useParams(); // Get moduleId from URL parameters
    const navigate = useNavigate(); // Hook for navigation

    // Fetch mentees when the component mounts
    useEffect(() => {
        const fetchMentees = async () => {
            try {
                const response = await fetch('/api/DigitalPlusUser/GetAllMentees'); // API endpoint
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`); // Throw error for non-OK status
                }
                
                const data = await response.json(); // Parse JSON response
                setStudents(data); // Set mentees data to state

                console.log("Fetched Mentees Data:", data); // Log the fetched data
                
            } catch (err) {
                console.error("Fetch Error:", err.message); // Log fetch errors
                setError(err.message); // Set error state
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };
    
        fetchMentees(); // Call the fetch function on component mount
    }, []);
    
     

    const handleMessageClick = (menteeId) => {
        // Navigate to the DM page with menteeId
        navigate(`/dm/${menteeId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // if (error) {
    //     return <div>Error: {error}</div>;
    // }

    return (
        <div className={styles.container}>
            <h1>List of Students {moduleId ? `enrolled for ${moduleId}` : ''}</h1>
            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STUDENT NUMBER</th>
                                <th>MENTEE NAME & SURNAME</th>
                                <th>EMAIL</th>
                                <th>DM STUDENT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.mentee_Id}>
                                    <td>{student.mentee_Id}</td>
                                    <td>{`${student.firstName} ${student.lastName}`}</td>
                                    <td>{student.studentEmail}</td>
                                    <td>
                                        <button
                                            className={styles.messageBtn}
                                            onClick={() => handleMessageClick(student.mentee_Id)}
                                        >
                                            MESSAGE
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClassListPage;

import React, { useState, useEffect } from 'react';
import styles from './ClassListPage.module.css'; // Import the CSS module
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ClassListPage = () => {
    const [students, setStudents] = useState([]); // State for mentees
    const [modules, setModules] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error handling
    const { moduleId } = useParams(); // Get moduleId from URL parameters
    const navigate = useNavigate(); // Hook for navigation

    const storedUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchModulesAndMentees = async () => {
            try {
                // Fetch modules assigned to the mentor
                const modulesResponse = await fetch(`https://localhost:7163/api/AssignMod/getmodulesBy_MentorId/${storedUser.mentorId}`);
    
                if (!modulesResponse.ok) {
                    throw new Error(`Modules API Error: ${modulesResponse.status}`);
                }
                const modulesData = await modulesResponse.json();
                
               

                setModules(modulesData); // Store fetched modules

                // Iterate through modules and fetch mentees
                const menteesPromises = modulesData.map(async (module) => {
                    const { moduleCode, module_Id } = module;

                    // Match moduleCode with moduleId (example logic; adjust as necessary)
                    if (String(moduleCode) === String(moduleId)) {
                        console.log(`Matched moduleCode (${moduleCode}) with moduleId (${moduleId}).`);

                        // Fetch mentees for the matched moduleId
                        const menteesResponse = await fetch(`https://localhost:7163/api/AssignMod/getmenteesBy_ModuleId/1`);
                        if (!menteesResponse.ok) {
                            throw new Error(`Mentees API Error for moduleId ${moduleId}: ${menteesResponse.status}`);
                        }

                        const menteesData = await menteesResponse.json();
                        console.log(`Mentees for Module ${moduleId}:`, menteesData);

                        return menteesData;
                    }

                    return [];
                });

                // Resolve all mentees fetch promises
                const menteesResults = await Promise.all(menteesPromises);

                // Flatten the menteesResults array
                const allMentees = menteesResults.flat();
                setMentees(allMentees);
            } catch (err) {
                console.error("Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchModulesAndMentees();
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
                            {mentees.map((mentee) => (
                                <tr key={mentee.mentee_Id}>
                                    <td>{mentee.mentee_Id}</td>
                                    <td>{`${mentee.firstName} ${mentee.lastName}`}</td>
                                    <td>{mentee.studentEmail}</td>
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

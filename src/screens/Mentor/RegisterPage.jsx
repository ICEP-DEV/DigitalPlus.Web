import React, { useState, useEffect } from 'react';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';
import axios from 'axios';

const RegisterPage = () => {
    const [selectedModule, setSelectedModule] = useState('');
    const [mentors, setMentors] = useState([]);
    const [displayName, setDisplayName] = useState('PROFILE');
    const [allmodules, setAllModules] = useState([]);
    const [mentorID, setMentorID] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.firstName && storedUser.lastName) {
            const initials = storedUser.firstName
                .split(' ')
                .map(name => name[0])
                .join('');
            setDisplayName(`${initials} ${storedUser.lastName}`);
            setMentorID(storedUser.mentorId);
        }
    }, []);

    useEffect(() => {
        const fetchAssignedModules = async () => {
            if (mentorID) {
                try {
                    console.log("Fetching modules for mentor ID:", mentorID);

                    // Fetch assigned modules by mentor ID
                    const response = await axios.get(`https://localhost:7163/api/AssignMod/getmodulesBy_MentorId/${mentorID}`);
                    const assignedModules = response.data;

                    if (assignedModules && assignedModules.length > 0) {
                        console.log("Assigned modules data:", assignedModules);

                        // Fetch detailed information for each module
                        const moduleDetails = await Promise.all(
                            assignedModules.map(async (module) => {
                                try {
                                    const moduleDetailsResponse = await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetModule/${module.moduleId}`);
                                    console.log("Fetched module detail:", moduleDetailsResponse.data.result);
                                    return moduleDetailsResponse.data.result; // Ensure "result" matches response structure
                                } catch (moduleError) {
                                    console.error("Error fetching module details:", moduleError);
                                    return null;
                                }
                            })
                        );

                        // Filter out any failed fetches (null entries)
                        const validModules = moduleDetails.filter(detail => detail !== null);
                        setAllModules(validModules);
                        console.log("Final module details set:", validModules);
                    } else {
                        console.log("No assigned modules found for this mentor.");
                    }
                } catch (error) {
                    console.error("Error fetching assigned modules:", error);
                }
            }
        };
        fetchAssignedModules();
    }, [mentorID]);

    const handleModuleChange = (event) => {
        setSelectedModule(event.target.value);
    };

    return (
        <div style={styles.pageContainer}>
            <NavBar />
            <SideBar />
            <div><h1 style={styles.headerTitle}>Register</h1></div>
            <div style={styles.registerPageContainer}>
                <div style={styles.mainContent}>
                    <div style={styles.header}></div>
                    <div style={styles.formWrapper}>
                        <div style={styles.formContainer}>
                            <form>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Student Number:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter student number"
                                        style={styles.input}
                                        disabled
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Module Code:</label>
                                    <select
                                        value={selectedModule}
                                        onChange={handleModuleChange}
                                        style={styles.input}
                                    >
                                        <option value="">Select the module</option>
                                        {allmodules.length > 0 ? (
                                            allmodules.map((module) => (
                                                <option key={module.moduleId} value={module.module_Code}>
                                                    {module.module_Code}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No modules available</option>
                                        )}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Mentor's Name:</label>
                                    <select
                                        style={styles.input}
                                        value={displayName}
                                        disabled
                                    >
                                        <option value={displayName}>{displayName}</option>
                                        {mentors.map((mentor, index) => (
                                            <option key={index} value={mentor}>{mentor}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.buttonContainer}>
                                    <button
                                        type="submit"
                                        style={styles.submitButton}
                                    >
                                        Activate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        height: '100vh',
        margin: 0,
        overflow: 'hidden',
        backgroundColor: '#D9D9D9',
    },
    registerPageContainer: {
        display: 'flex',
        height: '70%',
        fontFamily: 'Arial, sans-serif',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    mainContent: {
        backgroundColor: '#D9D9D9',
        padding: '20px',
        maxWidth: '1200px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    headerTitle: {
        fontSize: '24px',
        color: '#001C4A',
    },
    formWrapper: {
        display: 'flex',
        width: '100%',
        flex: 1,
        gap: '30px',
    },
    formContainer: {
        flex: 1,
    },
    formGroup: {
        marginBottom: '15px',
    },
    formLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '5px solid #000000',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#ABAAAA',
        color: '#000',
        fontWeight: 'bolder',
    },
    submitButton: {
        backgroundColor: '#000C24',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '150px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
};

export default RegisterPage;

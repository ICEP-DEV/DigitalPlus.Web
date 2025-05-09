import React, { useState, useEffect } from 'react';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';
import axios from 'axios';
import { useNotification } from './../Admin/NotificationContext';

const RegisterPage = () => {
    const [selectedModule, setSelectedModule] = useState('');
    const [allModules, setAllModules] = useState([]);
    const [mentorID, setMentorID] = useState(null);
    const [fetchedMentorID, setFetchedMentorID] = useState('');
    const [displayName, setDisplayName] = useState('PROFILE');
    const [isRegisterActivated, setIsRegisterActivated] = useState(false);
    const [activationTime, setActivationTime] = useState(null);
    const { showNotification } = useNotification();
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.firstName && storedUser.lastName) {
            setDisplayName(`${storedUser.firstName} ${storedUser.lastName}`);
            setMentorID(storedUser.mentorId);
            setFetchedMentorID(storedUser.mentorId);
        }
    }, []);

    useEffect(() => {
        if (isRegisterActivated && activationTime) {
            const timer = setTimeout(() => {
                handleDeactivateRegister();
            }, 3600000); // 1 hour in milliseconds
            return () => clearTimeout(timer);
        }
    }, [isRegisterActivated, activationTime]);

    useEffect(() => {
        const fetchAssignedModules = async () => {
            if (mentorID) {
                try {
                    const response = await axios.get(`https://localhost:7163/api/AssignMod/getmodulesBy_MentorId/${mentorID}`);
                    const assignedModules = response.data;
                    if (assignedModules && assignedModules.length > 0) {
                        const moduleDetails = await Promise.all(
                            assignedModules.map(async (module) => {
                                try {
                                    const moduleDetailsResponse = await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetModule/${module.moduleId}`);
                                    return moduleDetailsResponse.data.result;
                                } catch (moduleError) {
                                    console.error("Error fetching module details:", moduleError);
                                    return null;
                                }
                            })
                        );
                        setAllModules(moduleDetails.filter(detail => detail !== null));
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

    const handleActivateRegister = async () => {
        if (!selectedModule) {
            showNotification("Please select a module.");
            return;
        }
        try {
            const payload = {
                MentorId: mentorID,
                MentorName: displayName,
                ModuleId: allModules.find((module) => module.module_Code === selectedModule)?.module_Id,
                ModuleCode: selectedModule,
                IsRegisteractivated: true,
            };

            const response = await axios.post('https://localhost:7163/api/MenteeAndMentorRegister/InsertMentorRegister', payload);

            showNotification(response.data.message || "Register activated successfully.");
            setIsRegisterActivated(true);
            setActivationTime(Date.now());
        } catch (error) {
            console.error("Error activating register:", error);
            alert("Failed to activate register.");
        }
    };

    const handleDeactivateRegister = async () => {
        try {
            const payload = {
                MentorId: mentorID,
                MentorName: displayName,
                ModuleId: allModules.find((module) => module.module_Code === selectedModule)?.module_Id,
                ModuleCode: selectedModule,
                IsRegisteractivated: false,
            };

            await axios.post('https://localhost:7163/api/MenteeAndMentorRegister/InsertMentorRegister', payload);
            setIsRegisterActivated(false);
            setActivationTime(null);
            showNotification("Register automatically deactivated.");
        } catch (error) {
            console.error("Error deactivating register:", error);
        }
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
                                    <input value={fetchedMentorID} style={styles.input} disabled readOnly />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Module Code:</label>
                                    <select value={selectedModule} onChange={handleModuleChange} style={styles.input}>
                                        <option value="">Select the module</option>
                                        {allModules.map((module) => (
                                            <option key={module.moduleId} value={module.module_Code}>{module.module_Code}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Mentor's Name:</label>
                                    <input type="text" value={displayName} style={styles.input} disabled readOnly />
                                </div>

                                <div style={styles.buttonContainer}>
                                    <button type="button" style={styles.submitButton} onClick={handleActivateRegister}>
                                        {isRegisterActivated ? "Deactivate" : "Activate"}
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
        maxWidth: '1000px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
    },

      // Media query for screens smaller than 768px
      '@media (max-width: 768px)': {
        registerPageContainer: {
            height: 'auto', // Allow the height to adjust
            padding: '10px', // Adjust padding for smaller screens
        },
        mainContent: {
            flexDirection: 'column', // Stack elements vertically
            gap: '15px', // Reduce the gap between elements
            padding: '15px', // Adjust padding for smaller screens
        },
    },

    // Media query for very small screens below 480px
    '@media (max-width: 480px)': {
        mainContent: {
            padding: '10px', // Adjust padding further for smaller screens
            gap: '10px', // Further reduce the gap between elements
        },
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

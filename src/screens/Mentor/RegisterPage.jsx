// import React, { useEffect, useState } from 'react';
// import NavBar from './Navigation/NavBar';
// import SideBar from './Navigation/SideBar';

// const RegisterPage = () => {
//     const [selectedModule, setSelectedModule] = useState('');
//     const [mentors, setMentors] = useState([]);

//     const [displayName, setDisplayName] = useState('PROFILE'); // Initialize the state for the display name

//   // UseEffect to get firstName and lastName from localStorage
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user')); // Get the user object from localStorage
//     if (storedUser && storedUser.firstName && storedUser.lastName) {
//       // Extract initials from the firstName
//       const initials = storedUser.firstName
//         .split(' ') // Split by spaces to handle multiple words
//         .map(name => name[0]) // Get the first letter of each word
//         .join(''); // Join the initials together

//       // Set display name as initials + last name
//       setDisplayName(`${initials} ${storedUser.lastName}`);
//     }
//   }, []);

//     // Define mentors for each module
//     const moduleMentors = {
//         'PPA F05D': ['B Buthelezi', 'S Vinjwa', 'T Mmethi'],
//         'PPB 216D': ['A Nkosi', 'L Dlamini', 'K Ndlovu'],
//         'OOP 216D': ['M Khumalo', 'R Sithole', 'S Ncube'],
//         'AOP 316D': ['J Moyo', 'C Hadebe', 'G Mthethwa']
//     };

//     // Handle module change
//     const handleModuleChange = (event) => {
//         const selected = event.target.value;
//         setSelectedModule(selected);
//         setMentors(moduleMentors[selected] || []);
//     };

//     return (
//         <div style={styles.pageContainer}>
//             <NavBar />
//             <SideBar />
//             <div><h1 style={styles.headerTitle}>Register</h1> {/* Added Register heading */}</div>
//             <div style={styles.registerPageContainer}>
//                 <div style={styles.mainContent}>
//                     <div style={styles.header}></div>
//                     <div style={styles.formWrapper}>
//                         <div style={styles.formContainer}>
//                             <form>
//                                 <div style={styles.formGroup}>
//                                     <label style={styles.formLabel}>Student Number:</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter student number"
//                                         style={styles.input}
//                                     />
//                                 </div>

//                                 <div style={styles.formGroup}>
//                                     <label style={styles.formLabel}>Module Code:</label>
//                                     <select
//                                         value={selectedModule}
//                                         onChange={handleModuleChange}
//                                         style={styles.input}
//                                         disabled // Disable this field
//                                     >
//                                         <option value="" disabled>Select the module</option>
//                                         <option value="PPA F05D">PPA F05D</option>
//                                         <option value="PPB 216D">PPB 216D</option>
//                                         <option value="OOP 216D">OOP 216D</option>
//                                         <option value="AOP 316D">AOP 316D</option>
//                                     </select>
//                                 </div>

//                                 <div style={styles.formGroup}>
//                                     <label style={styles.formLabel}>Mentor's Name:</label>
//                                     <select
//                                         style={styles.input}
//                                         disabled // Disable this field
//                                     >
//                                         <option value="" disabled>Select mentor</option>
//                                         {mentors.map((mentor, index) => (
//                                             <option key={index} value={mentor}>{mentor}</option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div style={styles.buttonContainer}>
//                                     <button
//                                         type="submit"
//                                         style={styles.submitButton}
//                                     >
//                                         Activate
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const styles = {
//     pageContainer: {
//         height: '100vh',
//         margin: 0,
//         overflow: 'hidden', // Prevents scrolling
//         backgroundColor: '#D9D9D9', // Set background color of the page
//     },
//     registerPageContainer: {
//         display: 'flex',
//         height: '70%',
//         fontFamily: 'Arial, sans-serif',
//         justifyContent: 'center',
//         alignItems: 'center',
//         overflow: 'hidden',  // Prevents scrolling
//     },
//     mainContent: {
//         backgroundColor: '#D9D9D9', // Ensure consistency in background color
//         padding: '20px',
//         maxWidth: '1200px', // Increased max width to accommodate space for comment
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
//         borderRadius: '8px',
//         width: '100%',
//         display: 'flex',
//         flexDirection: 'row',
//         gap: '20px',
//     },
//     header: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '20px',
//     },
//     headerTitle: {
//         fontSize: '24px',
//         color: '#001C4A',
//     },
//     formWrapper: {
//         display: 'flex',
//         width: '100%',
//         flex: 1,
//         gap: '30px', // Adds a gap between the form and the comment section
//     },
//     formContainer: {
//         flex: 1,
//     },
//     formGroup: {
//         marginBottom: '15px',
//     },
//     formLabel: {
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     input: {
//         padding: '10px',
//         borderRadius: '4px',
//         border: '5px solid #000000',
//         width: '100%',
//         boxSizing: 'border-box',
//         backgroundColor: '#ABAAAA',
//     },
//     submitButton: {
//         backgroundColor: '#000C24',
//         color: 'white',
//         padding: '10px',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         width: '150px',
//     },
//     buttonContainer: {
//         display: 'flex',
//         justifyContent: 'center',
//         marginTop: '20px', // Adds some space above the button
//     },
// };

// export default RegisterPage;



import React, { useState, useEffect } from 'react';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';

const RegisterPage = () => {
    const [selectedModule, setSelectedModule] = useState('');
    const [mentors, setMentors] = useState([]);
    const [displayName, setDisplayName] = useState('PROFILE'); // Initialize the display name

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.firstName && storedUser.lastName) {
            const initials = storedUser.firstName
                .split(' ')
                .map(name => name[0])
                .join('');
            setDisplayName(`${initials} ${storedUser.lastName}`);
        }
    }, []);
    

    const moduleMentors = {
        'PPA F05D': ['B Buthelezi', 'S Vinjwa', 'T Mmethi'],
        'PPB 216D': ['A Nkosi', 'L Dlamini', 'K Ndlovu'],
        'OOP 216D': ['M Khumalo', 'R Sithole', 'S Ncube'],
        'AOP 316D': ['J Moyo', 'C Hadebe', 'G Mthethwa']
    };

    const handleModuleChange = (event) => {
        const selected = event.target.value;
        setSelectedModule(selected);
        setMentors(moduleMentors[selected] || []);
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
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Module Code:</label>
                                    <select
                                        value={selectedModule}
                                        onChange={handleModuleChange}
                                        style={styles.input}
                                        disabled
                                    >
                                        <option value="" disabled>Select the module</option>
                                        <option value="PPA F05D">PPA F05D</option>
                                        <option value="PPB 216D">PPB 216D</option>
                                        <option value="OOP 216D">OOP 216D</option>
                                        <option value="AOP 316D">AOP 316D</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Mentor's Name:</label>
                                    <select
                                        style={styles.input}
                                        value={displayName} // Display the constructed displayName
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

import React, { useState } from 'react';
import HeaderAnnouncementPage from '../Mentor/Headers/HeaderAnnouncementPage';
import SideBar from './Navigation/SideBar';

const RegisterPage = () => {
    const [selectedModule, setSelectedModule] = useState('');
    const [mentors, setMentors] = useState([]);
    const [rating, setRating] = useState(0); // State to manage the slider value

    // Define mentors for each module
    const moduleMentors = {
        'PPA F05D': ['B Buthelezi', 'S Vinjwa', 'T Mmethi'],
        'PPB 216D': ['A Nkosi', 'L Dlamini', 'K Ndlovu'],
        'OOP 216D': ['M Khumalo', 'R Sithole', 'S Ncube'],
        'AOP 316D': ['J Moyo', 'C Hadebe', 'G Mthethwa']
    };

    // Handle module change
    const handleModuleChange = (event) => {
        const selected = event.target.value;
        setSelectedModule(selected);
        setMentors(moduleMentors[selected] || []);
    };

    // Handle rating change
    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    return (
        <div style={styles.pageContainer}>
            <HeaderAnnouncementPage />
            <SideBar />
            <div style={styles.registerPageContainer}>
                <div style={styles.mainContent}>
                    <div style={styles.header}>
                        {/* <h1 style={styles.headerTitle}>REGISTER</h1> */}
                        {/* <div style={styles.userInfo}>B MDLULI</div> */}
                    </div>
                    <div style={styles.formWrapper}>
                        <div style={styles.formContainer}>
                            <form>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Student Number:</label>
                                    <input type="text" placeholder="Enter student number" style={styles.input} />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Module Code:</label>
                                    <select value={selectedModule} onChange={handleModuleChange} style={styles.input}>
                                        <option value="" disabled>Select the module</option>
                                        <option value="PPA F05D">PPA F05D</option>
                                        <option value="PPB 216D">PPB 216D</option>
                                        <option value="OOP 216D">OOP 216D</option>
                                        <option value="AOP 316D">AOP 316D</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Choose Mentor:</label>
                                    <select style={styles.input}>
                                        <option value="" disabled>Select mentor</option>
                                        {mentors.map((mentor, index) => (
                                            <option key={index} value={mentor}>{mentor}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Signature:</label>
                                    <div style={styles.signaturePlaceholder}>[SIGNATURE AREA]</div>
                                </div> */}

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Rating:</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        step="1"
                                        value={rating} // Bind the value to the state
                                        onChange={handleRatingChange} // Handle the slider value change
                                        style={styles.rangeSlider}
                                    />
                                    <div style={styles.sliderLabels}>
                                        <span>0</span>
                                        <span>1</span>
                                        <span>2</span>
                                        <span>3</span>
                                        <span>4</span>
                                        <span>5</span>
                                        <span>6</span>
                                        <span>7</span>
                                        <span>8</span>
                                        <span>9</span>
                                        <span>10</span>
                                    </div>
                                </div>

                                {/* Wrap submit button with a container for centering */}
                                <div style={styles.buttonContainer}>
                                    <button type="submit" style={styles.submitButton}>Submit</button>
                                </div>
                            </form>
                        </div>
                        <div style={styles.commentContainer}>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Comment:</label>
                                <textarea placeholder="Write your comment" style={styles.textarea} />
                                <i className="fas fa-upload" style={styles.uploadIcon}></i>
                            </div>
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
        overflow: 'hidden', // Prevents scrolling
        backgroundColor: '#D9D9D9', // Set background color of the page
    },
    registerPageContainer: {
        display: 'flex',
        height: '100%',
        fontFamily: 'Arial, sans-serif',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',  // Prevents scrolling
    },
    mainContent: {
        backgroundColor: '#D9D9D9', // Ensure consistency in background color
        padding: '20px',
        maxWidth: '1200px', // Increased max width to accommodate space for comment
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
    userInfo: {
        backgroundColor: '#D3D3D3',
        padding: '10px',
        borderRadius: '50%',
        textAlign: 'center',
    },
    formWrapper: {
        display: 'flex',
        width: '100%',
        flex: 1,
        gap: '30px', // Adds a gap between the form and the comment section
    },
    formContainer: {
        flex: 1,
    },
    commentContainer: {
        width: '500px', // Adjust the width as needed
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
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
    textarea: {
        padding: '10px',
        borderRadius: '4px',
        border: '5px solid #000000', // Increased border width
        width: '100%',
        height: '300px', // Increased height for the comment
        boxSizing: 'border-box',
        backgroundColor: '#ABAAAA',
    },
    uploadIcon: {
        color: 'green',
        fontSize: '20px',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    signaturePlaceholder: {
        border: '1px solid #333',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    rangeSlider: {
        width: '100%',
        // Slider color changes via pseudo-elements
        WebkitAppearance: 'none', // Remove default appearance for Webkit browsers
        backgroundColor: '#000C24', // Track color
        height: '8px', // Track height
        borderRadius: '5px',
        outline: 'none',
        cursor: 'pointer',
    },
    sliderLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
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
        marginTop: '20px', // Adds some space above the button
    },
};

export default RegisterPage;

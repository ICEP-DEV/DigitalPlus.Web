import React, { useState } from 'react';
import Header from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar'; 
import styles from './settings.module.css'; // Import the CSS module

const Settings = () => {
    const [activeTab, setActiveTab] = useState('personal-details');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
        <Header />
        <SideBar />
      
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
                <button
                    className={`${styles['settings-tab']} ${activeTab === 'notifications' ? styles['active'] : ''}`}
                    onClick={() => handleTabClick('notifications')}>
                    NOTIFICATIONS
                </button>
            </div>

            {activeTab === 'personal-details' && (
                <form>
                    <div className={styles['settings-form-row']}>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="firstname" className={styles['settings-label']}>FIRSTNAME:</label>
                            <input type="text" id="firstname" name="firstname" className={styles['settings-input']}  />
                        </div>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="lastname" className={styles['settings-label']}>LASTNAME:</label>
                            <input type="text" id="lastname" name="lastname" className={styles['settings-input']}  />
                        </div>
                    </div>
                    <div className={styles['settings-form-row']}>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="student-email" className={styles['settings-label']}>STUDENT EMAIL:</label>
                            <input type="text" id="student-email" name="student-email" className={styles['settings-input']}  />
                        </div>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="contact" className={styles['settings-label']}>CONTACT:</label>
                            <input type="text" id="contact" name="contact" className={styles['settings-input']} />
                        </div>
                    </div>
                    <div className={styles['settings-form-row']}>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="department" className={styles['settings-label']}>DEPARTMENT:</label>
                            <input type="text" id="department" name="department" className={styles['settings-input']}  />
                        </div>
                        <div className={styles['settings-form-column']}>
                            <label htmlFor="year-of-study" className={styles['settings-label']}>YEAR OF STUDY:</label>
                            <input type="text" id="year-of-study" name="year-of-study" className={styles['settings-input']}  />
                        </div>
                    </div>
                    <div className={styles['settings-buttons']}>
                        <button type="submit" className={styles['settings-button']}>SAVE</button>
                        <button type="button" className={`${styles['settings-button']} ${styles['cancel']}`}>CANCEL</button>
                    </div>
                </form>
            )}
            {activeTab === 'change-password' && (
                <form>
                    <div className={styles['settings-form-group']}>
                        <label htmlFor="current-password" className={styles['settings-label']}>CURRENT PASSWORD:</label>
                        <input type="password" id="current-password" name="current-password" className={styles['settings-input']} />
                    </div>
                    <div className={styles['settings-form-group']}>
                        <label htmlFor="new-password" className={styles['settings-label']}>NEW PASSWORD:</label>
                        <input type="password" id="new-password" name="new-password" className={styles['settings-input']} />
                    </div>
                    <div className={styles['settings-form-group']}>
                        <label htmlFor="confirm-password" className={styles['settings-label']}>CONFIRM PASSWORD:</label>
                        <input type="password" id="confirm-password" name="confirm-password" className={styles['settings-input']} />
                    </div>
                    <button type="submit" className={styles['settings-button']}>CHANGE PASSWORD</button>
                </form>
            )}
        </div>
        </div>
        
    );
};

export default Settings;

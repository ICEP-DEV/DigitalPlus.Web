import React, { useState } from 'react';
import styles from './KeyPageAlert.module.css';
import { FaKey, FaWindowClose } from 'react-icons/fa';

function KeyPageAlert({ showModal, onClose }) {
    const [viewState, setViewState] = useState('initial'); 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');

    const [keyNotifications, setKeyNotifications] = useState([
        { date: '08:07 2024/08/27', name: 'Bongiwe Buthelezi', contact: '0827345678', location: 'lab 10 G40' },
        { date: '10:30 2024/08/29', name: 'Tumelo Mmethi', contact: '0825612348', location: 'lab 10 G20' },
        { date: '09:45 2024/08/30', name: 'Sifiso Vinjwa', contact: '0762345678', location: 'lab 10 G144' },
    ]);

    const handleReportClick = () => {
        setViewState('form');
    };

    const handleViewInfoClick = () => {
        setViewState('info');
    };

    const handleSendClick = () => {
        const newNotification = {
            date: new Date().toLocaleString(),
            name: `${firstName} ${lastName}`,
            contact,
            location: 'lab 10 G42',
        };

        // Add the new notification to the beginning of the array
        setKeyNotifications((prevNotifications) => [newNotification, ...prevNotifications]);

        // Clear the form fields
        setFirstName('');
        setLastName('');
        setContact('');

        // Change view state to show info
        setViewState('info');
    };

    const handleCancelClick = () => {
        setViewState('initial');
    };

    const handleBackClick = () => {
        setViewState('initial');
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    if (!showModal) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <span className={styles.closeButton} onClick={onClose}>
                        <FaWindowClose />
                    </span>
                    <div className={styles.iconContainer}>
                        <FaKey className={styles.modalKeyIcon} />
                    </div>
                    <p className={styles.infoText}>Information About the Key</p>

                    {viewState === 'info' && (
                        <div className={styles.notificationsContainer}>
                            <h3>KEY NOTIFICATION(S)</h3>
                            <ul className={styles.notificationsList}>
                                {keyNotifications.map((notification, index) => (
                                    <li key={index} className={styles.notificationItem}>
                                        <div>{notification.date}</div>
                                        <div>
                                            <strong>{notification.name}</strong> ({notification.contact}) has the key to {notification.location}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button className={styles.backButton} onClick={handleBackClick}>BACK</button>
                        </div>
                    )}

                    {viewState === 'form' && (
                        <div className={styles.formContainer}>
                            <h2>IF YOU HAVE THE KEY PUT YOUR INFORMATION AND UPDATE TO NOTIFY OTHER MENTORS</h2>
                            <label>
                                FIRSTNAME:
                                <input 
                                    type="text" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                />
                            </label>
                            <label>
                                LASTNAME:
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)} 
                                />
                            </label>
                            <label>
                                CONTACT:
                                <input 
                                    type="text" 
                                    value={contact} 
                                    onChange={(e) => setContact(e.target.value)} 
                                />
                            </label>
                            <button className={styles.sendButton} onClick={handleSendClick}>SEND</button>
                            <button className={styles.cancelButton} onClick={handleCancelClick}>CANCEL</button>
                        </div>
                    )}

                    {viewState === 'initial' && (
                        <div className={styles.buttonContainer}>
                            <button className={styles.reportButton} onClick={handleReportClick}>REPORT</button>
                            <button className={styles.viewButton} onClick={handleViewInfoClick}>VIEW THE INFO</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default KeyPageAlert;

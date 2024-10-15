// CreateNewAnnouncement.js

import React, { useState } from 'react';
import styles from './CreateNewAnnouncement.module.css'; // Ensure your CSS file exists
import { BsPlusCircle, BsTrash, BsCheckCircle } from 'react-icons/bs'; // Importing icons

const CreateNewAnnouncement = ({ isOpen, onClose }) => {
    const [announcementName, setAnnouncementName] = useState('');
    const [announcementType, setAnnouncementType] = useState('one-time');
    const [sendDate, setSendDate] = useState('');
    const [recipientType, setRecipientType] = useState('mentees');
    const [photo, setPhoto] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('');
    const [content, setContent] = useState('');

    const handleCreateAnnouncement = () => {
        if (window.confirm("Are you sure you want to create this announcement?")) {
            console.log('Announcement Created:', {
                announcementName,
                announcementType,
                sendDate,
                recipientType,
                photo,
                photoUrl,
                content,
            });
            resetForm();
            onClose(); // Close the modal after creating the announcement
        }
    };

    const handleDeleteAnnouncement = () => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            resetForm();
            console.log('Announcement Deleted');
            onClose(); // Close the modal after deletion
        }
    };

    const resetForm = () => {
        setAnnouncementName('');
        setAnnouncementType('one-time');
        setSendDate('');
        setRecipientType('mentees');
        setPhoto(null);
        setPhotoUrl('');
        setContent('');
    };

    if (!isOpen) return null; // If modal is not open, return nothing

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.title}>Create New Announcement</h2>
                <div className={styles.mainContent}>
                    <div className={styles.flexContainer}>
                        <div className={styles.leftSection}>
                            <label className={styles.label}>
                                Announcement Name:
                                <input
                                    type="text"
                                    value={announcementName}
                                    onChange={(e) => setAnnouncementName(e.target.value)}
                                    required
                                    className={styles.input}
                                />
                            </label>
                            <label className={styles.label}>
                                Announcement Type:
                                <div className={styles.announcementTypeContainer}>
                                    <div className={styles.announcementTypeBox}>
                                        <input
                                            type="radio"
                                            value="one-time"
                                            checked={announcementType === 'one-time'}
                                            onChange={() => setAnnouncementType('one-time')}
                                        /> One-Time
                                    </div>
                                    <div className={styles.announcementTypeBox}>
                                        <input
                                            type="radio"
                                            value="recurring"
                                            checked={announcementType === 'recurring'}
                                            onChange={() => setAnnouncementType('recurring')}
                                        /> Recurring
                                    </div>
                                    <div className={styles.announcementTypeBox}>
                                        <input
                                            type="radio"
                                            value="drip"
                                            checked={announcementType === 'drip'}
                                            onChange={() => setAnnouncementType('drip')}
                                        /> Drip
                                    </div>
                                </div>
                            </label>
                            <label className={styles.label}>
                                Schedule One-Time Announcement:
                                <input
                                    type="datetime-local"
                                    value={sendDate}
                                    onChange={(e) => setSendDate(e.target.value)}
                                    required
                                    className={styles.input}
                                />
                            </label>
                        </div>
                        <div className={styles.rightSection}>
                            <label className={styles.label}>
                                Send To:
                                <select
                                    value={recipientType}
                                    onChange={(e) => setRecipientType(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="mentees">Mentees</option>
                                    <option value="mentors">Mentors</option>
                                    <option value="all">All</option>
                                </select>
                                <span role="img" aria-label="icon" className={styles.icon}>👥</span>
                            </label>
                            <label className={styles.label}>
                                Select a Photo For Your Announcement:
                                <input
                                    type="file"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                    className={styles.fileInput}
                                />
                                <p>or provide an image by URL:</p>
                                <input
                                    type="text"
                                    value={photoUrl}
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                    className={styles.input}
                                />
                            </label>
                            <label className={styles.label}>
                                Content Of Your Announcement:
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    className={styles.textarea}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={styles.buttonContainer}>
                        {/* Create Announcement Button */}
                        <button
                            className={`${styles.iconButton} ${styles.createButton}`}
                            onClick={handleCreateAnnouncement}
                            title="Create Announcement"
                            aria-label="Create Announcement"
                        >
                            <BsPlusCircle size={24} />
                        </button>

                        {/* Delete Announcement Button */}
                        <button
                            className={`${styles.iconButton} ${styles.deleteButton}`}
                            onClick={handleDeleteAnnouncement}
                            title="Delete Announcement"
                            aria-label="Delete Announcement"
                        >
                            <BsTrash size={24} />
                        </button>

                        {/* Done Button */}
                        <button
                            className={`${styles.iconButton} ${styles.doneButton}`}
                            onClick={onClose}
                            title="Done"
                            aria-label="Done"
                        >
                            <BsCheckCircle size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewAnnouncement;

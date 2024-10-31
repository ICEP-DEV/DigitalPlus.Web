// CreateNewAnnouncement.js

import React, { useState, useEffect } from 'react';
import styles from './CreateNewAnnouncement.module.css';
import { BsPlusCircle, BsTrash, BsCheckCircle, BsXCircleFill } from 'react-icons/bs';

const CreateNewAnnouncement = ({
  isOpen,
  onClose,
  addAnnouncement,
  editingAnnouncement,
}) => {
  const [announcementName, setAnnouncementName] = useState('');
  const [announcementType, setAnnouncementType] = useState('one-time');
  const [sendDate, setSendDate] = useState('');
  const [recipientType, setRecipientType] = useState('mentees');
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingAnnouncement) {
      setAnnouncementName(editingAnnouncement.name);
      setAnnouncementType(editingAnnouncement.type.toLowerCase());
      setSendDate(editingAnnouncement.sendDate);
      setRecipientType(editingAnnouncement.recipient);
      setPhoto(null); // Assuming photo is not handled
      setPhotoUrl(editingAnnouncement.photoUrl || '');
      setContent(editingAnnouncement.content);
    } else {
      resetForm();
    }
  }, [editingAnnouncement]);

  const handleCreateAnnouncement = () => {
    if (window.confirm('Are you sure you want to save this announcement?')) {
      const newAnnouncement = {
        id: editingAnnouncement ? editingAnnouncement.id : null,
        name: announcementName,
        type: announcementType,
        sendDate,
        recipient: recipientType,
        content,
        photo,
        photoUrl,
      };
      console.log('Announcement Saved:', newAnnouncement);
      addAnnouncement(newAnnouncement); // Add or update the announcement
      resetForm();
      onClose(); // Close the modal after saving the announcement
    }
  };

  const handleDeleteAnnouncement = () => {
    if (window.confirm('Are you sure you want to clear this form?')) {
      resetForm();
      console.log('Form Cleared');
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
        {/* Close Icon */}
        <div
          className={styles.closeButton}
          onClick={onClose}
          title="Close"
          aria-label="Close"
        >
          <BsXCircleFill size={24} color="red" />
        </div>

        <h2 className={styles.title}>
          {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
        </h2>
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
                    />{' '}
                    One-Time
                  </div>
                  <div className={styles.announcementTypeBox}>
                    <input
                      type="radio"
                      value="recurring"
                      checked={announcementType === 'recurring'}
                      onChange={() => setAnnouncementType('recurring')}
                    />{' '}
                    Recurring
                  </div>
                  <div className={styles.announcementTypeBox}>
                    <input
                      type="radio"
                      value="drip"
                      checked={announcementType === 'drip'}
                      onChange={() => setAnnouncementType('drip')}
                    />{' '}
                    Drip
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
                <span role="img" aria-label="icon" className={styles.icon}>
                  👥
                </span>
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
            {/* Save Announcement Button */}
            <button
              className={`${styles.iconButton} ${styles.createButton}`}
              onClick={handleCreateAnnouncement}
              title="Save Announcement"
              aria-label="Save Announcement"
            >
              <BsPlusCircle size={24} />
            </button>

            {/* Clear Form Button */}
            <button
              className={`${styles.iconButton} ${styles.deleteButton}`}
              onClick={handleDeleteAnnouncement}
              title="Clear Form"
              aria-label="Clear Form"
            >
              <BsTrash size={24} />
            </button>

            {/* Cancel Button */}
            <button
              className={`${styles.iconButton} ${styles.doneButton}`}
              onClick={onClose}
              title="Cancel"
              aria-label="Cancel"
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

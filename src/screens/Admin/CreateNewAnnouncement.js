import React, { useState, useEffect } from 'react';
import styles from './CreateNewAnnouncement.module.css';
import { BsCheckCircle, BsXCircleFill } from 'react-icons/bs';

const CreateNewAnnouncement = ({
  isOpen,
  onClose,
  addAnnouncement,
  editingAnnouncement,
}) => {
  const [formData, setFormData] = useState({
    announcementTitle: '',
    userRole: 'Mentee',
    announcementDate: '',
    announcementContent: '',
    announcementImageFile: null,
    endDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editingAnnouncement) {
      setFormData({
        announcementTitle: editingAnnouncement.announcementTitle || '',
        userRole: editingAnnouncement.userRole || 'Mentee',
        announcementDate: editingAnnouncement.announcementDate || '',
        announcementContent: editingAnnouncement.announcementContent || '',
        announcementImageFile: null,
        endDate: editingAnnouncement.endDate || '',
      });
    } else {
      resetForm();
    }
  }, [editingAnnouncement]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        announcementImageFile: files[0],
        isImageUpload: !!files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'announcementImageFile' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const apiUrl = editingAnnouncement
        ? `https://localhost:7163/api/Announcement/${editingAnnouncement.announcementId}`
        : 'https://localhost:7163/api/Announcement';
      const method = editingAnnouncement ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(
          editingAnnouncement
            ? 'Failed to update announcement'
            : 'Failed to create announcement'
        );
      }

      setSuccess(true);
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      announcementTitle: '',
      userRole: 'Mentee',
      announcementDate: '',
      announcementContent: '',
      announcementImageFile: null,
      endDate: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
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

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Announcement Title:
            <input
              type="text"
              name="announcementTitle"
              value={formData.announcementTitle}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            User Role:
            <select
              name="userRole"
              value={formData.userRole}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="Mentee">Mentee</option>
              <option value="Mentor">Mentor</option>
              <option value="Both">Both</option>
            </select>
          </label>

          
              <label className={styles.label}>
                Announcement Date:
                <input
                  type="datetime-local"
                  name="announcementDate"
                  value={formData.announcementDate}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                End Date:
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </label>
           
          <label className={styles.label}>
            Content:
            <textarea
              name="announcementContent"
              value={formData.announcementContent}
              onChange={handleInputChange}
              rows="4"
              required
              className={styles.textarea}
            />
          </label>

          <label className={styles.label}>
            Image (optional):
            <input
              type="file"
              name="announcementImageFile"
              onChange={handleInputChange}
              accept="image/*"
              className={styles.fileInput}
            />
          </label>

          <div className={styles.buttonContainer}>
            <button type="submit" disabled={loading} className={styles.createButton}>
              {loading
                ? 'Submitting...'
                : editingAnnouncement
                ? 'Update Announcement'
                : 'Create Announcement'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>

          {success && (
            <p className={styles.successMessage}>
              {editingAnnouncement
                ? 'Announcement updated successfully!'
                : 'Announcement created successfully!'}
            </p>
          )}
          {error && <p className={styles.errorMessage}>Error: {error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateNewAnnouncement;

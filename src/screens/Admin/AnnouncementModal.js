// AnnouncementModal.js

import React from 'react';
import styles from './AnnouncementModal.module.css';
import { BsXCircleFill, BsPencilSquare, BsTrash } from 'react-icons/bs';

const AnnouncementModal = ({
  isOpen,
  onClose,
  announcements,
  editAnnouncement,
  deleteAnnouncement,
}) => {
  if (!isOpen) return null;

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

        <h2 className={styles.title}>Announcements</h2>
        <div className={styles.tableContainer}>
          <table className={styles.announcementTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Send Date</th>
                <th>Recipient</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement.id}>
                  <td>{announcement.name}</td>
                  <td>{announcement.type}</td>
                  <td>{announcement.sendDate}</td>
                  <td>{announcement.recipient}</td>
                  <td>{announcement.content}</td>
                  <td className={styles.actions}>
                    <BsPencilSquare
                      size={20}
                      color="blue"
                      className={styles.actionIcon}
                      onClick={() => editAnnouncement(announcement)}
                      title="Edit"
                    />
                    <BsTrash
                      size={20}
                      color="red"
                      className={styles.actionIcon}
                      onClick={() => deleteAnnouncement(announcement.id)}
                      title="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;

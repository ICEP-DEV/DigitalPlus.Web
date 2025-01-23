import React, { useEffect, useState } from "react";
import styles from "./AnnouncementModal.module.css";
import { BsXCircleFill, BsPencilSquare, BsTrash, BsEye } from "react-icons/bs";

const AnnouncementModal = ({
  isOpen,
  onClose,
  editAnnouncement,
  deleteAnnouncement,
}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedRole, setSelectedRole] = useState(2); // Default to 'Both'
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const API_BASE_URL = "https://localhost:7163/api/Announcement";

  useEffect(() => {
    if (isOpen) {
      fetchAnnouncementsByRole(selectedRole);
    }
  }, [isOpen, selectedRole]);

  const fetchAnnouncementsByRole = async (role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${role}`);
      if (!response.ok) throw new Error("Failed to fetch announcements.");
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete announcement.");
      const updatedAnnouncements = announcements.filter(
        (announcement) => announcement.announcementId !== id
      );
      setAnnouncements(updatedAnnouncements);
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(parseInt(event.target.value, 10));
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleEditClick = (announcement) => {
    editAnnouncement(announcement);
    onClose();
  };

  const handleViewClick = (announcement) => {
    setSelectedAnnouncement(announcement); // Open the details modal
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

        <h2 className={styles.title}>Announcements</h2>

        <div className={styles.dropdownContainer}>
          <label htmlFor="userRoleDropdown">Select User Role: </label>
          <select
            id="userRoleDropdown"
            value={selectedRole}
            onChange={handleRoleChange}
            className={styles.dropdown}
          >
            <option value={0}>Mentees</option>
            <option value={1}>Mentors</option>
            <option value={2}>Both (Mentors and Mentees)</option>
          </select>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.announcementTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>User Role</th>
                <th>Date</th>
                <th>Content</th>
                <th>Image</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement.announcementId}>
                  <td>{announcement.announcementTitle}</td>
                  <td>
                    {announcement.userRole === 0
                      ? "Mentee"
                      : announcement.userRole === 1
                      ? "Mentor"
                      : "Both"}
                  </td>
                  <td>
                    {new Date(announcement.announcementDate).toLocaleDateString()}
                  </td>
                  <td>{announcement.announcementContent.slice(0, 50)}...</td>
                  <td>
                    <img
                      src={
                        announcement.announcementImage &&
                        announcement.announcementImage.trim() !== ""
                          ? announcement.announcementImage
                          : "https://via.placeholder.com/150"
                      }
                      alt="Announcement"
                      className={styles.imageThumbnail}
                      onClick={() =>
                        handleImageClick(
                          announcement.announcementImage &&
                          announcement.announcementImage.trim() !== ""
                            ? announcement.announcementImage
                            : "https://via.placeholder.com/150"
                        )
                      }
                    />
                  </td>
                  <td>
                    {announcement.endDate
                      ? new Date(announcement.endDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className={styles.actions}>
                    <BsEye
                      size={20}
                      color="green"
                      className={styles.actionIcon}
                      onClick={() => handleViewClick(announcement)}
                      title="View Details"
                    />
                    <BsPencilSquare
                      size={20}
                      color="blue"
                      className={styles.actionIcon}
                      onClick={() => handleEditClick(announcement)}
                      title="Edit"
                    />
                    <BsTrash
                      size={20}
                      color="red"
                      className={styles.actionIcon}
                      onClick={() =>
                        handleDeleteAnnouncement(announcement.announcementId)
                      }
                      title="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedImage && (
          <div className={styles.imageModalOverlay}>
            <div className={styles.imageModal}>
              <img src={selectedImage} alt="Full Announcement" />
              <button
                onClick={closeImageModal}
                className={styles.closeImageModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {selectedAnnouncement && (
          <div className={styles.announcementDetailsModal}>
            <h3>Announcement Details</h3>
            <p>
              <strong>Title:</strong> {selectedAnnouncement.announcementTitle}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {selectedAnnouncement.userRole === 0
                ? "Mentee"
                : selectedAnnouncement.userRole === 1
                ? "Mentor"
                : "Both"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedAnnouncement.announcementDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Content:</strong> {selectedAnnouncement.announcementContent}
            </p>
            {selectedAnnouncement.announcementImage && (
              <img
                src={selectedAnnouncement.announcementImage}
                alt="Announcement"
                className={styles.imageThumbnail}
              />
            )}
            <p>
              <strong>End Date:</strong>{" "}
              {selectedAnnouncement.endDate
                ? new Date(selectedAnnouncement.endDate).toLocaleDateString()
                : "N/A"}
            </p>
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className={styles.closeAnnouncementDetails}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementModal;

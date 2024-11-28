import React, { useEffect, useState } from "react";
import styles from "./AnnouncementModal.module.css";
import { BsXCircleFill, BsPencilSquare, BsTrash } from "react-icons/bs";

const AnnouncementModal = ({
  isOpen,
  onClose,
  editAnnouncement, // Function to handle editing
  deleteAnnouncement,
}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedRole, setSelectedRole] = useState(2); // Default to 'Both'
  const [selectedImage, setSelectedImage] = useState(null); // For displaying the image
  const API_BASE_URL = "https://localhost:7163/api/Announcement";

  // Fetch announcements when modal is open or role changes
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
    setSelectedRole(parseInt(event.target.value, 10)); // Update role based on dropdown selection
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the clicked image for display
  };

  const closeImageModal = () => {
    setSelectedImage(null); // Close the image modal
  };

  const handleEditClick = (announcement) => {
    editAnnouncement(announcement); // Pass selected announcement for editing
    onClose(); // Close this modal and open the editing modal
  };

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

        {/* User Role Dropdown */}
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

        {/* Announcements Table */}
        <div className={styles.tableContainer}>
          <table className={styles.announcementTable}>
            <thead>
              <tr>
                <th>Announcement ID</th>
                <th>Title</th>
                <th>User Role</th>
                <th>Type</th>
                <th>Date</th>
                <th>Content</th>
                <th>Image</th>
                <th>Frequency</th>
                <th>Total Occurrences</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement.announcementId}>
                  <td>{announcement.announcementId}</td>
                  <td>{announcement.announcementTitle}</td>
                  <td>
                    {announcement.userRole === 0
                      ? "Mentee"
                      : announcement.userRole === 1
                      ? "Mentor"
                      : "Both"}
                  </td>
                  <td>{announcement.type}</td>
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
                          : "https://via.placeholder.com/150" // Fallback image URL
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
                  <td>{announcement.frequency}</td>
                  <td>{announcement.totalOccurrences}</td>
                  <td>
                    {announcement.endDate
                      ? new Date(announcement.endDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className={styles.actions}>
                    <BsPencilSquare
                      size={20}
                      color="blue"
                      className={styles.actionIcon}
                      onClick={() => handleEditClick(announcement)} // Trigger edit
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

        {/* Image Modal */}
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
      </div>
    </div>
  );
};

export default AnnouncementModal;

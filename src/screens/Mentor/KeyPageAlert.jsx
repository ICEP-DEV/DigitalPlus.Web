import React, { useState, useEffect } from "react";
import styles from "./KeyPageAlert.module.css";
import { FaKey, FaWindowClose } from "react-icons/fa";
import axios from "axios";

function KeyPageAlert({ showModal, onClose }) {
  const [viewState, setViewState] = useState("initial");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyNotifications, setKeyNotifications] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFirstName(storedUser.firstName || "");
      setLastName(storedUser.lastName || "");
      setContact(storedUser.contactNo || "");
    }

    if (showModal) {
      fetchNotifications();
    }
  }, [showModal]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7163/api/MentorKey/all");
      console.log("Full API Response:", JSON.stringify(response.data, null, 2));

      if (response.data?.keys && Array.isArray(response.data.keys)) {
        const formattedNotifications = response.data.keys.map((item) => ({
          date: formatDate(item.date),
          name:
            item.firstName && item.lastName
              ? `${item.firstName} ${item.lastName}`
              : "Unknown Name",
          contact: item.contact.trim() || "Contact Not Available",
          location: item.location || "lab 10 G42",
        }));

        console.log("Formatted Notifications:", JSON.stringify(formattedNotifications, null, 2));
        setKeyNotifications(formattedNotifications);
      } else {
        console.error("Unexpected response format:", response.data);
        setKeyNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error.response || error);
      setKeyNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const localDate = new Date(dateString || Date.now());
    const adjustedDate = new Date(localDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(adjustedDate);
  };

  const handleSendClick = async () => {
    if (!firstName.trim() || !lastName.trim() || !contact.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const mentorId = storedUser?.mentorId;

    if (!mentorId) {
      alert("Mentor ID is missing. Please ensure you are logged in.");
      return;
    }

    const newNotification = {
      mentorId,
      date: new Date().toISOString(),
      firstName,
      lastName,
      contact: contact, // Sending contact number
      location: "lab 10 G42", // Default location
    };

    console.log("Payload being sent:", newNotification); // Log the payload

    try {
      const response = await axios.post(
        "https://localhost:7163/api/MentorKey",
        newNotification
      );
      console.log("Notification sent successfully:", response.data);

      setKeyNotifications((prev) => [
        {
          date: formatDate(newNotification.date),
          name: `${newNotification.firstName} ${newNotification.lastName}`,
          contact: newNotification.contact,
          location: newNotification.location,
        },
        ...prev,
      ]);

      setViewState("info");
      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error.response || error);
      alert(error.response?.data?.message || "Failed to send notification");
    }
  };

  const handleReportClick = () => setViewState("form");
  const handleViewInfoClick = () => setViewState("info");
  const handleCancelClick = () => setViewState("initial");
  const handleBackClick = () => setViewState("initial");
  const handleClose = () => onClose && onClose();

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <span className={styles.closeButton} onClick={handleClose}>
            <FaWindowClose />
          </span>
          <div className={styles.iconContainer}>
            <FaKey className={styles.modalKeyIcon} />
          </div>
          <p className={styles.infoText}>Information About the Key</p>

          {viewState === "info" && (
            <div className={styles.notificationsContainer}>
              <h3>KEY NOTIFICATION(S)</h3>
              {loading ? (
                <p>Loading notifications...</p>
              ) : keyNotifications.length === 0 ? (
                <p>No notifications available at the moment.</p>
              ) : (
                <ul className={styles.notificationsList}>
                  {keyNotifications.map((notification, index) => (
                    <li key={index} className={styles.notificationItem}>
                      <div>{notification.date}</div>
                      <div>
                        <strong>{notification.name}</strong> (
                        {notification.contact}) has the key to{" "}
                        {notification.location}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button className={styles.backButton} onClick={handleBackClick}>
                BACK
              </button>
            </div>
          )}

          {viewState === "form" && (
            <div className={styles.formContainer}>
              <h2>NOTIFY OTHER MENTORS</h2>
              <label>
                FIRSTNAME:
                <input type="text" value={firstName} readOnly />
              </label>
              <label>
                LASTNAME:
                <input type="text" value={lastName} readOnly />
              </label>
              <label>
                CONTACT:
                <input type="text" value={contact} readOnly />
              </label>
              <button className={styles.sendButton} onClick={handleSendClick}>
                SEND
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCancelClick}
              >
                CANCEL
              </button>
            </div>
          )}

          {viewState === "initial" && (
            <div className={styles.buttonContainer}>
              <button
                className={styles.reportButton}
                onClick={handleReportClick}
              >
                REPORT
              </button>
              <button
                className={styles.viewButton}
                onClick={handleViewInfoClick}
              >
                VIEW THE INFO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KeyPageAlert;

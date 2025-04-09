import React, { useState, useEffect } from "react";
import { FaKey } from "react-icons/fa"; // Import the key icon
import styles from "./AnnouncementPage.module.css"; 
import SideBar from "./Navigation/SideBar";
import NavBar from "./Navigation/NavBar";
import KeyPageAlert from "./KeyPageAlert";

function AnnouncementPage() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Prevent scrolling when the modal is open
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto'; // Adjust based on modal state

    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    fetchAnnouncements();

    return () => {
      document.body.style.overflow = "auto";
      clearInterval(intervalId);
    };
  }, [isModalOpen]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`https://localhost:7163/api/Announcement/mentor`);
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort(
          (a, b) => new Date(b.announcementDate) - new Date(a.announcementDate)
        );
        setAnnouncements(sortedData);
      } else {
        console.error("Failed to fetch announcements:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleKeyIconClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <NavBar onKeyIconClick={handleKeyIconClick} showKeyIcon={true} />
      <SideBar />
      <div className={styles.content}>
        <h1>Mentor Announcements</h1>
        <div className={styles.timelineWrapper}>
          <div className={styles.timeline}>
            {announcements.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.lineAndCircle}>
                  <div className={styles.circle}></div>
                  <div className={styles.verticalLine}></div>
                </div>
                <div className={styles.card}>
                  <div className={styles.detailRow}>
                    <strong>Title:</strong> {item.announcementTitle}
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Announcement Date:</strong> {item.announcementDate}
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Content:</strong> {item.announcementContent}
                  </div>
                  <div className={styles.detailRow}>
                    <strong>End Date:</strong> {item.endDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.currentDateTime}>
            <div className={styles.time}>
              {currentDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </div>
            <div className={styles.date}>
              {currentDateTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <KeyPageAlert showModal={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default AnnouncementPage;

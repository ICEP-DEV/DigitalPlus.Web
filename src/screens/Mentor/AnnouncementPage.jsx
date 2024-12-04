import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaDownload } from 'react-icons/fa';
import styles from './AnnouncementPage.module.css'; // Importing the CSS module
import SideBar from './Navigation/SideBar';
import NavBar from './Navigation/NavBar';

function AnnouncementPage() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [announcements, setAnnouncements] = useState([]);
    const userRole = 'mentor'; // Define the user role for mentors

    useEffect(() => {
        // Set the body overflow to hidden
        document.body.style.overflow = 'hidden';

        // Update the current time every second
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Fetch announcements when the component mounts
        fetchAnnouncements();

        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
            clearInterval(intervalId);
        };
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`https://localhost:7163/api/Announcement/${userRole}`);
            if (response.ok) {
                const data = await response.json();

                // Sort announcements by date in descending order
                const sortedData = data.sort(
                    (a, b) => new Date(b.announcementDate) - new Date(a.announcementDate)
                );

                setAnnouncements(sortedData);
            } else {
                console.error('Failed to fetch announcements:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const handleDownloadImage = async (announcementId) => {
        try {
            const response = await fetch(`https://localhost:7163/api/Announcement/DownloadImage/${announcementId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = `announcement-image-${announcementId}.jpg`; // Change extension if necessary
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to download image:', response.statusText);
            }
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    return (
        <div className={styles.container}>
            <NavBar />
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
                                        <strong>Image:</strong>{' '}
                                        {item.isImageUpload ? (
                                            <div className={styles.imageWrapper}>
                                                <FaDownload
                                                    className={styles.downloadIcon}
                                                    title="Download Image"
                                                    onClick={() => handleDownloadImage(item.id)}
                                                />
                                            </div>
                                        ) : (
                                            'No Image Uploaded'
                                        )}
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
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                            })}
                        </div>
                        <div className={styles.date}>{currentDateTime.toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnnouncementPage;

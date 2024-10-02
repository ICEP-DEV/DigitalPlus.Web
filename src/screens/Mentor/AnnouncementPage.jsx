import React, { useState, useEffect } from 'react';
import HeaderAnnouncementPage from '../Mentor/Headers/HeaderAnnouncementPage';
import Sidebar from './Bars/Sidebar';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './AnnouncementPage.module.css'; // Importing the CSS module
import SideBar from './Navigation/SideBar';

const announcements = [
    { date: '12/07/2024', message: 'New mentorship program starts!' },
    { date: '24/07/2024', message: 'Guest speaker this Friday.' },
    { date: '30/07/2024', message: 'Feedback session scheduled.' },
    { date: '03/08/2024', message: 'Workshop on effective communication.' },
    { date: '19/08/2024', message: 'Networking event next month.' },
    { date: '22/08/2024', message: 'Monthly check-in scheduled.' },
];

function AnnouncementPage() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => {
            document.body.style.overflow = 'auto';
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className={styles.container}>
            <HeaderAnnouncementPage />
            <SideBar/>
            <div className={styles.content}>
                <h1 className={styles.header}>ANNOUNCEMENTS</h1>
                <div className={styles.timelineWrapper}>
                    <div className={styles.timeline}>
                        {announcements.map((item, index) => (
                            <div key={index} className={styles.timelineItem}>
                                <div className={styles.lineAndCircle}>
                                    <div className={styles.circle}></div>
                                    <div className={styles.verticalLine}></div>
                                </div>
                                <div className={styles.card}>
                                    <div className={styles.date}>{item.date}</div>
                                    <div className={styles.message}>
                                        <FaInfoCircle className={styles.icon} />
                                        {item.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.rightVerticalLine}></div>
                    <div className={styles.currentDateTime}>
                        <div className={styles.time}>
                            {currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                        </div>
                        <div className={styles.date}>{currentDateTime.toLocaleDateString()}</div>
                    </div>
                </div>
                <a href="/roster" className={styles.viewRosterLink}>VIEW ROSTER</a>
                <div className={styles.sidebarContainer}>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}

export default AnnouncementPage;

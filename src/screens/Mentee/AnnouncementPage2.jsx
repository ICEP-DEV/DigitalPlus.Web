import React, { useState, useEffect } from 'react';
import HeaderAnnouncementPage from '../Mentor/Headers/HeaderAnnouncementPage';
import Sidebar from './Bars/Sidebar';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './AnnouncementPage2.module.css'; // Importing the CSS module
import SideBar from './Navigation/SideBar';
import NavBar from './Navigation/NavBar';

const announcements = [
    { date: '12/07/2024', message: 'New mentorship program starts!' },
    { date: '14/09/2024', message: 'Show And Tell on Tuesday, 17/09/2024.' },
    { date: '01/10/2024', message: 'iFOW Event at Ditsela Place, Hatfield on the 02/10/2024.' },
    { date: '02/10/2024', message: 'Show And Tell On Friday, 04/10/2024' },
    { date: '03/10/2024', message: 'TVH on the 18th - 20th October 2024.' },
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
            {/* <HeaderAnnouncementPage /> */}
            <NavBar/>
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
                <a href="/roster2" className={styles.viewRosterLink}>VIEW ROSTER</a>
                <div className={styles.sidebarContainer}>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}

export default AnnouncementPage;

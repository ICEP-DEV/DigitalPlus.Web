// Announcement.jsx
import React from 'react';

function Announcement({ date, message }) {
    return (
        <div style={styles.announcement}>
            <div style={styles.date}>{date}</div>
            <div style={styles.message}>{message}</div>
        </div>
    );
}

const styles = {
    announcement: {
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#f9f9f9',
    },
    date: {
        fontSize: '0.9rem',
        color: '#555',
        marginBottom: '8px',
    },
    message: {
        fontSize: '1rem',
        color: '#333',
    },
};

export default Announcement;

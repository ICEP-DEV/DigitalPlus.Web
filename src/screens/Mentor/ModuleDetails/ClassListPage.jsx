import React from 'react';
import styles from './ClassListPage.module.css'; // Import the CSS module

const students = [
    { studentNumber: '22145553', name: 'Sifiso Vinjwa', course: 'Computer Science' },
    { studentNumber: '222870097', name: 'Karabo Magagane', course: 'Informatics' },
    { studentNumber: '22456793', name: 'Excellent Nambane', course: 'Information Technology' },
    { studentNumber: '221418812', name: 'Bathabile Mohabela', course: 'Multimedia Computing' },
];

const ClassListPage = () => {
    const handleMessageClick = (studentName) => {
        alert(`Message sent to ${studentName}`);
        // Logic for messaging
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>STUDENT NUMBER</th>
                            <th>MENTEE NAME & SURNAME</th>
                            <th>COURSE</th>
                            <th>DM STUDENT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.studentNumber}</td>
                                <td>{student.name}</td>
                                <td>{student.course}</td>
                                <td>
                                    <button
                                        className={styles.messageBtn}
                                        onClick={() => handleMessageClick(student.name)}
                                    >
                                        MESSAGE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassListPage;

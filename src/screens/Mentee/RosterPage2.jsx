import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
// import HeaderAnnouncementPage from '../Mentor/Headers/HeaderAnnouncementPage';
// import SideBar from './Navigation/SideBar';
import { Nav } from 'react-bootstrap';
import SideBarNavBar from './Navigation/SideBarNavBar';

const rosterData = [
    {
        time: '09:00 - 10:00',
        Monday: 'T Dladla\nPPA 316D/ ISY 30BT',
        Tuesday: 'Bongiwe\nPPB 316D',
        Wednesday: 'Bongiwe\nPPB 316D',
        Thursday: 'Bongiwe\nPPB 316D',
        Friday: 'T Dladla\nPPA 316D/ ISY 30BT',
    },
    {
        time: '10:00 - 11:00',
        Monday: 'TR Mmethi\nOOP 316D / TPG 111',
        Tuesday: 'T Dladla\nPPA 316D / ISY 30BT',
        Wednesday: 'TR Mmethi\nOOP 316D / TPG 111',
        Thursday: 'T Dladla\nPPA 316D / ISY 30BT',
        Friday: 'TR Mmethi\nOOP 316D / TPG 111',
    },
    {
        time: '11:00 - 12:00',
        Monday: 'TR Mmethi\nOOP 316D/ TPG 111',
        Tuesday: '',
        Wednesday: 'T Dladla\nPPA 316D/ ISY 30BT',
        Thursday: '',
        Friday: 'TR Mmethi\nOOP 316D/ TPG 111',
    },
    {
        time: '12:00 - 13:00',
        Monday: 'Bongiwe\nPPB 316D',
        Tuesday: 'Bongiwe\nPPB 316D',
        Wednesday: 'Bongiwe\nPPB 316D',
        Thursday: 'Bongiwe\nPPB 316D',
        Friday: 'Bongiwe\nPPB 316D',
    },
    {
        time: '13:00 - 14:00',
        Monday: 'TR Mmethi\nOOP 316D/ TPG 111',
        Tuesday: '',
        Wednesday: '',
        Thursday: 'TR Mmethi\nOOP 316D/ TPG 111',
        Friday: '',
    },
    {
        time: '14:00 - 15:00',
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
    },
    {
        time: '15:00 - 16:00',
        Monday: 'T Dladla\nPPA 316D/ ISY 30BT',
        Tuesday: '',
        Wednesday: '',
        Thursday: 'TR Mmethi\nOOP 316D/ TPG 111',
        Friday: 'Bongiwe\nPPB 316D',
    },
];

function RosterPage() {
    const navigate = useNavigate(); // Initialize navigate function

    return (
        <SideBarNavBar>
        <div style={styles.container}>
            <div style={styles.content}>
                <Nav.Link href ='/AnnouncementPage2'><button style={styles.backButton} onClick={() => navigate('/home')}>Back</button></Nav.Link>
                <h1 style={styles.header}>Mentor's Lab 10-252</h1>
                <div style={styles.rosterTable}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Time</th>
                                <th style={styles.tableHeader}>Monday</th>
                                <th style={styles.tableHeader}>Tuesday</th>
                                <th style={styles.tableHeader}>Wednesday</th>
                                <th style={styles.tableHeader}>Thursday</th>
                                <th style={styles.tableHeader}>Friday</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rosterData.map((row, index) => (
                                <tr key={index} style={styles.tableRow}>
                                    <td style={styles.tableCell}>{row.time}</td>
                                    <td style={styles.tableCell}>{row.Monday}</td>
                                    <td style={styles.tableCell}>{row.Tuesday}</td>
                                    <td style={styles.tableCell}>{row.Wednesday}</td>
                                    <td style={styles.tableCell}>{row.Thursday}</td>
                                    <td style={styles.tableCell}>{row.Friday}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={styles.sidebarContainer}>
                    
                </div>
            </div>
        </div>
        </SideBarNavBar>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        height: '100vh',
        backgroundColor: '#D9D9D9',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        overflow: 'hidden',
        marginLeft: '200px',
        padding: '20px',
    },
    header: {
        fontSize: '24px',
        textAlign: 'center',
        marginBottom: '20px',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: '100px',
        right: '20px',
        display: 'flex',
        justifyContent: 'flex-end',
        width: 'calc(100% - 250px)', // Adjust for the sidebar width
        padding: '0 20px',
    },
    backButton: {
        position: 'absolute',
        backgroundColor: '#000C24',
        display:'flex',
        color: '#fff',
        border: 'none',
        padding: '10px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
        bottom:'100px',
        right:'20px',
        fontSize: '20px',
        width: 'fit-content',
        
        
    },
  
    rosterTable: {
        display: 'flex',
        justifyContent: 'center',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    tableHeader: {
        borderBottom: '2px solid #000',
        padding: '10px',
        textAlign: 'left',
        backgroundColor: '#000C24',
        color: '#fff',
    },
    tableRow: {
        borderBottom: '1px solid #ccc',
    },
    tableCell: {
        padding: '10px',
        textAlign: 'left',
        whiteSpace: 'pre-line',
        border: '1px solid #ccc',
    },
    sidebarContainer: {
        zIndex: '1',
    },
};

export default RosterPage;

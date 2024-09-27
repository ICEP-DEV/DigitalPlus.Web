import React, { useState } from 'react';
import styles from './ComplainsContent.module.css';

const ComplainsContent = () => {
  const [complains, setComplains] = useState([
    {
      menteeName: 'Lungile Maphosa',
      menteeEmail: '218496865@tut4life.ac.za',
      mentorName: 'Sizwe Mkhwanazi',
      mentorEmail: '219543210@tut4life.ac.za',
      module: 'Software Engineering',
      complain: 'The mentor doesn’t respond to the bookings',
      dateLogged: '2024-09-10 14:30',
      status: 'Unresolved',
    },
    {
      menteeName: 'Thabiso Molefe',
      menteeEmail: '218455865@tut4life.ac.za',
      mentorName: 'Nokubonga Ntuli',
      mentorEmail: '219678912@tut4life.ac.za',
      module: 'Database Systems',
      complain: 'The mentor always cancels the appointments',
      dateLogged: '2024-09-12 10:45',
      status: 'Unresolved',
    },
    {
      menteeName: 'Noluthando Dlamini',
      menteeEmail: '217945321@tut4life.ac.za',
      mentorName: 'Bongani Khumalo',
      mentorEmail: '219876543@tut4life.ac.za',
      module: 'Web Development',
      complain: 'The mentor reschedules too often',
      dateLogged: '2024-09-13 09:15',
      status: 'Resolved',
    },
    {
      menteeName: 'Ayanda Mbatha',
      menteeEmail: '218123456@tut4life.ac.za',
      mentorName: 'Thando Ncube',
      mentorEmail: '218765432@tut4life.ac.za',
      module: 'Data Structures',
      complain: 'The mentor doesn’t assist with practicals',
      dateLogged: '2024-09-15 13:45',
      status: 'Unresolved',
    },
    {
      menteeName: 'Zinhle Mkhize',
      menteeEmail: '219654321@tut4life.ac.za',
      mentorName: 'Kagiso Mohale',
      mentorEmail: '217876543@tut4life.ac.za',
      module: 'Database Systems',
      complain: 'The mentor is always late for the sessions',
      dateLogged: '2024-09-17 11:20',
      status: 'Unresolved',
    },
    {
      menteeName: 'Mandla Zondo',
      menteeEmail: '218098765@tut4life.ac.za',
      mentorName: 'Lerato Thobela',
      mentorEmail: '219234567@tut4life.ac.za',
      module: 'Networking',
      complain: 'The mentor provides unclear explanations',
      dateLogged: '2024-09-19 15:30',
      status: 'Resolved',
    },
    {
      menteeName: 'Sipho Mthethwa',
      menteeEmail: '218876543@tut4life.ac.za',
      mentorName: 'Thabiso Ndlovu',
      mentorEmail: '218543210@tut4life.ac.za',
      module: 'Cybersecurity',
      complain: 'The mentor doesn’t attend sessions',
      dateLogged: '2024-09-20 08:45',
      status: 'Unresolved',
    },
    {
      menteeName: 'Gugu Sithole',
      menteeEmail: '219765432@tut4life.ac.za',
      mentorName: 'Sindi Dlamini',
      mentorEmail: '217654321@tut4life.ac.za',
      module: 'Artificial Intelligence',
      complain: 'The mentor is not available for assistance',
      dateLogged: '2024-09-21 14:30',
      status: 'Resolved',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (index) => {
    const updatedComplains = [...complains];
    updatedComplains[index].status = updatedComplains[index].status === 'Resolved' ? 'Unresolved' : 'Resolved';
    setComplains(updatedComplains);
  };

  const filteredComplains = complains.filter(
    (complain) =>
      complain.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complain.menteeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Mentees’ Complaints</h2>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search by Mentor or Mentee"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date Logged</th>
            <th>Mentee (Name & Surname)</th>
            <th>Mentee Email</th>
            <th>Mentor (Name & Surname)</th>
            <th>Mentor Email</th>
            <th>Module</th>
            <th>Complaint</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplains.length > 0 ? (
            filteredComplains.map((complain, index) => (
              <tr key={index}>
                <td>{complain.dateLogged}</td>
                <td className={styles.menteeName}>{complain.menteeName}</td>
                <td className={styles.menteeEmail}>{complain.menteeEmail}</td>
                <td className={styles.mentorName}>{complain.mentorName}</td>
                <td className={styles.mentorEmail}>{complain.mentorEmail}</td>
                <td>{complain.module}</td>
                <td>{complain.complain}</td>
                <td className={complain.status === 'Resolved' ? styles.statusResolved : styles.statusUnresolved}>
                  {complain.status}
                </td>
                <td>
                  <button
                    className={`${styles.actionButton} ${complain.status === 'Resolved' ? styles.resolved : styles.unresolved}`}
                    onClick={() => handleStatusChange(index)}
                  >
                    {complain.status === 'Resolved' ? 'Mark as Unresolved' : 'Mark as Resolved'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No complaints found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplainsContent;

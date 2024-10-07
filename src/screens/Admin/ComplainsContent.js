import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ComplainsContent.module.css';

const ComplainsContent = () => {
  const [complains, setComplains] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all complaints from the API
  useEffect(() => {
    axios
      .get('https://localhost:7163/api/DigitalPlusCrud/GetAllComplaints')
      .then((response) => {
        // Accessing the result field from the response
        if (response.data.success && Array.isArray(response.data.result)) {
          setComplains(response.data.result);
        } else {
          console.error('Error: Invalid response format', response.data);
          setComplains([]); // Fallback to empty array if unexpected structure
        }
      })
      .catch((error) => {
        console.error('Error fetching complaints: ', error);
        
        setComplains([]); // Handle error by setting to empty array
      });
  }, []);

  // Handle status change and update the complaint status using the API
  const handleStatusChange = (index) => {
    const updatedComplains = [...complains];
    const complaint = updatedComplains[index];
    const newStatus = complaint.status === 'Resolved' ? 'Unresolved' : 'Resolved';
    
    axios
      .put(`https://localhost:7163/api/DigitalPlusCrud/UpdateComplaint/${complaint.ComplaintId}`, { status: newStatus })
      .then(() => {
        updatedComplains[index].status = newStatus;
        setComplains(updatedComplains);
      })
      .catch((error) => {
        console.error('Error updating complaint status:', error);
      });
  };

  // Filter complaints by mentor or mentee name
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
              <tr key={complain.complaintId}>
                <td>{new Date(complain.dateLogged).toLocaleString()}</td>
                <td className={styles.menteeName}>{complain.menteeName}</td>
                <td className={styles.menteeEmail}>{complain.menteeEmail}</td>
                <td className={styles.mentorName}>{complain.mentorName}</td>
                <td className={styles.mentorEmail}>{complain.mentorEmail}</td>
                <td>{complain.moduleId}</td>
                <td>{complain.complaintDescription}</td>
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

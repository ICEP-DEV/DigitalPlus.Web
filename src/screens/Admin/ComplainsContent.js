import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done'; // Icon for Resolved
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // Icon for Unresolved
import styles from './ComplainsContent.module.css'; // Import the CSS module
import { GrCompliance } from "react-icons/gr";



const ComplainsContent = () => {
  const [complaints, setComplaints] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllComplaints');
        if (response.data && Array.isArray(response.data.result)) {
          setComplaints(response.data.result);
        } else {
          setComplaints([]);
        }
      } catch (error) {
        setComplaints([]);
      }
    };

    fetchComplaints();
  }, []);

  const handleClickOpen = (complaint) => {
    setSelectedComplaint(complaint);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedComplaint(null);
  };

  const handleStatusChange = async () => {
    const complaint = selectedComplaint;
    if (!complaint || !complaint.complaintId) return;

    const newAction = complaint.action === 1 ? 0 : 1;
    const newStatus = newAction === 1 ? 'resolved' : 'unresolved';

    const payload = {
      ...complaint,
      status: newStatus,
      action: newAction
    };

    try {
      await axios.put(
        `https://localhost:7163/api/DigitalPlusCrud/UpdateComplaint/${complaint.complaintId}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setComplaints((prevComplaints) =>
        prevComplaints.map((comp) =>
          comp.complaintId === complaint.complaintId ? { ...comp, action: newAction } : comp
        )
      );
      handleClose();
    } catch (error) {
      console.error('Error updating complaint status:', error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1> <GrCompliance /> Complaints</h1>
      <table className={styles.complainTable}>
        <thead>
          <tr>
            <th>Date Logged</th>
            <th>Mentee Email</th>
            <th>Mentor Email</th>
            <th>Module</th>
            <th>Complaint</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <tr key={complaint.complaintId}>
                <td>{complaint.dateLogged}</td>
                <td>{complaint.menteeEmail}</td>
                <td>{complaint.mentorEmail}</td>
                <td>{complaint.moduleName}</td>
                <td>{complaint.complaintDescription}</td>
                {/* Status now showing in words */}
                <td style={{ color: complaint.action === 1 ? 'green' : 'red' }}>
                  {complaint.action === 1 ? 'Resolved' : 'Unresolved'}
                </td>
                <td>
                  <button
                    onClick={() => handleClickOpen(complaint)}
                    className={styles.iconButton}
                  >
                    {complaint.action === 0 ? (
                      <DoneIcon style={{ color: 'green' }} /> // Icon for marking resolved
                    ) : (
                      <ReportProblemIcon style={{ color: 'red' }} /> // Icon for marking unresolved
                    )}
                    <span className={styles.tooltipText}>
                      {complaint.action === 0 ? 'Mark as Resolved' : 'Mark as Unresolved'}
                    </span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No complaints found</td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#f0f4f7', // Soft background color
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Confirm Status Change
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: '#333', fontSize: '16px', fontWeight: '500' }}>
            Are you sure you want to change the status of this complaint to
            <strong>{selectedComplaint?.action === 1 ? ' Unresolved' : ' Resolved'}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ padding: '16px' }}>
          <Button
            onClick={handleClose}
            sx={{
              color: '#fff',
              backgroundColor: '#6c757d',
              '&:hover': {
                backgroundColor: '#5a6268',
              },
            }}
          >
            No
          </Button>

          <Button
            onClick={handleStatusChange}
            sx={{
              color: '#fff',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default ComplainsContent;

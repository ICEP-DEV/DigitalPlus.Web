import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, MenuItem, Select, InputLabel } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import styles from './ComplainsContent.module.css';
import { GrCompliance } from "react-icons/gr";
import EmailIcon from '@mui/icons-material/Email';

const ComplainsContent = () => {
  // State variables
  const [complaints, setComplaints] = useState([]);
  const [open, setOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [recipientType, setRecipientType] = useState('mentee'); // New state for recipient type

  // Fetch complaints from API
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
        console.error('Error fetching complaints:', error);
        setComplaints([]);
      }
    };

    fetchComplaints();
  }, []);

  // Handle opening the status change dialog
  const handleClickOpen = (complaint) => {
    setSelectedComplaint(complaint);
    setOpen(true);
  };

  // Handle closing the status change dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedComplaint(null);
  };

  // Handle opening the email dialog
  const handleEmailClickOpen = (complaint) => {
    setSelectedComplaint(complaint);
    setEmailSubject('');
    setEmailMessage('');
    setRecipientType('mentee'); // Reset recipient type
    setEmailDialogOpen(true);
  };

  // Handle closing the email dialog
  const handleEmailClose = () => {
    setEmailDialogOpen(false);
    setSelectedComplaint(null);
  };

  // Handle status change
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

  const handleSendEmail = async () => {
    if (!selectedComplaint) return;
  
    try {
      // Get the admin email from localStorage
      const adminEmail = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).emailAddress
        : 'admin@example.com'; // Fallback in case email is not found
  
      // Helper function to create the HTML email body
      const createHtmlMessage = (recipientEmail) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Hi <strong>${recipientEmail}</strong>,</p>
          <p>${emailMessage}</p>
          <p>Best Regards,</p>
          <p><strong>${adminEmail}</strong></p>
          <p style="margin-top: 20px; font-size: 0.9em; color: #555;">
            For more queries, please contact <a href="mailto:${adminEmail}" style="color: #007BFF;">${adminEmail}</a>.
          </p>
        </div>
      `;
  
      // Send email to the mentee
      if (recipientType === 'mentee' || recipientType === 'both') {
        await axios.post(
          'https://localhost:7163/api/Email/Send',
          {
            email: selectedComplaint.menteeEmail,
            subject: emailSubject,
            message: createHtmlMessage(selectedComplaint.menteeEmail),
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Send email to the mentor
      if (recipientType === 'mentor' || recipientType === 'both') {
        await axios.post(
          'https://localhost:7163/api/Email/Send',
          {
            email: selectedComplaint.mentorEmail,
            subject: emailSubject,
            message: createHtmlMessage(selectedComplaint.mentorEmail),
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      alert('Email sent successfully!');
      handleEmailClose();
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
      alert('Failed to send email. Please try again.');
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
                <td style={{ color: complaint.action === 1 ? 'green' : 'red' }}>
                  {complaint.action === 1 ? 'Resolved' : 'Unresolved'}
                </td>
                <td>
                  <button onClick={() => handleClickOpen(complaint)} className={styles.iconButton}>
                    {complaint.action === 0 ? (
                      <DoneIcon style={{ color: 'green' }} />
                    ) : (
                      <ReportProblemIcon style={{ color: 'red' }} />
                    )}
                  </button>
                  <button onClick={() => handleEmailClickOpen(complaint)} className={styles.iconButton}>
                    <EmailIcon style={{ color: '#1976d2' }} />
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

      {/* Dialog for Status Change */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#f0f4f7',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status of this complaint to
            <strong>{selectedComplaint?.action === 1 ? ' Unresolved' : ' Resolved'}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleStatusChange} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Email */}
      <Dialog
        open={emailDialogOpen}
        onClose={handleEmailClose}
        PaperProps={{
          style: {
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#f0f4f7',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <InputLabel id="recipient-label">Recipient</InputLabel>
          <Select
            labelId="recipient-label"
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="mentee">Mentee</MenuItem>
            <MenuItem value="mentor">Mentor</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </Select>
          <TextField
            label="Subject"
            fullWidth
            margin="normal"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmailClose}>Cancel</Button>
          <Button onClick={handleSendEmail}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ComplainsContent;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { GrCompliance } from "react-icons/gr";
import styles from './ComplainsContent.module.css';



const ComplainsContent = () => {
  // Initialize complaints as an empty array
  const [complaints, setComplaints] = useState([]);
  const [open, setOpen] = useState(false);  // State to control dialog visibility
  const [selectedComplaint, setSelectedComplaint] = useState(null);  // To hold the complaint selected for confirmation

  // Fetch complaints from the API when the component mounts
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllComplaints');
        
        console.log('API Response:', response.data);  // Log the API response
        
        // Access complaints from the `result` field of the response
        if (response.data && Array.isArray(response.data.result)) {
          setComplaints(response.data.result);  // Set complaints from `result`
        } else {
          console.error('No complaints found in the response:', response.data);
          setComplaints([]);  // Fallback to empty array if no complaints are found
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setComplaints([]);  // Fallback to empty array on error
      }
    };

    fetchComplaints();
  }, []);

  // Open the confirmation dialog
  const handleClickOpen = (complaint) => {
    setSelectedComplaint(complaint);  // Store the selected complaint
    setOpen(true);  // Open the dialog
  };

  // Close the dialog without doing anything
  const handleClose = () => {
    setOpen(false);
    setSelectedComplaint(null);
  };

  // Function to handle the status change of a complaint
  const handleStatusChange = async () => {
    const complaint = selectedComplaint;
    if (!complaint || !complaint.complaintId) {
      console.error('Complaint or Complaint ID is undefined');
      return;
    }
  
    // Use the correct status field based on the backend expectations (could be status or action)
    const newStatus = complaint.action === 1 ? 'unresolved' : 'resolved';
  
    const payload = {
      complaintId: complaint.complaintId,
      menteeName: complaint.menteeName,
      menteeEmail: complaint.menteeEmail,
      mentorName: complaint.mentorName,
      mentorEmail: complaint.mentorEmail,
      complaintDescription: complaint.complaintDescription,
      moduleId: complaint.moduleId,
      status: newStatus,  // Make sure this matches the backend requirement
    };
  
    console.log('Payload being sent:', payload);
  
    try {
      const response = await axios.put(
        `https://localhost:7163/api/DigitalPlusCrud/UpdateComplaint/${complaint.complaintId}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Complaint status updated successfully:', response.data);
  
      // Update the local state after successfully updating the status
      setComplaints((prevComplaints) =>
        prevComplaints.map((comp) =>
          comp.complaintId === complaint.complaintId ? { ...comp, action: newStatus === 'resolved' ? 1 : 0 } : comp
        )
      );
  
      handleClose();  // Close the dialog after the update
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Validation errors:', error.response.data.errors);
      } else {
        console.error('Error updating complaint status:', error.message);
      }
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
                <td>{complaint.moduleId}</td>
                <td>{complaint.complaintDescription}</td>
                {/* Status with color: Green for Resolved, Red for Unresolved */}
                <td style={{ color: complaint.action === 1 ? 'green' : 'red' }}>
                  {complaint.action === 1 ? 'Resolved' : 'Unresolved'}
                </td>
                <td>
                  {complaint.action === 0 ? (
                    <button onClick={() => handleClickOpen(complaint)}>Mark as Resolved</button>
                  ) : (
                    <button onClick={() => handleClickOpen(complaint)}>Mark as Unresolved</button>
                  )}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status of this complaint to {selectedComplaint?.action === 1 ? 'Unresolved' : 'Resolved'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleStatusChange} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ComplainsContent;

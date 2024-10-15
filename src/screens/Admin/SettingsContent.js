import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./SettingsContent.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { FaCog } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Save, Update } from '@mui/icons-material';



const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState("");

  const [adminForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    departmentId: "",
    adminId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleFormChange = (field, value) => {
    setEditForm({ ...adminForm, [field]: value });
  };

  const handleEditAdmin = async () => {
    if (!adminForm.adminId) {
      console.error("Admin_Id is null or undefined");
      return;
    }

    try {
      const updatedAdmin = {
        adminId: adminForm.adminId,
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        contactNo: adminForm.contact,
        password: adminForm.password,
        departmentId: adminForm.departmentId,
      };

      await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateAdministrator/${adminForm.adminId}`,
        updatedAdmin,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // eslint-disable-next-line no-const-assign
       updatedAdmin = admin.map((admin) =>
        admin.adminId === adminForm.adminId
          ? { ...admin, ...updatedAdmin }
          : admin
      );
      setAdmin(updatedAdmin);
      setIsDialogOpen(false)
      toast.success("Admin updated successfully!");
    } catch (error) {
      console.error(
        "Error updating Admin:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update Admin. Please try again.");
    }
  };

  const handleDownloadPdf = (id) => {
    const input = document.getElementById(id);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`${id}.pdf`);
    });
  };

  const toggleEdit = (field) => {
    setEditForm((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  const openEditAdminDialog = (admin) => {
    setAdmin(admin);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If user data is not available yet, return null or a loading state
  if (!user) {
    return <div>Loading...</div>;
    const user = JSON.parse(localStorage.getItem("user"));
  }

  return (
    <div className={styles.settingsContainer}>
      <ToastContainer />
      <div className={styles.content}>
      <h2> <FaCog /> SETTINGS</h2>
        {activeSection === "account" && (
          <div className={styles.accountSection}>
            <h2> <ImProfile /> Profile</h2>
            <div className={styles.profileInfo}>
              <div className={styles.inputGroup}>
                <span>First Name:</span>
                <input
                  type="text"
                  value={`${user.firstName}`}
                  // onChange={(e) => toggleEdit('firstName', e.target.value)}
                  disabled={!adminForm.firstName}
                />
              </div>

              <div className={styles.inputGroup}>
                <span>Last Name:</span>
                <input
                  type="text"
                  value={`${user.lastName}`}
                  onChange={(e) => handleFormChange('lastName', e.target.value)}
                  disabled={!adminForm.lastName}
                />
              </div>

              <div className={styles.inputGroup}>
                <span>Email Address:</span>
                <input
                  type="email"
                  value={`${user.email}`}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  disabled={!adminForm.email}
                />
              </div>

              <div className={styles.inputGroup}>
                <span>Contact:</span>
                <input
                  type="text"
                  value={`${user.contactNo}`}
                  onChange={(e) => handleFormChange('contact', e.target.value)}
                  disabled={!adminForm.contact}
                />
              </div>

              <div className={styles.inputGroup}>
                <span>Department:</span>
                <input
                  type="text"
                  value={`${user.departmentId}`}
                  onChange={(e) =>
                    handleFormChange('department', e.target.value)
                  }
                  disabled={!adminForm.contact}
                />
              </div>

              <div className={styles.inputGroup}>
                <span>Password:</span>
                <input
                  type="password"
                  value={`${user.password}`}
                  onChange={(e) => handleFormChange('password', e.target.value)}
                  disabled={!adminForm.password}
                />
              </div>

              <button className={styles.save} onClick={() => openEditAdminDialog(admin)}> <CiEdit /> Edit</button>

            </div>
          </div>
        )}
      </div>

      {/* Dialog for Adding/Editing Mentor */}
      <Dialog
        open={isDialogOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            closeDialog();
          }
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>{isEditing ? 'Edit Admin' : 'Add Mentor'}</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={`${user.firstName}`}
            onChange={(e) => handleEditAdmin('firstName', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            value={`${user.lastName}`}
            onChange={(e) => handleEditAdmin('lastName', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Personal Email"
            value={`${user.email}`}
            onChange={(e) => handleEditAdmin('email', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contact No"
            value={`${user.contactNo}`}
            onChange={(e) => handleEditAdmin('contactNo', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Department"
            value={`${user.departmentId}`}
            onChange={(e) => handleEditAdmin('department', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={`${user.password}`}
            onChange={(e) => handleEditAdmin('password', e.target.value)}
            fullWidth
            margin="normal"
            required
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary" sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button 
            onClick={isEditing ? handleEditAdmin : handleFormChange} 
            startIcon={isEditing ? <Update /> : <Save />} 
            color="primary" 
            sx={{ color: 'black' }} // Black text color
          >
            {isEditing ? 'Update Admin' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;

import React, { useState, useEffect } from "react";
import styles from "./SettingsContent.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { FaCog } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Save, Update } from "@mui/icons-material";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [user, setUser] = useState(null);
  const [adminForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
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
    setEditForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleEditAdmin = async () => {
    if (!adminForm.adminId) {
      console.error("Admin Id is null or undefined");
      return;
    }

    try {
      const updatedAdmin = {
        adminId: adminForm.adminId,
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        contactNo: adminForm.contactNo,
        password: adminForm.password,
        departmentId: adminForm.departmentId,
      };

      console.log("Sending updatedAdmin to API:", updatedAdmin);

      await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateAdministrator/${adminForm.adminId}`,
        updatedAdmin,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the user in local state
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedAdmin,
      }));
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedAdmin }));
      setIsDialogOpen(false);
      toast.success("Admin updated successfully!");
    } catch (error) {
      console.error(
        "Error updating Admin:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update Admin. Please try again.");
    }
  };

  const openEditAdminDialog = () => {
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNo: user.contactNo,
      password: user.password,
      departmentId: user.departmentId,
      adminId: user.adminId,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.settingsContainer}>
      <ToastContainer />
      <div className={styles.content}>
        <h2>
          {" "}
          <FaCog /> SETTINGS
        </h2>
        {activeSection === "account" && (
          <div className={styles.accountSection}>
            <h2>
              {" "}
              <ImProfile /> Profile
            </h2>
            <div className={styles.profileInfo}>
              <div className={styles.inputGroup}>
                <span>First Name:</span>
                <input
                  type="text"
                  value={user.firstName}
                  disabled={true} // You can enable/disable the fields as needed
                />
              </div>

              <div className={styles.inputGroup}>
                <span>Last Name:</span>
                <input type="text" value={user.lastName} disabled={true} />
              </div>

              <div className={styles.inputGroup}>
                <span>Email Address:</span>
                <input type="email" value={user.email} disabled={true} />
              </div>

              <div className={styles.inputGroup}>
                <span>Contact:</span>
                <input type="text" value={user.contactNo} disabled={true} />
              </div>

              <div className={styles.inputGroup}>
                <span>Department:</span>
                <input type="text" value={user.departmentId} disabled={true} />
              </div>

              <button
                className={styles.save}
                onClick={openEditAdminDialog}
              >
                <CiEdit /> Edit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog for Editing Admin */}
      <Dialog
        open={isDialogOpen}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            closeDialog();
          }
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>{isEditing ? "Edit Admin" : "Add Mentor"}</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={adminForm.firstName}
            onChange={(e) => handleFormChange("firstName", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            value={adminForm.lastName}
            onChange={(e) => handleFormChange("lastName", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Personal Email"
            value={adminForm.email}
            onChange={(e) => handleFormChange("email", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contact No"
            value={adminForm.contactNo}
            onChange={(e) => handleFormChange("contactNo", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Department"
            value={adminForm.departmentId}
            onChange={(e) => handleFormChange("departmentId", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={adminForm.password}
            onChange={(e) => handleFormChange("password", e.target.value)}
            onClick={togglePasswordVisibility}
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary" sx={{ color: "black" }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditAdmin}
            startIcon={isEditing ? <Update /> : <Save />}
            color="primary"
            sx={{ color: "black" }}
          >
            {isEditing ? "Update Admin" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;

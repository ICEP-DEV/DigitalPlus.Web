import React, { useState, useEffect } from "react";
import styles from "./SettingsContent.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaUserCog } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Save,
  Edit,
  Person,
  Email,
  Phone,
} from "@mui/icons-material";

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
    adminId: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setProfileForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.adminId) {
      console.error("Admin ID is null or undefined");
      return;
    }

    try {
      const updatedProfile = {
        adminId: profileForm.adminId,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        contactNo: profileForm.contactNo,
      };

      await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateAdministrator/${profileForm.adminId}`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUserData = { ...userData, ...updatedProfile };
      setUserData(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setOpenEditDialog(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const openEditProfileDialog = () => {
    setProfileForm({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      contactNo: userData.contactNo || "",
      password: "",
      confirmPassword: "",
      adminId: userData.adminId || "",
    });
    setOpenEditDialog(true);
  };

  const closeEditDialog = () => {
    setOpenEditDialog(false);
  };

  const togglePasswordFieldVisibility = () => {
    setShowPasswordField(!showPasswordField);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.settingsContainer}>
      <ToastContainer />
      <div className={styles.settingsContent}>
        <h2 className={styles.pageTitle}>
          <FaUserCog /> Settings
        </h2>

        <div className={styles.profileSection}>
          <h3 className={styles.profileTitle}>Profile Information</h3>
          <div className={styles.profileDetails}>
            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
                <Person className={styles.icon} />
                <span className={styles.detailLabel}>First Name:</span>
              </div>
              <span className={styles.detailValue}>{userData.firstName}</span>
            </div>
            <div className={styles.separator}></div>

            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
                <Person className={styles.icon} />
                <span className={styles.detailLabel}>Last Name:</span>
              </div>
              <span className={styles.detailValue}>{userData.lastName}</span>
            </div>
            <div className={styles.separator}></div>

            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
                <Email className={styles.icon} />
                <span className={styles.detailLabel}>Email Address:</span>
              </div>
              <span className={styles.detailValue}>{userData.email}</span>
            </div>
            <div className={styles.separator}></div>

            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
                <Phone className={styles.icon} />
                <span className={styles.detailLabel}>Contact Number:</span>
              </div>
              <span className={styles.detailValue}>{userData.contactNo}</span>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <IconButton
              color="primary"
              onClick={openEditProfileDialog}
              aria-label="edit profile"
            >
              <Edit />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog positioned near Profile Section */}
      <Dialog
        open={openEditDialog}
        onClose={closeEditDialog}
        aria-labelledby="edit-profile-dialog"
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            position: "absolute",
            top: "20%", // Adjust this value to control vertical positioning
            left: "55%", // Align it to the right of the Profile Information section
            transform: "translate(-50%, 0)",
          },
        }}
      >
        <DialogTitle id="edit-profile-dialog">Edit Profile</DialogTitle>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className={styles.tabsContainer}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Contact Information" />
          <Tab label="Change Password" />
        </Tabs>
        <DialogContent>
          {activeTab === 0 && (
            <div>
              <TextField
                label="Email Address"
                value={profileForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                fullWidth
                margin="normal"
                required
                type="email"
              />
              <TextField
                label="Contact Number"
                value={profileForm.contactNo}
                onChange={(e) =>
                  handleInputChange("contactNo", e.target.value)
                }
                fullWidth
                margin="normal"
                required
                type="tel"
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Password"
                type={showPasswordField ? "text" : "password"}
                value={profileForm.password}
                onChange={(e) =>
                  handleInputChange("password", e.target.value)
                }
                fullWidth
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordFieldVisibility}
                        edge="end"
                      >
                        {showPasswordField ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={profileForm.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                fullWidth
                margin="normal"
                required
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProfile}
            color="primary"
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;

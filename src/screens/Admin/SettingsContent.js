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
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Save,
  Edit,
  Person,
  Email,
  Phone,
  Image,
  LockPerson,
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
    admin_Id: "", // Ensure admin_Id is initialized as an empty string
    departmentId: 0,
    imageData: "",
    image: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      console.log("Admin ID from local storage:", parsedUserData.admin_Id); // Debug log
      setUserData(parsedUserData);
      fetchAdminDetails(parsedUserData);
    }
  }, []);

  const fetchAdminDetails = async (storedUserData) => {
    if (!storedUserData.admin_Id) {
      toast.error("Admin ID is missing. Unable to fetch details.");
      console.error("Admin ID is missing.");
      return;
    }

    try {
      const response = await axios.get(
        `https://localhost:7163/api/DigitalPlusUser/GetAdministrator/${storedUserData.admin_Id}`
      );
      const profileData = response.data;
      console.log("Fetched profile data:", profileData); // Debug log
      setProfileForm({
        admin_Id: profileData.admin_Id, // Set the admin_Id properly
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        emailAddress: profileData.emailAddress,
        contactNo: profileData.contactNo,
        password: "",
        confirmPassword: "",
        departmentId: profileData.departmentId || 0,
        imageData: profileData.imageData || "",
        image: profileData.image || "",
      });
    } catch (error) {
      toast.error("Error fetching admin details.");
      console.error("Error fetching admin details:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const validateProfileForm = () => {
    const { emailAddress, contactNo } = profileForm;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(emailAddress)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!contactRegex.test(contactNo)) {
      toast.error("Please enter a valid contact number (10-15 digits).");
      return false;
    }

    return true;
  };

  const validatePasswordForm = () => {
    const { password, confirmPassword } = profileForm;

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      const updatedProfile = {
        admin_Id: profileForm.admin_Id,
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        emailAddress: profileForm.emailAddress.trim(),
        contactNo: profileForm.contactNo.trim(),
        password: profileForm.password.trim(),
        departmentId: parseInt(profileForm.departmentId, 10),
        imageData: profileForm.imageData || null,
        image: null,
      };

      console.log("Updating profile with payload:", updatedProfile);

      await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateAdministrator/${userData.admin_Id}`,
        updatedProfile,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Profile updated successfully!");
      const updatedUserData = { ...userData, ...updatedProfile };
      setUserData(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setOpenEditDialog(false);
    } catch (error) {
      if (error.response) {
        console.error("API Response Error:", error.response.data);
        toast.error(error.response.data.message || "Failed to update profile.");
      } else {
        console.error("Error updating profile:", error.message);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openEditProfileDialog = () => {
    setProfileForm({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      emailAddress: userData.emailAddress || "",
      contactNo: userData.contactNo || "",
      password: userData.password || "",
      confirmPassword: userData.password || "",
      admin_Id: userData.admin_Id || "", // Ensure admin_Id is passed
      departmentId: userData.departmentId || 0,
      imageData: userData.imageData || "",
      image: userData.image || "",
    });
    setOpenEditDialog(true);
  };

  const closeEditDialog = () => {
    setProfileForm({ ...userData });
    setOpenEditDialog(false);
  };

  const togglePasswordFieldVisibility = () => {
    setShowPasswordField(!showPasswordField);
  };

  if (!userData) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
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

            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
                <Person className={styles.icon} />
                <span className={styles.detailLabel}>Last Name:</span>
              </div>
              <span className={styles.detailValue}>{userData.lastName}</span>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
                <Email className={styles.icon} />
                <span className={styles.detailLabel}>Email Address:</span>
              </div>
              <span className={styles.detailValue}>
                {userData.emailAddress}
              </span>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
                <Phone className={styles.icon} />
                <span className={styles.detailLabel}>Contact Number:</span>
              </div>
              <span className={styles.detailValue}>{userData.contactNo}</span>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
              <LockPerson className={styles.icon} />
                <span className={styles.detailLabel}>Department ID:</span>
              </div>
              <span className={styles.detailValue}>
                {userData.departmentId}
              </span>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.iconAndLabel}>
                <Image className={styles.icon} />
                <span className={styles.detailLabel}>Profile Image:</span>
              </div>
              <span className={styles.detailValue}>
                {userData.image ? "Image uploaded" : "No image"}
              </span>
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

      <Dialog
        open={openEditDialog}
        onClose={closeEditDialog}
        aria-labelledby="edit-profile-dialog"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="edit-profile-dialog">Edit Profile</DialogTitle>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Contact Information" />
          <Tab label="Change Password" />
        </Tabs>
        <DialogContent>
          {activeTab === 0 && (
            <>
              <TextField
                label="First Name"
                value={profileForm.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                fullWidth
                margin="normal"
                required
                type="text"
              />
              <TextField
                label="Last Name"
                value={profileForm.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                fullWidth
                margin="normal"
                required
                type="text"
              />
              <TextField
                label="Email Address"
                value={profileForm.emailAddress}
                onChange={(e) => handleInputChange("email", e.target.value)}
                fullWidth
                margin="normal"
                required
                type="email"
              />
              <TextField
                label="Contact Number"
                value={profileForm.contactNo}
                onChange={(e) => handleInputChange("contactNo", e.target.value)}
                fullWidth
                margin="normal"
                required
                type="tel"
              />
              <TextField
                label="Department ID"
                value={profileForm.departmentId}
                onChange={(e) =>
                  handleInputChange("departmentId", e.target.value)
                }
                fullWidth
                margin="normal"
                required
                type="number"
              />
            </>
          )}
          {activeTab === 1 && (
            <>
              <TextField
                label="New Password"
                type={showPasswordField ? "text" : "password"}
                value={profileForm.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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
                        {showPasswordField ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                type={showPasswordField ? "text" : "password"}
                value={profileForm.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                fullWidth
                margin="normal"
                required
              />
            </>
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;

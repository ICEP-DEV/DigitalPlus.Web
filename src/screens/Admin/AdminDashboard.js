import React, { useState, useEffect } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // Ensure correct utility path
import styles from './AdminDashboard.module.css'; // Import styles
import DashboardContent from './DashboardContent';
import MentorsContent from '../Admin/MentorsContent';
import MenteesContent from './MenteesContent';
import ComplainsContent from './ComplainsContent';
import ModulesContent from './ModulesContent';
import LogoutComponent from './LogoutComponent';
import SettingsContent from './SettingsContent';
import ReportContent from './ReportContent';
import ScheduleComponent from './ScheduleComponent';
import AccountContent from './AccountContent';
import CreateMentorContent from './CreateMentorContent';
import AnalyticsReportsContent from './AnalyticsReportsContent';
import { FaBars, FaCog, FaBook, FaHome, FaPowerOff } from 'react-icons/fa';
import { SiCodementor } from 'react-icons/si';
import { GoReport } from 'react-icons/go';
import { GrSchedules, GrCompliance } from 'react-icons/gr';
import { Edit, Close,Save } from '@mui/icons-material';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle
  const [adminEmail, setAdminEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  
  const handleSaveCroppedImage = async () => {
    try {
      // Get the cropped image as a Blob
      const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
      console.log('Cropped Image:', croppedImage); // Log to inspect the image format
  
      let base64Image;
  
      // Convert Blob to base64 string if croppedImage is a Blob
      if (croppedImage instanceof Blob) {
        base64Image = await convertBlobToBase64(croppedImage);  // Convert the Blob to base64
      } else if (typeof croppedImage === 'string') {
        base64Image = croppedImage;  // If it's already a base64 string, use it directly
      } else {
        throw new Error('Cropped image is not in a valid format');
      }
  
      // Log the base64 image to verify the conversion
      console.log('Base64 Image:', base64Image);
  
      // Convert base64 string to byte[] (binary data)
      const byteArray = base64ToByteArray(base64Image);
  
      // Get the user data from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('User data not found in localStorage');
        return;
      }
  
      // Construct the request body
      const requestBody = {
        admin: {
          admin_Id: user.admin_Id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddress,
          contactNo: user.contactNo,
          departmentId: user.departmentId,
          password: user.password,
        },
        imageData: byteArray,  // Send the byte[] image data
        image: base64Image,    // Send the base64 image as the image field
      };
  
      console.log('Request Body:', requestBody);
  
      // Send the PUT request to update the profile
      const response = await fetch(`https://localhost:7163/api/DigitalPlusUser/UpdateAdministrator/${requestBody.admin.admin_Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        console.log('Profile updated successfully');
        setProfileImage(croppedImage);
        setIsModalOpen(false);
      } else {
        const errorResponse = await response.json();
        console.error('Failed to update profile:', errorResponse);
        alert(`Failed to update profile: ${JSON.stringify(errorResponse.errors)}`);
      }
    } catch (error) {
      console.error('Error cropping the image or updating profile:', error);
    }
  };
  
 // Helper function to convert Blob to base64
function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Ensure base64 string is extracted correctly
      const base64String = reader.result.split(',')[1];  // Remove "data:image/png;base64," part if it exists
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);  // Read the Blob as a Data URL
  });
}

// Helper function to convert a base64 string to a byte array
function base64ToByteArray(base64) {
  // Check if the string contains the base64 prefix and remove it
  const base64String = base64.includes('base64,') ? base64.split('base64,')[1] : base64;

  // Validate that the string is properly base64-encoded
  if (!/^[A-Za-z0-9+/=]+$/.test(base64String)) {
    throw new Error('Invalid base64 string');
  }

  // Decode the base64 string to binary
  const binaryString = atob(base64String); 
  const byteArray = new Uint8Array(binaryString.length);

  // Convert the binary string to a byte array
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  return byteArray;
}


  
  
  
 useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) setProfileImage(storedImage);
  }, []);
  
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.admin_Id) {
          console.error('User ID not found in localStorage');
          return;
        }

        const response = await fetch(`https://localhost:7163/api/DigitalPlusUser/GetAdministrator/${user.admin_Id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch administrator details: ${response.statusText}`);
        }

        const data = await response.json();
        setAdminEmail(data.emailAddress);
        if (data.imageData) {
          const base64Image = `data:image/jpeg;base64,${data.imageData}`;
          setProfileImage(base64Image);
        }
      } catch (error) {
        console.error('Error fetching administrator details:', error);
      }
    };

    fetchAdminDetails();
  }, []);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);
  const openCropModal = () => setIsCropModalOpen(true);
const closeCropModal = () => setIsCropModalOpen(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Fetch the admin email and profile image from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
    if (user && user.emailAddress) {
      setAdminEmail(user.emailAddress); // Set admin email from the API response
    }

    // Retrieve profile image from localStorage
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Set the selected image for cropping
        setIsCropModalOpen(true); // Open the cropping modal immediately
      };
      reader.readAsDataURL(file); // Convert the file to Base64
    }
  };
  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChangeProfile = () => {
    closeModal();
    document.getElementById("profileImageInput").click();
  };

  // Function to trigger file input click
  const handleImageClick = () => {
    document.getElementById("profileImageInput").click();
  };
  

  return (
    <div className={styles.adminDashboardContainer}>
      <header className={styles.adminHeader}>

<div className={styles.adminInfo}>
  <div
    className={styles.adminIcon}
    onClick={() => setIsProfileModalOpen(true)} // Open the profile modal on click
    aria-label="View profile picture"
  >
    {profileImage ? (
      <img
        src={profileImage}
        alt="Admin"
        className={styles.adminImage}
        title="View Profile"
      />
    ) : (
      <div className={styles.imagePlaceholder}>Upload Image</div>
    )}
  </div>
  <input
    type="file"
    id="profileImageInput"
    accept="image/*"
    onChange={handleImageUpload}
    style={{ display: 'none' }}
    title="View Profile"
  />
  <div className={styles.adminText}>
    <span>Admin</span>
    {adminEmail && <span className={styles.adminEmail}>{adminEmail}</span>}
  </div>
  </div>


        {/* Updated logout button */}
        <NavLink to="/admin-dashboard/logout" className={styles.logoutButton}>
          <FaPowerOff /> {/* Red switch-off icon */}
        </NavLink>
      </header>

      <div className={styles.adminDashboard}>
        {/* Sidebar with toggle functionality */}
        <nav className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <FaBars />
          </button>
          <ul>
            <li>
              <NavLink
                to="/admin-dashboard/dashboard"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <FaHome />
                {isOpen && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/mentors"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <SiCodementor />
                {isOpen && <span>Mentors</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/mentees"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <SiCodementor />
                {isOpen && <span>Mentees</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/reports"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <GoReport />
                {isOpen && <span>Reports</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/schedule"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <GrSchedules />
                {isOpen && <span>Schedule</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/complains"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <GrCompliance />
                {isOpen && <span>Complains</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/modules"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <FaBook />
                {isOpen && <span>Modules</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-dashboard/settings"
                className={({ isActive }) =>
                  isActive ? `${styles.sidebarItem} ${styles.active}` : styles.sidebarItem
                }>
                <FaCog />
                {isOpen && <span>Settings</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
{/* Profile Picture Modal */}
<Dialog
  open={isProfileModalOpen}
  onClose={closeProfileModal}
  PaperProps={{
    style: {
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: '#f8f9fa',
      maxWidth: '600px',
      textAlign: 'center',
      border:'5px solid #1871a5'
    },
  }}
>
  <DialogContent>
    {profileImage ? (
      <img
        src={profileImage}
        alt="Admin"
        style={{
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          marginBottom: '20px',
          objectFit: 'cover',
          border:'3px solid #ffffff'
        }}
      />
    ) : (
      <div style={{ fontSize: '16px', marginBottom: '20px' }}>No profile image available</div>
    )}
    <input
      type="file"
      id="profileImageInput"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={(event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setSelectedImage(reader.result); // Set the image for cropping
            closeProfileModal(); // Close profile modal
            openCropModal(); // Open cropping modal
          };
          reader.readAsDataURL(file); // Read file as Base64
        }
      }}
    />
  </DialogContent>
  <DialogActions>
  <Button
  title="Change Profile"
      onClick={() => document.getElementById('profileImageInput').click()}
      style={{
        backgroundColor: '#2196F3',
        color: '#fff',
        padding: '10px 20px',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        minWidth: 'unset',
      }}
    >
      <Edit style={{ fontSize: '20px', color: '#fff' }} />
      
    </Button>
    <Button
    title="Close"
  onClick={closeProfileModal}
  style={{
     backgroundColor: '#FF0000',
        color: '#fff',
        padding: '10px 20px',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        minWidth: 'unset',
  }}
>
  <Close />
</Button>
  </DialogActions>
</Dialog>

{/* Cropping Modal */}
<Dialog
  open={isCropModalOpen}
  onClose={closeCropModal}
  PaperProps={{
    style: {
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: '#f8f9fa',
      maxWidth: '600px',
    },
  }}
>
  <DialogContent style={{ position: 'relative', height: '400px' }}>
    {selectedImage && (
      <Cropper
        image={selectedImage}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
    )}
  </DialogContent>
  <DialogActions>
    <Button
      onClick={closeCropModal}
      style={{
        backgroundColor: '#FF0000',
           color: '#fff',
           padding: '10px 20px',
           marginRight: '10px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           borderRadius: '50%',
           width: '40px',
           height: '40px',
           minWidth: 'unset',
     }}
   >
     <Close />
    </Button>
    <Button
      onClick={handleSaveCroppedImage}
      style={{
        backgroundColor: '#4CAF50',
           color: '#fff',
           padding: '10px 20px',
           marginRight: '10px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           borderRadius: '50%',
           width: '40px',
           height: '40px',
           minWidth: 'unset',
     }}
    >
      <Save/>
    </Button>
  </DialogActions>
</Dialog>




        {/* Main content */}
        <div className={styles.dashboardContent}>
          <Routes>
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="mentors" element={<MentorsContent />} />
            <Route path="mentees" element={<MenteesContent />} />
            <Route path="reports" element={<ReportContent />} />
            <Route path="schedule" element={<ScheduleComponent />} />
            <Route path="complains" element={<ComplainsContent />} />
            <Route path="modules" element={<ModulesContent />} />
            <Route path="settings/account" element={<AccountContent />} />
            <Route path="settings/create-mentor" element={<CreateMentorContent />} />
            <Route path="settings/analytics" element={<AnalyticsReportsContent />} />
            <Route path="settings" element={<SettingsContent />} />
            <Route path="logout" element={<LogoutComponent />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

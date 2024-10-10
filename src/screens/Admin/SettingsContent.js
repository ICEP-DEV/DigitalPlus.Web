import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./SettingsContent.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CiEdit, CiSaveDown2 } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { FaCog } from 'react-icons/fa';


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
    try {
      if (!adminForm.adminId) {
        console.error("Admin_Id is null or undefined");
        return;
      }

      const updatedAdmin = {
        adminId: adminForm.adminId,
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        contactNo: adminForm.contact,
        password: adminForm.password,
        departmentId: adminForm.departmentId,
      };

      const response = await axios.put(
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

      toast.success("Admin updated successfully!");
    } catch (error) {
      console.error(
        "Error updating mentor:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update mentor. Please try again.");
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
                  onChange={(e) => handleEditAdmin("firstName", e.target.value)}
                  disabled={!adminForm.firstName}
                />
                <button className={styles.editBtn} onClick={() => toggleEdit("firstName")}> <CiEdit /> Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Last Name:</span>
                <input
                  type="text"
                  value={`${user.lastName}`}
                  onChange={(e) => handleFormChange("lastName", e.target.value)}
                  disabled={!adminForm.lastName}
                />
                <button className={styles.editBtn} onClick={() => toggleEdit("lastName")}>
                  {" "}
                  <CiEdit /> Edit
                </button>
              </div>

              <div className={styles.inputGroup}>
                <span>Email Address:</span>
                <input
                  type="email"
                  value={`${user.email}`}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  disabled={!adminForm.email}
                />
                <button className={styles.editBtn} onClick={() => toggleEdit("email")}> <CiEdit /> Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Contact:</span>
                <input
                  type="text"
                  value={`${user.contactNo}`}
                  onChange={(e) => handleFormChange("contact", e.target.value)}
                  disabled={!adminForm.contact}
                />
                <button className={styles.editBtn} onClick={() => toggleEdit("contact")}> <CiEdit /> Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Department:</span>
                <input
                  type="text"
                  value={`${user.departmentId}`}
                  onChange={(e) =>
                    handleFormChange("department", e.target.value)
                  }
                  disabled={!adminForm.contact}
                />
                <button className={styles.editBtn} onClick={() => toggleEdit("department")}> <CiEdit /> Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Password:</span>
                <input
                  type="password"
                  value={`${user.password}`}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  disabled={!adminForm.password}
                />
                <button className={styles.editBtn} onClick={(e) => toggleEdit("password")}> <CiEdit /> Edit</button>
              </div>
              <button className={styles.save}> <CiSaveDown2 /> Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

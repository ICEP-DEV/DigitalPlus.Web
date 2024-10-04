import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./SettingsContent.module.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


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
    adminId: ""
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleFormChange = (field, value) => {
    setEditForm({ ...adminForm, [field]: value });
  };

  const handleEditAdmin = async () => {
    try {
      if (!adminForm.admin_Id) {
        console.error("Admin_Id is null or undefined");
        return;
      }

      const updatedAdmin = {
        adminId: adminForm.admin_Id,
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        contactNo: adminForm.contact,
        password: adminForm.password,
        departmentId: adminForm.departmentId
      };

      const response = await axios.put(
        `https://localhost:7163/api/DigitalPlusUser/UpdateAdministrator/${adminForm.admin_Id}`,
        updatedAdmin,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      updatedAdmin = admin.map((admin) =>
        admin.admin_Id === adminForm.admin_Id
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
  }

  return (
    <div className={styles.settingsContainer}>
      <ToastContainer />
      <div className={styles.sidebar}>
        <h2>SETTINGS</h2>
        <button
          onClick={() => setActiveSection("account")}
          className={activeSection === "account" ? styles.active : ""}
        >
          Account
        </button>
        <button
          onClick={() => setActiveSection("analytics")}
          className={activeSection === "analytics" ? styles.active : ""}
        >
          Analytics & Report
        </button>
      </div>

      <div className={styles.content}>
        {activeSection === "account" && (
          <div className={styles.accountSection}>
            <h2>Profile</h2>
            <div className={styles.profileInfo}>
              <div className={styles.inputGroup}>
                <span>First Name:</span>
                <input
                  type="text"
                  value={`${adminForm.firstName}`}
                  onChange={(e) => handleFormChange('firstName', e.target.value)}
                  disabled={!adminForm.firstName}
                />
                <button onClick={() => toggleEdit("firstName")}>Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Last Name:</span>
                <input
                  type="text"
                  value={`${adminForm.lastName}`}
                  onChange={(e) => handleFormChange('lastName', e.target.value)}
                  disabled={!adminForm.lastName}
                />
                <button onClick={() => toggleEdit("lastName")}>Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Email Address:</span>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  disabled={!adminForm.email}
                />
                <button onClick={() => toggleEdit("email")}>Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Contact:</span>
                <input
                  type="text"
                  value={adminForm.contactNo}
                  onChange={(e) => handleFormChange('contact', e.target.value)}
                  disabled={!adminForm.contact}
                />
                <button onClick={() => toggleEdit("contact")}>Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Department:</span>
                <input
                  type="text"
                  value={adminForm.departmentId}
                  onChange={(e) => handleFormChange('department', e.target.value)}
                  disabled={!adminForm.contact}
                />
                <button onClick={() => toggleEdit("department")}>Edit</button>
              </div>

              <div className={styles.inputGroup}>
                <span>Password:</span>
                <input
                  type="password"
                  value={adminForm.password}
                  disabled={!adminForm.password}
                />
                <button onClick={() => toggleEdit("password")}>Edit</button>
              </div>
              <button className={styles.save}>Save</button>
            </div>
          </div>
        )}

        {activeSection === "analytics" && (
          <div className={styles.analyticsSection}>
            <h2>Analysis Reports</h2>
            <div className={styles.analyticsGrid}>
              <div className={styles.reportCard} id="report1">
                <h3>Classes allocation</h3>
                <img src="/path-to-chart1" alt="Chart 1" />
                <button onClick={() => handleDownloadPdf("report1")}>
                  Download
                </button>
              </div>
              <div className={styles.reportCard} id="report2">
                <h3>Monthly activity</h3>
                <img src="/path-to-chart2" alt="Chart 2" />
                <button onClick={() => handleDownloadPdf("report2")}>
                  Download
                </button>
              </div>
              <div className={styles.reportCard} id="report3">
                <h3>Number of Feedback</h3>
                <img src="/path-to-chart3" alt="Chart 3" />
                <button onClick={() => handleDownloadPdf("report3")}>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

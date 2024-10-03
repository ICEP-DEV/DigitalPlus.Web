import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './SettingsContent.module.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState({
    fullName: false,
    email: false,
    contact: false,
    password: false,
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleDownloadPdf = (id) => {
    const input = document.getElementById(id);
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save(`${id}.pdf`);
      });
  };

  const toggleEdit = (field) => {
    setEditField((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  // If user data is not available yet, return null or a loading state
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.sidebar}>
        <h2>SETTINGS</h2>
        <button
          onClick={() => setActiveSection('account')}
          className={activeSection === 'account' ? styles.active : ''}
        >
          Account
        </button>
        <button
          onClick={() => setActiveSection('analytics')}
          className={activeSection === 'analytics' ? styles.active : ''}
        >
          Analytics & Report
        </button>
      </div>

      <div className={styles.content}>
        {activeSection === 'account' && (
          <div className={styles.accountSection}>
            <h2>Profile</h2>
            <div className={styles.profileInfo}>
              <div className={styles.inputGroup}>
                <span>Full Name:</span>
                <input
                  type="text"
                  value={`${user.firstName} ${user.lastName}`}
                  disabled={!editField.fullName}
                />
                <button onClick={() => toggleEdit('fullName')}>Edit</button>
              </div>
              <div className={styles.inputGroup}>
                <span>Email Address:</span>
                <input
                  type="email"
                  value={user.personalEmail}
                  disabled={!editField.email}
                />
                <button onClick={() => toggleEdit('email')}>Edit</button>
              </div>
              <div className={styles.inputGroup}>
                <span>Contact:</span>
                <input
                  type="text"
                  value={user.contactNo}
                  disabled={!editField.contact}
                />
                <button onClick={() => toggleEdit('contact')}>Edit</button>
              </div>
              <div className={styles.inputGroup}>
                <span>Password:</span>
                <input
                  type="password"
                  value={user.password}
                  disabled={!editField.password}
                />
                <button onClick={() => toggleEdit('password')}>Edit</button>
              </div>
              <button className={styles.save}>Save</button>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className={styles.analyticsSection}>
            <h2>Analysis Reports</h2>
            <div className={styles.analyticsGrid}>
              <div className={styles.reportCard} id="report1">
                <h3>Classes allocation</h3>
                <img src="/path-to-chart1" alt="Chart 1" />
                <button onClick={() => handleDownloadPdf('report1')}>Download</button>
              </div>
              <div className={styles.reportCard} id="report2">
                <h3>Monthly activity</h3>
                <img src="/path-to-chart2" alt="Chart 2" />
                <button onClick={() => handleDownloadPdf('report2')}>Download</button>
              </div>
              <div className={styles.reportCard} id="report3">
                <h3>Number of Feedback</h3>
                <img src="/path-to-chart3" alt="Chart 3" />
                <button onClick={() => handleDownloadPdf('report3')}>Download</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

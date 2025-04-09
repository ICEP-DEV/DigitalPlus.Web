// DashboardContent.js

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import styles from './DashboardContent.module.css';
import {
  BsPlusCircle,
  BsPersonCheckFill,
  BsPersonXFill,
  BsPeopleFill,
  BsEyeFill,
} from 'react-icons/bs';
import CreateNewAnnouncement from './CreateNewAnnouncement';
import AnnouncementModal from './AnnouncementModal';

const DashboardContent = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([
    // Sample data; replace with actual data fetching
    {
      id: 1,
      name: 'Holiday Notice',
      type: 'One-Time',
      sendDate: '2023-12-24 10:00 AM',
      recipient: 'All',
      content: 'We will be closed on Christmas Day.',
    },
    // Add more announcements as needed
  ]);

  const [dashboardData, setDashboardData] = useState({
    totalMentees: 0,
    activatedMentors: 0,
    deactivatedMentors: 0,
    totalMentors: 0,
    activatedMentees: 0,
    deactivatedMentees: 0,
  });

  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null); // Reset editing state
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openAnnouncementModal = () => {
    setAnnouncementModalOpen(true);
  };

  const closeAnnouncementModal = () => {
    setAnnouncementModalOpen(false);
  };

  const addAnnouncement = (newAnnouncement) => {
    if (newAnnouncement.id) {
      // Editing an existing announcement
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((announcement) =>
          announcement.id === newAnnouncement.id ? newAnnouncement : announcement
        )
      );
    } else {
      // Adding a new announcement
      newAnnouncement.id = Date.now(); // Assign a unique ID
      setAnnouncements([...announcements, newAnnouncement]);
    }
  };

  const editAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setModalOpen(true);
    setAnnouncementModalOpen(false); // Close the announcements modal when editing
  };

  const deleteAnnouncement = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.filter((announcement) => announcement.id !== id)
      );
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.admin_Id) {
      const fetchDashboardData = async () => {
        try {
          const response = await fetch(
            `https://localhost:7163/api/admin-dashboard/Dashboard/${user.admin_Id}`
          );
          const data = await response.json();
          setDashboardData(data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      fetchDashboardData();

      // Fetch announcements here if you have an API
      // fetchAnnouncements();
    } else {
      console.error('No admin_Id found in local storage.');
    }
  }, []);

  const pieData = [
    { name: 'Contact', value: 60 },
    { name: 'Online', value: 40 },
  ];

  const colors = ['#FF6347', '#FFA500'];

  const lineData = [
    { month: 'Jan', mentors: 50 },
    { month: 'Feb', mentors: 45 },
    { month: 'Mar', mentors: 40 },
    { month: 'Apr', mentors: 35 },
    { month: 'May', mentors: 30 },
    { month: 'Jun', mentors: 35 },
    { month: 'Jul', mentors: 40 },
    { month: 'Aug', mentors: 45 },
    { month: 'Sep', mentors: 50 },
    { month: 'Oct', mentors: 55 },
    { month: 'Nov', mentors: 60 },
    { month: 'Dec', mentors: 65 },
  ];

  const barData = [
    { month: 'Jan', students: 70 },
    { month: 'Feb', students: 80 },
    { month: 'Mar', students: 75 },
    { month: 'Apr', students: 85 },
    { month: 'May', students: 65 },
    { month: 'Jun', students: 55 },
    { month: 'Jul', students: 80 },
    { month: 'Aug', students: 90 },
    { month: 'Sep', students: 75 },
    { month: 'Oct', students: 85 },
    { month: 'Nov', students: 95 },
    { month: 'Dec', students: 100 },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Announcement Section */}
      <div className={styles.announcementContainer}>
  <h3 className={styles.announcementLabel}>Announcements</h3>
  <div className={styles.buttonGroup}>
    <div className={styles.buttonGroupItem}>
      <span className={styles.buttonTitle}>Add Announcement</span>
      <button className={styles.iconButton} onClick={handleAddAnnouncement}>
        <BsPlusCircle size={20} color="#000" />
      </button>
    </div>
    <div className={styles.buttonGroupItem}>
      <span className={styles.buttonTitle}>View Announcements</span>
      <button className={styles.iconButton} onClick={openAnnouncementModal}>
        <BsEyeFill size={20} color="#000" />
      </button>
    </div>
  </div>
</div>

      {/* Create Announcement Modal */}
      <CreateNewAnnouncement
        isOpen={isModalOpen}
        onClose={closeModal}
        addAnnouncement={addAnnouncement}
        editingAnnouncement={editingAnnouncement}
      />

      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={closeAnnouncementModal}
        announcements={announcements}
        editAnnouncement={editAnnouncement}
        deleteAnnouncement={deleteAnnouncement}
      />

      {/* Dashboard Stats */}
      <div className={styles.header}>
        <div className={`${styles.statItem} ${styles.activatedMenteesUnique}`}>
          <div className={styles.statItemIcon}>
            <BsPersonCheckFill size={40} color="#000" />
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Activated Mentees</h3>
            <p>{dashboardData.activatedMentees}</p>
          </div>
        </div>
        <div className={`${styles.statItem} ${styles.deactivatedMenteesUnique}`}>
          <div className={styles.statItemIcon}>
            <BsPersonXFill size={40} color="#000" />
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Deactivated Mentees</h3>
            <p>{dashboardData.deactivatedMentees}</p>
          </div>
        </div>
        <div className={`${styles.statItem} ${styles.totalMenteesUnique}`}>
          <div className={styles.statItemIcon}>
            <BsPeopleFill size={40} color="#000" />
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Total Mentees</h3>
            <p>{dashboardData.totalMentees}</p>
          </div>
        </div>
        <div className={`${styles.statItem} ${styles.activatedMentorsUnique}`}>
          <div className={styles.statItemIcon}>
            <BsPersonCheckFill size={40} color="#000" />
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Activated Mentors</h3>
            <p>{dashboardData.activatedMentors}</p>
          </div>
        </div>
        <div className={`${styles.statItem} ${styles.deactivatedMentorsUnique}`}>
          <div className={styles.statItemIcon}>
            <BsPersonXFill size={40} color="#000" />
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Deactivated Mentors</h3>
            <p>{dashboardData.deactivatedMentors}</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statItemIcon}>
            <BsPeopleFill size={40} color="#000" />
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Total Mentors</h3>
            <p>{dashboardData.totalMentors}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartGrid}>
        <div className={`${styles.chart} ${styles.pieChartContainer}`}>
          <h4 className={styles.chartTitle}>Classes Allocation</h4>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={80}
                  innerRadius={60}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.legend}>
              {pieData.map((entry, index) => (
                <div key={`legend-${index}`} className={styles.legendItem}>
                  <div
                    className={styles.colorBox}
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <span>
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.chart}>
          <h4 className={styles.chartTitle}>Resolved Complaints in %</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mentors"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chart}>
          <h4 className={styles.chartTitle}>AI Student Engagement</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

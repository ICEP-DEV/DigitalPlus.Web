import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import styles from './DashboardContent.module.css';

const DashboardContent = () => {
  const pieData = [
    { name: 'Contact', value: 60 },  // Contact Classes (60%)
    { name: 'Online', value: 40 },   // Online Classes (40%)
  ];

  const colors = ['#FF6347', '#FFA500'];  // Red for Contact and Orange for Online

  const lineData = [
    { date: '7/24', mentors: 50 },
    { date: '7/25', mentors: 45 },
    { date: '7/26', mentors: 40 },
    { date: '7/27', mentors: 35 },
    { date: '7/28', mentors: 30 },
    { date: '7/29', mentors: 35 },
    { date: '7/30', mentors: 40 },
    { date: '7/31', mentors: 45 },
    { date: '8/1', mentors: 50 },
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

  const dailyBarData = [
    { day: 'Monday', activity: 80 },
    { day: 'Tuesday', activity: 70 },
    { day: 'Wednesday', activity: 40 },
    { day: 'Thursday', activity: 60 },
    { day: 'Friday', activity: 90 },
  ];

  const mentorsPerModuleData = [
    { module: 'PPA106', mentors: 10 },
    { module: 'TPG201', mentors: 8 },
    { module: 'ISY34BT', mentors: 5 },
    { module: 'IDC30BT', mentors: 7 },
    { module: 'DSO34BT', mentors: 6 },
  ];

  const usersPerDayData = [
    { date: '7/24', users: 100 },
    { date: '7/25', users: 120 },
    { date: '7/26', users: 150 },
    { date: '7/27', users: 170 },
    { date: '7/28', users: 140 },
    { date: '7/29', users: 160 },
    { date: '7/30', users: 180 },
    { date: '7/31', users: 200 },
    { date: '8/1', users: 220 },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.statItem}>
          <div className={styles.statItemIcon}>👥</div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Total Students</h3>
            <p>300</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statItemIcon}>👥</div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Activated Mentors</h3>
            <p>45</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statItemIcon}>👥</div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Deactivated Mentors</h3>
            <p>5</p>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statItemIcon}>👥</div>
          <div className={styles.stat}>
            <h3 className={styles.statItemTitle}>Total Mentors</h3>
            <p>50</p>
          </div>
        </div>
      </div>

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
                  <div className={styles.colorBox} style={{ backgroundColor: colors[index] }}></div>
                  <span>{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.chart}>
          <h4 className={styles.chartTitle}>Weekly Activity</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mentors" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chart}>
          <h4 className={styles.chartTitle}>Student Engagement</h4>
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

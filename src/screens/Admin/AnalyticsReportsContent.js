import React from 'react';
import styles from './AnalyticsReportsContent.module.css'; // Import the module.css file

const AnalyticsReportsContent = () => {
  return (
    <div className={styles.analyticsReportsContent}>
      <h2>Analysis Reports</h2>
      <div className={styles.reports}>
        <div className={styles.report}>
          <img src="/path-to-bar-chart.png" alt="Number of Complaints" />
          <button>Download</button>
        </div>
        <div className={styles.report}>
          <img src="/path-to-bar-chart2.png" alt="Number of Complaints" />
          <button>Download</button>
        </div>
        <div className={styles.report}>
          <img src="/path-to-line-chart.png" alt="Number of Complaints" />
          <button>Download</button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReportsContent;

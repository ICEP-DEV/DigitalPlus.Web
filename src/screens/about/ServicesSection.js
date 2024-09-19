import React from 'react';
import styles from './ServicesSection.module.css'; 

const ServicesSection = () => {
  return (
    <section className={styles.servicesSection}>
      <h2>SERVICES</h2>
      <ul>
        <li>Key Possession Notification</li>
        <li>Mentor Behavior Reporting Platform</li>
        <li>Mentor's Schedule and Expertise View</li>
        <li>Mentor's Performance Evaluation</li>
      </ul>
    </section>
  );
};

export default ServicesSection;

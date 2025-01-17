// React Component for the Mentorship Landing Page
import React from 'react';
import styles from './ModuleLandingPage.module.css'; // CSS module

const ModuleLandingPage = () => {
  return (
    <div className={styles["md-container"]}>
      <header className={styles["md-header"]}>
        <h1 className={styles["md-title"]}>Mentoring the Leaders of Tomorrow</h1>
        <p className={styles["md-subtitle"]}>Your guidance can shape futures and create impactful change.</p>
      </header>

      <section className={styles["md-section"]}>  
        <div className={styles["md-content"]}>
          <h2>Why Your Mentorship is Invaluable</h2>
          <p>
            As a mentor, you have the unique opportunity to share your expertise, inspire confidence,
            and guide mentees towards achieving their potential. Your experience becomes the bridge
            to their success, fostering growth and innovation.
          </p>
        </div>
      </section>

      <section className={styles["md-features"]}>  
        <h2>Benefits of Being a Mentor</h2>
        <ul>
          <li>Enhance your leadership and coaching skills</li>
          <li>Expand your professional network</li>
          <li>Leave a lasting impact on someone’s career</li>
        </ul>
      </section>

      <footer className={styles["md-footer"]}>
        <p>&copy; 2025 Mentorship Program. Empowering growth, one connection at a time.</p>
      </footer>
    </div>
  );
};

export default ModuleLandingPage;

// React Component for the Mentorship Landing Page
import React from 'react';
import styles from './ModuleInfo.module.css'; // CSS module

const ModuleInfo = () => {
  return (
    <div className={styles["mi-container"]}>
      <header className={styles["mi-header"]}>
        <h1 className={styles["mi-title"]}>Empowering the Future Through Mentorship</h1>
        <p className={styles["mi-subtitle"]}>Discover the transformative power of guidance and growth.</p>
      </header>

      <section className={styles["mi-section"]}>  
       
        <div className={styles["mi-content"]}>
          <h2>Why Mentorship Matters</h2>
          <p>
            Mentorship fosters growth, builds confidence, and empowers individuals to achieve their
            goals. By connecting mentors and mentees, we create opportunities for shared learning,
            personal development, and community building.
          </p>
        </div>
      </section>

      <section className={styles["mi-features"]}>  
        <h2>Benefits of Mentorship</h2>
        <ul>
          <li>Improved skills and knowledge</li>
          <li>Increased confidence and motivation</li>
          <li>Building meaningful connections</li>
        </ul>
      </section>

      <footer className={styles["mi-footer"]}>
        <p>&copy; 2025 Mentorship Program. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ModuleInfo;

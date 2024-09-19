import React from 'react';
import styles from './CoreValuesSection.module.css';

const CoreValuesSection = () => {
  return (
    <section className={styles.coreValuesSection}>
      <h2>OUR CORE VALUES</h2>
      <div className={styles.values}>
        <div className={styles.value}>
          <h3>
            <i className="fas fa-search fa-2x"></i>
            <span>TRANSPARENCY</span>
          </h3>
          <p>
            We are committed to open communication and clarity in all our processes. Our digital notification system ensures that key possession and mentor availability are communicated in real-time, fostering an environment of trust and reliability.
          </p>
        </div>
        <div className={styles.value}>
          <h3>
            <i className="fas fa-universal-access fa-2x"></i>
            <span>ACCESSIBILITY</span>
          </h3>
          <p>
            We believe that every student should have easy access to the support they need. Our mentor profile system and real-time location tracking ensure that students can quickly and effortlessly find the right mentor for their needs.
          </p>
        </div>
        <div className={styles.value}>
          <h3>
            <i className="fas fa-handshake fa-2x"></i>
            <span>COLLABORATION</span>
          </h3>
          <p>
            We value the power of teamwork and cooperation. Our system fosters a collaborative environment where students and mentors work together towards common goals, creating a supportive and productive learning atmosphere.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;

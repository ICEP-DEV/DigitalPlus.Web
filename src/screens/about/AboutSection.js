import React from 'react';
import styles from './AboutSection.module.css';
import aboutImage from '../../Assets/aboutImage.jpg'; // Adjust the path accordingly

const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.aboutContent}>
        <h2>ABOUT US</h2>
        <p>
          Welcome to our Mentor Support Platform, a dedicated space designed to enhance the mentorship experience for both mentors and mentees. We understand that mentorship is more than just guidance; it is a transformative journey that fosters growth, learning, and lasting relationships. Recognizing the vital role that mentorship plays in academic success and personal development, we have crafted a comprehensive suite of tools and resources to support and empower both mentors and mentees at every step.
        </p>
      </div>
      <div className={styles.images}>
        <img src={aboutImage} alt="Mentorship Team" />
      </div>
    </section>
  );
};

export default AboutSection;

import React from 'react';
import Header from './Header';
import AboutSection from './AboutSection';
import MissionSection from './MissionSection';
import CoreValuesSection from './CoreValuesSection';
import ServicesSection from './ServicesSection';
import Footer from './Footer';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div>
      <Header />
      <div className={styles['main-content']}>
        <AboutSection />
        <MissionSection />
        <CoreValuesSection />
        <ServicesSection />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;

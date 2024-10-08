
import React from "react";
import VideoLandingPageHeader from "./Header/VideoLandingPageHeader";
import Footer from "./Footer/Footer";
import styles from './VideoLandingPage.module.css';
import useTypingEffect from './useTypingEffect';

// Import your local video and background image
import WE_MEN_TOR_CLIP from '../Mentor/Assets/WE_MEN_TOR_CLIP.mp4';
import VideoClip from '../Mentor/Assets/VideoClip.mp4';
import AboutBG from '../Mentor/Assets/AboutBG.jpg';
import AboutImage from '../Mentor/Assets/AboutImage.jpg';
import MissionImage from '../Mentor/Assets/MissionImage.jpg';

const VideoLandingPage = () => {
  const typingSpeed = 100; // Typing speed (ms)
  const erasingSpeed = 50; // Erasing speed (ms)
  const combinedText = "WHERE YOUR SUCCESS IS OUR COMMITMENT.";
  const displayText = useTypingEffect(combinedText, typingSpeed, erasingSpeed);

  return (
    <div>
      <VideoLandingPageHeader />
      
      {/* Video Section */}
      <div id="carousel-section" className={styles.carouselSection}>
        {/* Local Video */}
        <video className={styles.fullscreenVideo} autoPlay loop muted>
          <source src={VideoClip} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Full-page transparent overlay */}
        <div className={styles.overlay}></div>
        
        {/* Overlaying Text */}
        <div className={styles.overlayTextContainer}>
          <h4 className={styles.fadeIn}>
            <span>WELCOME TO THE</span>
          </h4>
          <h1 className={styles.fadeIn}>
            <span className={styles.wementor}>WE-MEN-TOR</span> <span className={styles.platform}>PLATFORM</span>
          </h1>
          <p>
            <span className={styles.typing}>{displayText}</span>
          </p>
        </div>
        
        {/* Buttons below the overlay text */}
        <div className={styles.buttonContainer}>
          < a href ='/AnnouncePage' ><button className={styles.primaryButton}>View Announcement</button></a>
          < a href ='/RosterPg' ><button className={styles.primaryButton}>View Roster</button></a>
        </div>

        {/* Highlights Scroller at Bottom */}
        <div className={styles.highlightsScroller}>
          <div className={styles.highlightsContent}>
            #Mentorship &nbsp;&nbsp;|&nbsp;&nbsp; #FutureReady &nbsp;&nbsp;|&nbsp;&nbsp; 
            #Commitment &nbsp;&nbsp;|&nbsp;&nbsp; #EmpoweringMentees &nbsp;&nbsp;|&nbsp;&nbsp; 
            #FromGood2Great &nbsp;&nbsp;|&nbsp;&nbsp; #Success
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        id="about-section"
        className={styles.aboutSection}
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        {/* Dark Slate Grey Overlay */}
        <div className={styles.aboutOverlay}></div>

        {/* Content */}
        <div className={styles.aboutContent}>
          <h2 className={styles.aboutHeading}>About Us</h2>
          <div className={styles.aboutParagraph}>
            <p>
              Welcome to our Mentor Support Platform, a dedicated space designed
              to enhance the mentorship experience for both mentors and mentees.
              We understand the vital role that mentorship plays in academic
              success and personal growth, which is why we have developed a
              range of tools to address common challenges and streamline the
              mentoring process.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className={styles.aboutContent}>
          <img src={AboutImage} alt="About Us" className={styles.aboutImage} />
        </div>
      </div>

      {/* Mission Section */}
      <div
        id="mission-section"
        className={styles.missionSection}
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        <div className={styles.missionOverlay}></div>

        <div className={styles.missionContent}>
          <h2 className={styles.missionHeading}>Our Mission</h2>
          <div className={styles.missionParagraph}>
            <p>
              Our mission is to empower both mentors and mentees to reach their
              full potential by fostering meaningful connections, offering the
              tools they need to grow, and providing a platform that simplifies
              the mentorship process, making it more accessible to everyone.
            </p>
          </div>
        </div>

        <div className={styles.missionContent}>
          <img src={MissionImage} alt="Our Mission" className={styles.missionImage} />
        </div>
      </div>

      {/* Core Values Section */}
      <div
        id="core-values-section"
        className={styles.coreValuesSection}
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        <div className={styles.coreValuesOverlay}></div>

        <div className={styles.coreValuesContent}>
          <h2 className={styles.coreValuesHeading}>Our Core Values</h2>

          <div className={styles.coreValueContainer}>
            <div className={styles.coreValueCard}>
              <h3 className={styles.coreValueHeading}>Collaboration</h3>
              <p className={styles.coreValueParagraph}>
                We believe in the power of collaboration and strive to build a
                strong community of mentors and mentees who can learn from one
                another.
              </p>
            </div>
            <div className={styles.coreValueCard}>
              <h3 className={styles.coreValueHeading}>Growth</h3>
              <p className={styles.coreValueParagraph}>
                Growth is at the heart of mentorship. We are committed to
                providing resources and tools that foster both personal and
                professional growth.
              </p>
            </div>
            <div className={styles.coreValueCard}>
              <h3 className={styles.coreValueHeading}>Empowerment</h3>
              <p className={styles.coreValueParagraph}>
                We aim to empower mentors and mentees by equipping them with the
                necessary skills and knowledge to succeed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div
        id="services-section"
        className={styles.servicesSection}
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        <div className={styles.servicesOverlay}></div>

        <div className={styles.servicesContent}>
          <h2 className={styles.servicesHeading}>Our Services</h2>
          <div className={styles.servicesParagraph}>
            <p>
              From personalized guidance to structured goal-setting, our platform
              offers a variety of services that cater to the unique needs of both
              mentors and mentees.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VideoLandingPage;

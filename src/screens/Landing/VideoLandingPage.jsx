import React, { useState, useEffect } from "react";
import VideoLandingPageHeader from "./Header/VideoLandingPageHeader";
import Footer from "./Footer/Footer";
import styles from "./VideoLandingPage.module.css";
import useTypingEffect from "./useTypingEffect";
import { useScrollAnimation } from "./useScrollAnimation"; 

// Import your local video and background image
import VideoClip from "../Mentor/Assets/VideoClip.mp4";
import AboutBG from "../Mentor/Assets/AboutBG.jpg";
import AboutImage from "../Mentor/Assets/AboutImage.jpg";
import MissionImage from "../Mentor/Assets/MissionImage.jpg";
import master from "./Assets/master.jpg";
import picture1 from "./Assets/picture1.jpg";

const VideoLandingPage = () => {
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const combinedText = "WHERE YOUR SUCCESS IS OUR COMMITMENT.";
  const displayText = useTypingEffect(combinedText, typingSpeed, erasingSpeed);

  const [currentImage, setCurrentImage] = useState(master);
  const [animateSlide, setAnimateSlide] = useState(false);

  // Create refs for each section with adjusted thresholds
  const aboutRef = useScrollAnimation(0.2);
  const missionRef = useScrollAnimation(0.2);
  const coreValuesRef = useScrollAnimation(0.1);
  const servicesRef = useScrollAnimation(0.1);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setAnimateSlide(true);
      setCurrentImage((prevImage) =>
        prevImage === master ? picture1 : master
      );
    }, 5000);

    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    if (animateSlide) {
      const timeout = setTimeout(() => setAnimateSlide(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [animateSlide]);

  return (
    <div>
      <VideoLandingPageHeader />

      {/* Video Section */}
      <div id="carousel-section" className={styles.carouselSection}>
        <video className={styles.fullscreenVideo} autoPlay loop muted>
          <source src={VideoClip} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.overlay}></div>
        <div className={styles.overlayTextContainer}>
          <h4 className={styles.fadeIn}>
            <span>WELCOME TO THE</span>
          </h4>
          <h1 className={styles.fadeIn}>
            <span className={styles.wementor}>WE-MEN-TOR</span>{" "}
            <span className={styles.platform}>PLATFORM</span>
          </h1>
          <p>
            <span className={styles.typing}>{displayText}</span>
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <a href="/AnnouncePage">
            <button className={styles.primaryButton}>View Announcement</button>
          </a>
          <a href="/RosterPg">
            <button className={styles.primaryButton}>View Roster</button>
          </a>
        </div>
        <div className={styles.highlightsScroller}>
          <div className={styles.highlightsContent}>
            #Mentorship &nbsp;&nbsp;|&nbsp;&nbsp; #FutureReady
            &nbsp;&nbsp;|&nbsp;&nbsp; #Commitment &nbsp;&nbsp;|&nbsp;&nbsp;
            #EmpoweringMentees &nbsp;&nbsp;|&nbsp;&nbsp; #FromGood2Great
            &nbsp;&nbsp;|&nbsp;&nbsp; #Success
          </div>
        </div>
      </div>

      {/* About Section */}
      <div 
        ref={aboutRef}
        id="about-section" 
        className={styles.aboutSection} 
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        <div className={styles.aboutOverlay}></div>
        <div className={styles.aboutContent}>
          <h2 
            className={styles.aboutHeading}
            data-animate="fadeInUp"
            data-delay="0.2"
          >
            About Us
          </h2>
          <div 
            className={styles.aboutParagraph}
            data-animate="fadeInUp"
            data-delay="0.4"
          >
            <p>
              Welcome to our Mentor Support Platform, a dedicated space designed
              to enhance the mentorship experience for both mentors and mentees.
              We understand the vital role that mentorship plays in academic
              success and personal growth.
            </p>
            <p>
              We recognize the challenges that can arise in mentorship
              relationships, such as scheduling conflicts, communication
              barriers, and goal tracking. To overcome these, our platform
              provides user-friendly tools for organizing meetings.
            </p>
          </div>
        </div>
        <div className={styles.aboutContent}>
          <img
            src={currentImage}
            alt="About Us"
            className={styles.aboutImage}
            data-animate="fadeInUp"
            data-delay="0.6"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div 
        ref={missionRef}
        id="mission-section" 
        className={styles.missionSection} 
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        <div className={styles.missionOverlay}></div>
        <div className={styles.missionContent}>
          <h2 
            className={styles.missionHeading}
            data-animate="fadeInUp"
            data-delay="0.2"
          >
            Our Mission
          </h2>
          <div 
            className={styles.missionParagraph}
            data-animate="fadeInUp"
            data-delay="0.4"
          >
            <p>
              Our mission is to create a supportive and transparent environment
              where mentors can effectively guide mentees, and mentees can easily
              access the assistance they need. We aim to empower both parties by
              providing the resources and systems necessary to foster meaningful
              mentor-mentee relationships.
            </p>
          </div>
        </div>
        <div className={styles.missionContent}>
          <img
            src={MissionImage}
            alt="Our Mission"
            className={styles.missionImage}
            data-animate="fadeInUp"
            data-delay="0.6"
          />
        </div>
      </div>

      {/* Core Values Section */}
      <div
        ref={coreValuesRef}
        id="core-values-section"
        className={styles.coreValuesSection}
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        <div className={styles.coreValuesOverlay}></div>
        <div className={styles.coreValuesContent}>
          <h2 
            className={styles.coreValuesHeading}
            data-animate="fadeInUp"
            data-delay="0.2"
          >
            Our Core Values
          </h2>
          <div className={styles.coreValueContainer}>
            <div 
              className={styles.coreValueCard}
              data-animate="fadeInUp"
              data-delay="0.3"
            >
              <h3 className={styles.coreValueHeading}>TRANSPARENCY</h3>
              <p className={styles.coreValueParagraph}>
                We are committed to open communication and clarity in all our
                processes. Our digital notification system ensures that key
                possession and mentor availability are communicated in
                real-time, fostering an environment of trust and reliability.
              </p>
            </div>
            <div 
              className={styles.coreValueCard}
              data-animate="fadeInUp"
              data-delay="0.4"
            >
              <h3 className={styles.coreValueHeading}>ACCESSIBILITY</h3>
              <p className={styles.coreValueParagraph}>
                We believe that every student should have easy access to the
                support they need. Our mentor profile system and real-time
                location tracking ensure that students can quickly and
                effortlessly find the right mentor for their needs.
              </p>
            </div>
            <div 
              className={styles.coreValueCard}
              data-animate="fadeInUp"
              data-delay="0.5"
            >
              <h3 className={styles.coreValueHeading}>COLLABORATION</h3>
              <p className={styles.coreValueParagraph}>
                We value the power of teamwork and cooperation. Our system
                fosters a collaborative environment where students and mentors
                work together towards common goals, creating a supportive and
                productive learning atmosphere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div
        ref={servicesRef}
        id="services-section"
        className={styles.servicesSection}
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        <div className={styles.servicesOverlay}></div>
        <div className={styles.servicesContent}>
          <h2 
            className={styles.servicesHeading}
            data-animate="fadeInUp"
            data-delay="0.2"
          >
            Our Services
          </h2>
          <div className={styles.serviceContainer}>
            <div 
              className={styles.serviceCard}
              data-animate="fadeInUp"
              data-delay="0.3"
            >
              <h3 className={styles.serviceTitle}>Mentorship Matching</h3>
              <p className={styles.serviceDescription}>
                Our platform uses advanced algorithms to pair mentors and mentees based on their goals, skills, and interests, ensuring a productive mentorship relationship.
              </p>
            </div>
            <div 
              className={styles.serviceCard}
              data-animate="fadeInUp"
              data-delay="0.4"
            >
              <h3 className={styles.serviceTitle}>Real-Time Communication</h3>
              <p className={styles.serviceDescription}>
                Communicate seamlessly with built-in messaging and video conferencing tools, designed to enhance interaction and minimize miscommunication.
              </p>
            </div>
            <div 
              className={styles.serviceCard}
              data-animate="fadeInUp"
              data-delay="0.5"
            >
              <h3 className={styles.serviceTitle}>Progress Tracking</h3>
              <p className={styles.serviceDescription}>
                Monitor your goals and milestones with our progress tracking system, designed to keep both mentors and mentees accountable and motivated.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoLandingPage;
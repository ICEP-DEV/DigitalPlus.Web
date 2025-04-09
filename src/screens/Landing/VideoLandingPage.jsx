import React, { useState, useEffect } from "react"; // Import useState and useEffect
import VideoLandingPageHeader from "./Header/VideoLandingPageHeader";
import Footer from "./Footer/Footer";
import styles from "./VideoLandingPage.module.css";
import useTypingEffect from "./useTypingEffect";

// Import your local video and background image

import VideoClip from "../Mentor/Assets/VideoClip.mp4";
import AboutBG from "../Mentor/Assets/AboutBG.jpg";
import AboutImage from "../Mentor/Assets/AboutImage.jpg";
import MissionImage from "../Mentor/Assets/MissionImage.jpg";
import master from "./Assets/master.jpg"; // Updated to master.jpg
import picture1 from "./Assets/picture1.jpg";

const VideoLandingPage = () => {
  const typingSpeed = 100; // Typing speed (ms)
  const erasingSpeed = 50; // Erasing speed (ms)
  const combinedText = "WHERE YOUR SUCCESS IS OUR COMMITMENT.";
  const displayText = useTypingEffect(combinedText, typingSpeed, erasingSpeed);

  // State to hold the current image
  const [currentImage, setCurrentImage] = useState(master);
  const [animateSlide, setAnimateSlide] = useState(false); // New state to trigger animation

  // Effect to alternate images
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setAnimateSlide(true); // Trigger animation when image changes
      setCurrentImage((prevImage) =>
        prevImage === master ? picture1 : master
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(imageInterval); // Clean up the interval on component unmount
  }, []);

  // Remove animation class after it finishes
  useEffect(() => {
    if (animateSlide) {
      const timeout = setTimeout(() => setAnimateSlide(false), 1000); // Wait for 1s (duration of the slide)
      return () => clearTimeout(timeout);
    }
  }, [animateSlide]);

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
            <span className={styles.wementor}>WE-MEN-TOR</span>{" "}
            <span className={styles.platform}>PLATFORM</span>
          </h1>
          <p>
            <span className={styles.typing}>{displayText}</span>
          </p>
        </div>

        {/* Buttons below the overlay text */}
        <div className={styles.buttonContainer}>
          <a href="/AnnouncePage">
            <button className={styles.primaryButton}>View Announcement</button>
          </a>
          <a href="/RosterPg">
            <button className={styles.primaryButton}>View Roster</button>
          </a>
        </div>

        {/* Highlights Scroller at Bottom */}
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
            <p>
              We recognize the challenges that can arise in mentorship
              relationships, such as scheduling conflicts, communication
              barriers, and goal tracking. To overcome these, our platform
              provides user-friendly tools for organizing meetings, setting
              milestones, and facilitating effective communication. By
              streamlining these processes, we empower mentors to focus on
              providing guidance and mentees to maximize their learning
              experience.
            </p>
          </div>
        </div>

        {/* Image with animation */}
        <div className={styles.aboutContent}>
          <img
            src={currentImage}
            alt="About Us"
            className={`${styles.aboutImage} ${
              animateSlide ? styles["slide-in"] : ""
            }`} // Apply slide-in class conditionally
          />
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
              Our mission is to create a supportive and transparent environment
              where mentors can effectively guide mentee , and mentee can easily
              access the assistance they need. We aim to empower both parties by
              providing the resources and systems necessary to foster meaningful
              mentor-mentee relationships
            </p>
          </div>
        </div>

        <div className={styles.missionContent}>
          <img
            src={MissionImage}
            alt="Our Mission"
            className={styles.missionImage}
          />
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
              <h3 className={styles.coreValueHeading}>TRANSPARENCY</h3>
              <p className={styles.coreValueParagraph}>
                We are committed to open communication and clarity in all our
                processes. Our digital notification system ensures that key
                possession and mentor availability are communicated in
                real-time, fostering an environment of trust and reliability.
              </p>
            </div>
            <div className={styles.coreValueCard}>
              <h3 className={styles.coreValueHeading}>ACCESSIBILITY</h3>
              <p className={styles.coreValueParagraph}>
                We believe that every student should have easy access to the
                support they need. Our mentor profile system and real-time
                location tracking ensure that students can quickly and
                effortlessly find the right mentor for their needs.
              </p>
            </div>
            <div className={styles.coreValueCard}>
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
        id="services-section"
        className={styles.servicesSection}
        style={{ backgroundImage: `url(${AboutBG})` }}
      >
        <div className={styles.servicesOverlay}></div>

        <div className={styles.servicesContent}>
          <h2 className={styles.servicesHeading}>Our Services</h2>
          <div className={styles.serviceContainer}>
            {/* Service Card 1 */}
            <div className={styles.serviceCard}>
            <h3 className={styles.serviceTitle}>Mentorship Matching</h3>
            <p className={styles.serviceDescription}>
              Our platform uses advanced algorithms to pair mentors and mentees based on their goals, skills, and interests, ensuring a productive mentorship relationship.
            </p>
</div>
{/* Service Card 2 */}
<div className={styles.serviceCard}>
  <h3 className={styles.serviceTitle}>Real-Time Communication</h3>
  <p className={styles.serviceDescription}>
    Communicate seamlessly with built-in messaging and video conferencing tools, designed to enhance interaction and minimize miscommunication.
  </p>
</div>
{/* Service Card 3 */}
<div className={styles.serviceCard}>
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

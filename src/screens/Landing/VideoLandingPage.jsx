import React from "react";
import { Carousel } from "react-bootstrap";
import VideoLandingPageHeader from "./Header/VideoLandingPageHeader";
import Footer from "./Footer/Footer";

// Import your local video and background image
import WE_MEN_TOR_CLIP from '../Mentor/Assets/WE_MEN_TOR_CLIP.mp4';
import AboutBG from '../Mentor/Assets/AboutBG.jpg'; // Ensure the correct path to your image
import AboutImage from '../Mentor/Assets/AboutImage.jpg';
import MissionImage from '../Mentor/Assets/MissionImage.jpg';
import background from '../Mentor/Assets/background.jpg';

const VideoLandingPage = () => {
  return (
    <div>
      {/* Carousel Section */}
      <div
        id="carousel-section"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh', // Full viewport height
          overflow: 'hidden',
        }}
      >
        <VideoLandingPageHeader />
        {/* Carousel without controls */}
        <Carousel controls={false}>
          {/* First Slide - Local Video */}
          <Carousel.Item>
            <video
              className="d-block w-100"
              autoPlay
              loop
              muted
              style={{ height: "100%", objectFit: "cover" }} // Full height video
            >
              <source src={WE_MEN_TOR_CLIP} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Carousel.Item>
        </Carousel>

        {/* Full-page transparent overlay in front */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(6, 7, 8, 0.8)', 
            zIndex: 1, // In front of the carousel
          }}
        ></div>
      </div>

      {/* About Section */}
      <div
        id="about-section"
        style={{
          position: 'relative',
          padding: '50px 20px',
          backgroundImage: `url(${AboutBG})`, // Background image fixed
          backgroundSize: 'cover', // Cover the entire section
          backgroundPosition: 'center', // Center the image
          display: 'flex', // Use flexbox to align content horizontally
          alignItems: 'center', // Vertically align content
          justifyContent: 'space-between', // Space between text and image
          gap: '20px', // Gap between text and image
        }}
      >
        {/* Dark Slate Grey Overlay behind the text */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(6, 7, 8, 0.65)', // Dark slate grey with 80% transparency
            zIndex: 1, // Behind the text
          }}
        ></div>

        {/* Content with higher z-index to sit in front of the overlay */}
        <div style={{ position: 'relative', zIndex: 2, flex: '1' }}>
          <h2
            style={{
              fontSize: '2.5rem', // Large heading size
              color: '#fff', // White text for contrast
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            About Us
          </h2>

          {/* Container for the About paragraph */}
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto 20px 0', // Align the container to the left
              padding: '20px',
              borderRadius: '8px', // Rounded corners
            //   backgroundColor: 'rgba(6, 7, 8, 0.8)',
            }}
          >
            <p
              style={{
                fontSize: '1.2rem', // Paragraph font size
                color: '#fff', // Lighter text color for readability
                lineHeight: '1.6',
                textAlign: 'left', // Center-align the text
              }}
            >
              Welcome to our Mentor Support Platform, a dedicated space designed to enhance the mentorship experience for both mentors and mentees. We understand the vital role that mentorship plays in academic success and personal growth, which is why we have developed a range of tools to address common challenges and streamline the mentoring process.
            </p>
          </div>
        </div>

        {/* Image on the right side */}
        <div style={{ position: 'relative', zIndex: 2, flex: '1' }}>
          <img
            src={AboutImage}
            alt="About Us"
            style={{
              maxWidth: '100%', // Ensure the image doesn't overflow
              height: 'auto', // Maintain aspect ratio
              borderRadius: '8px', // Optional rounded corners
            }}
          />
        </div>
      </div>

      {/* Our Mission Section */}
      <div
        id="mission-section"
        style={{
          position: 'relative',
          padding: '50px 20px',
          backgroundImage: `url(${AboutBG})`, // Fixed background image path
          backgroundSize: 'cover', // Cover the entire section
          backgroundPosition: 'center', // Center the image
          display: 'flex', // Align text and image horizontally
          alignItems: 'center', // Vertically align content
          justifyContent: 'space-between', // Space between text and image
          gap: '20px', // Gap between text and image
        }}
      >
        {/* Dark Slate Grey Overlay behind the text */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(6, 7, 8, 0.65)', // Dark slate grey with 80% transparency
            zIndex: 1, // Behind the text
          }}
        ></div>

        {/* Mission Image on the left side */}
        <div style={{ position: 'relative', zIndex: 2, flex: '1' }}>
          <img
            src={MissionImage}
            alt="Our Mission"
            style={{
              maxWidth: '100%', // Ensure the image doesn't overflow
              height: '500px', // Set the height of the image
              width: 'auto', // Maintain aspect ratio
              borderRadius: '8px', // Optional rounded corners
            }}
          />
        </div>

        {/* Content with higher z-index to sit in front of the overlay */}
        <div style={{ position: 'relative', zIndex: 2, flex: '1' }}>
          <h2
            style={{
              fontSize: '2.5rem', // Large heading size
              color: '#fff', // White text for contrast
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Our Mission
          </h2>

          {/* Container for the Mission paragraph */}
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto 20px 0', // Align the container to the left
              padding: '20px',
              borderRadius: '8px', // Rounded corners
            }}
          >
            <p
              style={{
                fontSize: '1.2rem', // Paragraph font size
                color: '#fff', // White text for readability
                lineHeight: '1.6',
                textAlign: 'center', // Center-align the text
              }}
            >
              Our mission is to empower both mentors and mentees to reach their full potential by fostering meaningful connections, offering the tools they need to grow, and providing a platform that simplifies the mentorship process, making it more accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Our Core Values Section */}
 {/* Our Core Values Section */}
<div
  id="core-values-section"
  style={{
    position: 'relative',
    padding: '50px 20px',
    backgroundImage: `url(${AboutBG})`, // Same background image as previous sections
    backgroundSize: 'cover', // Cover the entire section
    backgroundPosition: 'center', // Center the image
    textAlign: 'center',
  }}
>
  {/* Dark Slate Grey Overlay behind the text */}
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(6, 7, 8, 0.65)', // Dark slate grey with 80% transparency
      zIndex: 1, // Behind the text
    }}
  ></div>

  {/* Content with higher z-index to sit in front of the overlay */}
  <div style={{ position: 'relative', zIndex: 2 }}>
    <h2
      style={{
        fontSize: '2.5rem', // Large heading size
        color: '#fff', // White text for contrast
        marginBottom: '20px',
        textAlign: 'center',
      }}
    >
      Our Core Values
    </h2>

    {/* Flexbox container for core value sections */}
    <div
      style={{
        display: 'flex', // Use flexbox to arrange items in a row
        justifyContent: 'space-between', // Space between containers
        flexWrap: 'wrap', // Wrap items to next line if necessary
        maxWidth: '1200px', // Optional max width for the section
        margin: '0 auto', // Center the flex container
      }}
    >
      {/* Container for the first core value */}
      <div
        style={{
          flex: '1', // Allow items to grow equally
          maxWidth: '300px', // Set a max width for each value
          margin: '20px', // Space around each container
          padding: '20px',
          borderRadius: '8px', // Rounded corners
          backgroundColor: 'rgba(6, 7, 8, 0.75)', // Optional background color for better contrast
        }}
      >

<h3
    style={{
      fontSize: '1.5rem', // Size of the header
      color: '#fff', // White text for contrast
      marginBottom: '10px', // Space below the header
      textAlign: 'center', // Center-align the header
    }}
  >
    TRANSPARENCY
  </h3>
        <p
          style={{
            fontSize: '0.75rem', // Paragraph font size
            color: '#fff', // White text for readability
            lineHeight: '1.6',
          }}
        >
          We are committed to open communication and clarity in all our processes. Our digital notification system ensures that key possession and mentor availability are communicated in real-time, fostering an environment of trust and reliability.
        </p>
      </div>

      {/* Container for the second core value */}
      <div
        style={{
          flex: '1', // Allow items to grow equally
          maxWidth: '300px', // Set a max width for each value
          margin: '20px', // Space around each container
          padding: '20px',
          borderRadius: '8px', // Rounded corners
          backgroundColor: 'rgba(6, 7, 8, 0.75)', // Optional background color for better contrast
        }}
      >
         <h3
    style={{
      fontSize: '1.5rem', // Size of the header
      color: '#fff', // White text for contrast
      marginBottom: '10px', // Space below the header
      textAlign: 'center', // Center-align the header
    }}
  >
    ACCESSIBILITY
  </h3>
        <p
          style={{
            fontSize: '0.75rem', // Paragraph font size
            color: '#fff', // White text for readability
            lineHeight: '1.6',
          }}
        >
         We believe that every student should have easy access to the support they need. Our mentor profile system and real-time location tracking ensure that students can quickly andeffortlessly find the right mentor for their needs.
        </p>
      </div>

      {/* Container for the third core value */}
      <div
        style={{
          flex: '1', // Allow items to grow equally
          maxWidth: '300px', // Set a max width for each value
          margin: '20px', // Space around each container
          padding: '20px',
          borderRadius: '8px', // Rounded corners
          backgroundColor: 'rgba(6, 7, 8, 0.75)', // Optional background color for better contrast
        }}
      >
         <h3
    style={{
      fontSize: '1.5rem', // Size of the header
      color: '#fff', // White text for contrast
      marginBottom: '10px', // Space below the header
      textAlign: 'center', // Center-align the header
    }}
  >
    COLLABORATION
  </h3>
        <p
          style={{
            fontSize: '0.75rem', // Paragraph font size
            color: '#fff', // White text for readability
            lineHeight: '1.6',
          }}
        >
          We value the power of teamwork and cooperation. Our system fosters a collaborative environment where students and mentors work together towards common goals, creating a supportive and productive learning atmosphere.
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Services Section */}
      <div
        id="services-section"
        style={{
          position: 'relative',
          padding: '50px 20px',
          backgroundImage: `url(${AboutBG})`, // Same background image as other sections
          backgroundSize: 'cover', // Cover the entire section
          backgroundPosition: 'center', // Center the image
          textAlign: 'center',
        }}
      >
        {/* Dark Slate Grey Overlay behind the text */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(6, 7, 8, 0.65)', // Dark slate grey with 80% transparency
            zIndex: 1, // Behind the text
          }}
        ></div>

        {/* Content with higher z-index to sit in front of the overlay */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              fontSize: '2.5rem',
              color: '#fff',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Our Services
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#fff',
              lineHeight: '1.6',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            We offer a comprehensive suite of tools and resources designed to support the mentor-mentee relationship, including goal tracking, personalized advice, and progress monitoring, all aimed at ensuring a successful mentorship journey.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VideoLandingPage;

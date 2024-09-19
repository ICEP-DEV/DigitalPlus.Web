import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaCalendarAlt, FaUserPlus, FaCommentDots, FaRobot, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Header from '../../components/Header';
import styles from './FeedbackPage.module.css'; // Import the CSS module

const FeedbackPage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [comment, setComment] = useState('');
  const [navWidth, setNavWidth] = useState(250); // Default width
  const navRef = useRef(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    alert('Feedback submitted successfully.');
    clearForm();
  };

  // Clear form fields
  const clearForm = () => {
    setName('');
    setSurname('');
    setComment('');
  };

  const handleMouseDown = (e) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newWidth = e.clientX;
    if (newWidth > 100 && newWidth < window.innerWidth - 100) {
      setNavWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    // Set the initial width of the navigation bar on mount
    if (navRef.current) {
      navRef.current.style.width = `${navWidth}px`;
    }
  }, [navWidth]);

  return (
    <div className={styles.pageContainer}>
      <Header />

      {/* Main content container */}
      <div className={styles.contentWrapper}>
        {/* Side Navigation Bar */}
        <nav className={styles.sideNav} ref={navRef}>
          <ul>
            <li>
              <FaHome className={styles.navIcon} />
              <Link to="/">Home</Link>
            </li>
            <li>
              <FaBook className={styles.navIcon} />
              <Link to="/module">Module</Link>
            </li>
            <li>
              <FaCalendarAlt className={styles.navIcon} />
              <Link to="/booking">Booking</Link>
            </li>
            <li>
              <FaUserPlus className={styles.navIcon} />
              <Link to="/register">Register</Link>
            </li>
            <li>
              <FaCommentDots className={styles.navIcon} />
              <Link to="/feedback">Feedback</Link>
            </li>
            <li>
              <FaRobot className={styles.navIcon} />
              <Link to="/ai">Use AI</Link>
            </li>
            <li>
              <FaCog className={styles.navIcon} />
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <FaSignOutAlt className={styles.navIcon} />
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
          {/* Resizer */}
          <div
            className={styles.resizer}
            onMouseDown={handleMouseDown}
          />
        </nav>

        {/* Feedback Section */}
        <div className={styles.feedbackSection}>
          <h1 className={styles.feedbackTitle}>FEEDBACK</h1>
          <p className={styles.anonymityNotice}>
            Your feedback is important to us and will remain anonymous.
          </p>
          <form onSubmit={handleSubmit} className={styles.feedbackForm}>
            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <label htmlFor="name">Mentor's Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="surname">Mentor's Surname</label>
                <input
                  type="text"
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton}>SUBMIT</button>
              <button type="button" onClick={clearForm} className={styles.clearButton}>CLEAR</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

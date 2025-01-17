import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useEffect, useState } from 'react'; // Import useEffect and useState hooks
import styles from './NavBar.module.css'; // Import the CSS module
import tutLogo_removebg_preview from '../Assets/tutLogo_removebg_preview.png'; // Logo
import { BsPersonFill } from 'react-icons/bs'; // Profile icon
import { BsKey } from 'react-icons/bs'; // Key icon
import KeyPageAlert from '../KeyPageAlert'; // Import KeyPageAlert component

function NavBar({ onKeyIconClick }) {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [displayName, setDisplayName] = useState('PROFILE'); // State for the display name

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle modal closing
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // UseEffect to retrieve firstName and lastName from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Get the user object from localStorage
    if (storedUser && storedUser.firstName && storedUser.lastName) {
      // Extract initials from the firstName
      const initials = storedUser.firstName
        .split(' ') // Split by spaces to handle multiple words
        .map(name => name[0]) // Get the first letter of each word
        .join(''); // Join the initials together

      // Set display name as initials + last name
      setDisplayName(`${initials} ${storedUser.lastName}`);
    }
  }, []);

  // Function to handle the key icon click
  const handleKeyIconClick = () => {
    if (onKeyIconClick) onKeyIconClick(); // Open the modal when key icon is clicked
  };

  return (
    <div className={styles.navBar}>
      <br />
      <img src={tutLogo_removebg_preview} alt="Logo" className={styles.appLogo} />

      {/* Group Key and Profile Icons */}
      <div className={styles.iconGroup}>
        <div className={styles.notificationContainer}>
          <BsKey className={styles.notificationIcon} onClick={handleKeyIconClick} />
        </div>
        <div className={styles.profileContainer}>
          <BsPersonFill className={styles.profileIcon} />
          <span className={styles.profileText}>{displayName}</span>
        </div>
      </div>

      {/* KeyPageAlert Modal */}
      {isModalOpen && <KeyPageAlert showModal={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
}

export default NavBar;

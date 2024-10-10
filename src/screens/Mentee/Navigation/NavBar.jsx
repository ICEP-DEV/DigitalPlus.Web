import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useEffect, useState } from 'react'; // Import useEffect and useState hooks
import styles from "./NavBar.module.css";
import imageLogo from "../Assets/tutLogo-removebg-preview.png";
import profileImage from "../../../Assets/profile.jpeg"; // Import the profile image

function NavBar() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [displayName, setDisplayName] = useState('PROFILE'); // Initialize the state for the display name

  // UseEffect to get firstName and lastName from localStorage
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

  // Function to handle profile click
  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <div className={styles.navBar}>
      <br />
      <img src={imageLogo} alt="Logo" className={styles.appLogo} />

      {/* Profile Image with description */}
      <div className={styles.profileContainer} onClick={handleProfileClick}>
        <img src={profileImage} alt="Profile" className={styles.profileIcon} /> {/* Use the profile image */}
        <span className={styles.profileText}>{displayName}</span>
      </div>
    </div>
  );
}

export default NavBar;

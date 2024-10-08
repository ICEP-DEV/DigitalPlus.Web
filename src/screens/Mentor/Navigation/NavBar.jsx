import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useEffect, useState } from 'react'; // Import useEffect and useState hooks
import styles from "./NavBar.module.css";
import tutLogo_removebg_preview from "../Assets/tutLogo_removebg_preview.png";
import { BsPersonFill } from "react-icons/bs";

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
  // const handleProfileClick = () => {
  //   navigate('/settings'); // Navigate to the profile page
  // };

  return (
    <div className={styles.navBar}>
      <br />
      <img src={tutLogo_removebg_preview} alt="Logo" className={styles.appLogo} />

      Profile Icon with description
      <div className={styles.profileContainer} >
        <BsPersonFill className={styles.profileIcon} />
        <span className={styles.profileText}>{displayName}</span>
      </div>
    </div>
  );
}

export default NavBar;

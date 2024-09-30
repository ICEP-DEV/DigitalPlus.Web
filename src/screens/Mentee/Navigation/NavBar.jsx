import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import styles from "./NavBar.module.css";
import imageLogo from "../Assets/tutLogo-removebg-preview.png";
import { BsPersonFill } from "react-icons/bs";

function NavBar() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to handle profile click
  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <div className={styles.navBar}>
      <br />
      <img src={imageLogo} alt="Logo" className={styles.appLogo} />

      {/* Profile Icon with description */}
      <div className={styles.profileContainer} onClick={handleProfileClick}>
        <BsPersonFill className={styles.profileIcon} />
        <span className={styles.profileText}>PROFILE</span>
      </div>
    </div>
  );
}

export default NavBar;

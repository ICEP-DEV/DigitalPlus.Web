import styles from "./NavBar.module.css";
import imageLogo from "../../../Assets/TUT_Logo_Transparent.png";
import { BsPersonFill } from "react-icons/bs";

function NavBar() {
  return (
    <div className={styles.navBar}>
      <br />
      <img src={imageLogo} alt="Logo" className={styles.appLogo} />

      {/* Profile Icon with description */}
      <div className={styles.profileContainer}>
        <BsPersonFill className={styles.profileIcon} />
        <span className={styles.profileText}>PROFILE</span>
      </div>
    </div>
  );
}

export default NavBar;

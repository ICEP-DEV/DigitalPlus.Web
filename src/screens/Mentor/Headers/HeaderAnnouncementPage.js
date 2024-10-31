import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaKey } from 'react-icons/fa';
import styles from "./HeaderAnnouncementPage.module.css";
import tutLogo_removebg_preview from "../Assets/tutLogo_removebg_preview.png";
import { BsPersonFill } from "react-icons/bs";

function NavBar({ onKeyClick }) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('PROFILE');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.firstName && storedUser.lastName) {
      const initials = storedUser.firstName
        .split(' ')
        .map(name => name[0])
        .join('');
      setDisplayName(`${initials} ${storedUser.lastName}`);
    }
  }, []);

  return (
    <div className={styles.navBar}>
      <br />
      <img src={tutLogo_removebg_preview} alt="Logo" className={styles.appLogo} />

      <div className={styles.profileContainer}>
        <FaKey className={styles.keyIcon} onClick={onKeyClick} />
        <div className={styles.profileInfo}>
          <BsPersonFill className={styles.profileIcon} />
          <span className={styles.profileText}>{displayName}</span>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

import "./NavBar.module.css";
import imageLogo from "../Assets/TUT_Logo_Transparent.png";
import { BsPersonFill } from "react-icons/bs";

function NavBar() {
  return (
    <div className="nav-bar">
      <br />
      <img src={imageLogo} alt="Logo" className="app-logo" />

      {/* Profile Icon with description */}
      <div className="profile_container">
        <BsPersonFill className="profile_icon" />
        <span className="profile_text">PROFILE</span>
      </div>
    </div>
  );
}

export default NavBar;

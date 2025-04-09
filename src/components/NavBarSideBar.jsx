import NavBar from "./NavBar";
import SideBar from "./SideBar";
import './NavBarSideBar.module.css'; // Import the CSS for scroll behavior

function SideBarNavBar() {
  return (
    <div className="app-navigations scrollable-container">
      <NavBar />
      <SideBar />
    </div>
  );
}

export default SideBarNavBar;

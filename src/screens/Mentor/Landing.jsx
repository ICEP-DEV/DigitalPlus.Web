import React from "react";
// import SideBarNavBar from './Navigation/SideBarNavBar';
import Header from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';

function Landing() {
  return (
      <div>
          <Header />
          <SideBar />
        <h1>Hello user</h1>
        <p>Welcome to the Mentor Dashboard</p>
      </div>

  );
}

export default Landing;

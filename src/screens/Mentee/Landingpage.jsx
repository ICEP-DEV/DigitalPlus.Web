import React from "react";
import SideBarNavBar from './Navigation/SideBarNavBar';
import Header from '../../components/Header';
import SideBar from './Navigation/SideBar';

function Landing() {
  return (
      <div>
        <Header />
        <SideBar />
        <h1>Hello</h1>
        <p>Welcome to the Mentee Dashboard</p>
      </div>
    
  );
}

export default Landing;

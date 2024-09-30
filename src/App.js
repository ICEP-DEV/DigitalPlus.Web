// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './screens/Landing/LandingPage.js';
import LoginPage from './screens/Login/LoginPage.js';
import AboutPage from './screens/about/AboutPage.js'; 
import RegisterPage from './screens/Register/RegisterPage.js'; 
import FeedbackPage from './screens/Mentee/FeedbackPage.js';
import ProfilePage from './screens/Mentee/ProfilePage.jsx';
import SettingsPage from './screens/Mentee/SettingsPage.jsx';
import AdminDashboard from './screens/Admin/AdminDashboard.js';
import MentorDashboard from './screens/Mentor/MentorDashboard.jsx'; // Mentor Dashboard
import MenteeDashboard from './screens/Mentee/MenteeDashboard.jsx'; // Mentee Dashboard




const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/aboutPage" element={<AboutPage />} /> 
        <Route path="/RegisterPage" element={<RegisterPage />} /> 
        <Route path="/FeedbackPage" element={<FeedbackPage />} /> 
   
        <Route path="/ProfilePage" element={<ProfilePage />} /> 
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
          {/* Nested routing for the Admin Dashboard */}
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} /> {/* Route for Admin Dashboard */}
        <Route path="/mentor-dashboard/*" element={<MentorDashboard />} /> {/* Route for Mentor Dashboard */}
        <Route path="/mentee-dashboard/*" element={<MenteeDashboard />} /> {/* Route for Mentee Dashboard */}
        </Routes>
    </Router>
  );
};

export default App;

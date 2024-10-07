import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './screens/Landing/LandingPage.js';
import LoginPage from './screens/Login/LoginPage.js';
import AboutPage from './screens/about/AboutPage.js';
import FeedbackPage from './screens/Mentee/FeedbackPage.js';
import ProfilePage from './screens/Mentee/ProfilePage.jsx';
import SettingsPage from './screens/Mentee/SettingsPage.jsx';
import AdminDashboard from './screens/Admin/AdminDashboard.js';
import MentorDashboard from './screens/Mentor/MentorDashboard.jsx'; // Mentor Dashboard
import MenteeDashboard from './screens/Mentee/MenteeDashboard.jsx'; // Mentee Dashboard
import RosterPage from './screens/Mentor/RosterPage';
import RegisterPage from './screens/Mentor/RegisterPage';
import AnnouncementPage from './screens/Mentor/AnnouncementPage';
import VideoLandingPage from './screens/Landing/VideoLandingPage.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RosterPage2 from './screens/Mentee/RosterPage2.jsx';
import AnnouncementPage2 from './screens/Mentee/AnnouncementPage2.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<VideoLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/aboutPage" element={<AboutPage />} />
        <Route path="/FeedbackPage" element={<FeedbackPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/VideoLandingPage" element={<VideoLandingPage />} />
        <Route path="/AnnouncementPage" element={<AnnouncementPage />} />
        <Route path="/AnnouncementPage2" element={<AnnouncementPage2 />} />
        <Route path="/roster" element={<RosterPage />} />
        <Route path="/roster2" element={<RosterPage2 />} />

        {/* Nested routing for the Admin, Mentor, and Mentee Dashboards */}
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/mentor-dashboard/*" element={<MentorDashboard />} />
        <Route path="/mentee-dashboard/*" element={<MenteeDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

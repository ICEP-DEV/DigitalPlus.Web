import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './screens/Login/LoginPage.js';
import AboutPage from './screens/about/AboutPage.js';
import FeedbackPage from './screens/Mentee/FeedbackPage.js';
import ProfilePage from './screens/Mentee/ProfilePage.jsx';
import SettingsPage from './screens/Mentee/SettingsPage.jsx';
import AdminDashboard from './screens/Admin/AdminDashboard.js';
import MentorDashboard from './screens/Mentor/MentorDashboard.jsx';
import MenteeDashboard from './screens/Mentee/MenteeDashboard.jsx';
import RosterPage from './screens/Mentor/RosterPage';
import SignUp from './screens/Register/SignUp.js';
import AnnouncementPage from './screens/Mentor/AnnouncementPage';
import VideoLandingPage from './screens/Landing/VideoLandingPage.jsx';
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute
import ForgotPassword from './screens/Login/ForgotPassword.js';
import SendOTP from './screens/Login/SendOTP.js';

import RosterPage2 from './screens/Mentee/RosterPage2.jsx';
import AnnouncementPage2 from './screens/Mentee/AnnouncementPage2.jsx';
import AnnouncePage from './screens/Landing/AnnouncePage.jsx';
import RosterPg from './screens/Landing/RosterPg.jsx';
import CreateNewAnnouncement from './screens/Admin/CreateNewAnnouncement'; // Import the new component

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/VideoLandingPage" element={<VideoLandingPage />} />
        <Route path="/AnnouncementPage" element={<AnnouncementPage />} />
        <Route path="/roster" element={<RosterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Send-OTP" element={<SendOTP />} />

        {/* Protected routes for Admin, Mentor, and Mentee Dashboards */}
        <Route
          path="/admin-dashboard/*"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentor-dashboard/*"
          element={
            <PrivateRoute>
              <MentorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentee-dashboard/*"
          element={
            <PrivateRoute>
              <MenteeDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

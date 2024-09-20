// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './screens/Landing/LandingPage.js';
import LoginPage from './screens/Login/LoginPage.js';
import AboutPage from './screens/about/AboutPage.js'; 
import RegisterPage from './screens/Register/RegisterPage.js'; 
import FeedbackPage from './screens/Mentee/FeedbackPage.js';
import BookingsPage from './screens/Mentor/BookingsPage.jsx'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/aboutPage" element={<AboutPage />} /> 
        <Route path="/RegisterPage" element={<RegisterPage />} /> 
        <Route path="/FeedbackPage" element={<FeedbackPage />} /> 
        <Route path="/BookingsPage" element={<BookingsPage />} /> 
        </Routes>
    </Router>
  );
};

export default App;

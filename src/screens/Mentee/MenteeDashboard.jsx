import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogoutComponent from './LogoutComponent';
import Landing from './Landingpage';
import FeedbackPage from './FeedbackPage';
import AiPage from './AiPage';
import AnnouncementPage from './AnnouncementPage';
import RegisterPage from './RegisterPage';

const MenteeDashboard = () => {
    return (
        <>
        
        <Routes>
       
        <Route path="AnnouncementPage" element={<AnnouncementPage />} /> 
        <Route path="logout" element={<LogoutComponent />}/>
        <Route path="feedback" element={<FeedbackPage />}/>
        <Route path="ai-tools" element={<AiPage />}/>
        <Route path="RegisterPage" element={<RegisterPage />}/>
        
       </Routes>
        
        </>
    );
};

export default MenteeDashboard;

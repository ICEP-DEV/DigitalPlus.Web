import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogoutComponent from './LogoutComponent';
import Landing from './Landingpage';
import FeedbackPage from './FeedbackPage';
import AiPage from './AiPage';

const MenteeDashboard = () => {
    return (
        <>
        
        <Routes>
       
        <Route path="home" element={<Landing />} /> 
        <Route path="logout" element={<LogoutComponent />}/>
        <Route path="feedback" element={<FeedbackPage />}/>
        <Route path="ai-tools" element={<AiPage />}/>
        
       </Routes>
        
        </>
    );
};

export default MenteeDashboard;

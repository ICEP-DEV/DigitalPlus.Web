import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogoutComponent from './LogoutComponent';
import Landing from './Landingpage';
import FeedbackPage from './FeedbackPage'
import QuizPage from './QuizPage';

const MenteeDashboard = () => {
    return (
        <>
        
        <Routes>
         
        <Route path="home" element={<Landing />} /> 
        <Route path="logout" element={<LogoutComponent />}/>
        <Route path="feedback" element={<FeedbackPage />}/>
        <Route path="modules" element={<QuizPage />}/>
       </Routes>
        
        </>
    );
};

export default MenteeDashboard;

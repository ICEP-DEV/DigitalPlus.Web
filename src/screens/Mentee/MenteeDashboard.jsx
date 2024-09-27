import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogoutComponent from './LogoutComponent';
import Landing from './Landingpage';

const MenteeDashboard = () => {
    return (
        <>
     
        <Routes>
         
        <Route path="home" element={<Landing />} /> 
        <Route path="logout" element={<LogoutComponent />}/>
       </Routes>
        
        </>
    );
};

export default MenteeDashboard;

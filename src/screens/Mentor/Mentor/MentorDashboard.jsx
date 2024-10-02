import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ModulePage from './ModulePage.jsx'; 
import Landing from './Landing.jsx';
import LogoutComponent from './Logout.js'; 
import BookingsPage from './BookingsPage.jsx';
import ReportPage from './Report.jsx';
import ModuleDetails from './ModuleDetails.jsx';
import SettingPage from './Settings.js';


function MentorDashboard() {
  return (
      
    
      <>
     
      <Routes>
       <Route path="home" element={<Landing />} /> 
       <Route path="bookings" element={<BookingsPage />} /> 
       <Route path="module" element={<ModulePage />} /> 
       <Route path="report" element={<ReportPage />} /> 
       <Route path="logout" element={<LogoutComponent />}/>
       <Route path="module/:moduleId" element={<ModuleDetails />} />
       <Route path="setting" element={<SettingPage />} />
     </Routes>
      
      </>
      
    
  );
}

export default MentorDashboard;

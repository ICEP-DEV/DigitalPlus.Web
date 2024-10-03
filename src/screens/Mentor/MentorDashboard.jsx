import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import LogoutComponent from './Logout.js'; 
import ReportPage from './Report.jsx';
import ModuleDetails from './ModuleDetails.jsx';
import SettingPage from './Settings.js';
import ModulePage from './ModulePage.jsx';
import AnnouncementPage from './AnnouncementPage.jsx';
import LogoutComponent from './LogoutComponent.jsx';
import BookingsPage from './BookingsPage.jsx';
import RegisterPage from './RegisterPage.jsx';

function MentorDashboard() {
  return (
    <>
      <Routes>

        <Route path="announcementpage" element={<AnnouncementPage />} /> 
        <Route path="bookings" element={<BookingsPage />} /> 
        <Route path="module" element={<ModulePage />} /> 
        <Route path="logout" element={<LogoutComponent />} />
        <Route path="register" element={<RegisterPage />} />
       <Route path="report" element={<ReportPage />} /> 
       <Route path="module/:moduleId" element={<ModuleDetails />} />
       <Route path="setting" element={<SettingPage />} />
     </Routes>
      
      </>
      
  
  );
}

export default MentorDashboard;

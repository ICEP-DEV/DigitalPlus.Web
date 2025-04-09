import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogoutComponent from './Logout.js'; 
import ReportPage from './Report.jsx';
import ModuleDetails from './ModuleDetails.jsx';
import SettingPage from './Settings.js';
import ModulePage from './ModulePage.jsx';
import AnnouncementPage from './AnnouncementPage.jsx';
import BookingsPage from './BookingsPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import CalendarPage from './CalendarPage.js';
import RosterPage from './RosterPage.jsx';


function MentorDashboard() {
  return (
    <> {/* Wrap everything in Router */}
     
      <Routes>
    
        <Route path="announcementpage" element={<AnnouncementPage />} /> 
        <Route path="bookings" element={<BookingsPage />} /> 
        <Route path="module" element={<ModulePage />} /> 
        <Route path="logout" element={<LogoutComponent />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="Calendar" element={<CalendarPage />} />
        <Route path="report" element={<ReportPage />} /> 
        <Route path="module/:moduleId" element={<ModuleDetails />} />
        <Route path="setting" element={<SettingPage />} />
        <Route path="roster" element={<RosterPage />} />
      </Routes>
    </>
  );
}

export default MentorDashboard;

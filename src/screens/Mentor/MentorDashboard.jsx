import { Routes, Route } from 'react-router-dom';

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
        
      </Routes>
    </>
  );
}

export default MentorDashboard;

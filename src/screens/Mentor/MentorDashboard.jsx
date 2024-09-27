import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ModulePage from './ModulePage.jsx'; 
import Landing from './Landing.jsx';
import LogoutComponent from './LogoutComponent.jsx'; 
import BookingsPage from './BookingsPage.jsx'


function MentorDashboard() {
  return (
      
    
      <>
     
      <Routes>
       <Route path="home" element={<Landing />} /> 
       <Route path="bookings" element={<BookingsPage />} /> 
       <Route path="module" element={<ModulePage />} /> 
       <Route path="logout" element={<LogoutComponent />}/>
     </Routes>
      
      </>
      
    
  );
}

export default MentorDashboard;

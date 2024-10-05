import { useState } from 'react';  // Import useState for managing state
import NavBar from './ModuleDetails/NavBar';
import SideBar from './ModuleDetails/SideBar';
// Import the MentorDmPage component
import styles from './ModuleDetails.module.css'; // Import the CSS module
import ModulePage from './ModulePage';
import ClassListPage from './ModuleDetails/ClassListPage';
import MentorDmPage from './ModuleDetails/MentorDmPage';
import QuizhiPage from './ModuleDetails/Quiz';  // Correct capitalization

function App() {
  const [activePage, setActivePage] = useState('chat');  // Default page is ChatPage (LIVE CHAT)

  return (
    <div className={styles.appC}>
      <NavBar />
      <div className={styles.content}>
        <SideBar setActivePage={setActivePage} />
        <div className={styles.mainContent}>
        
          {activePage === 'quizz' && <QuizhiPage  />}
          {activePage === 'classlist' && <ClassListPage />}
          {activePage === 'quizhistory' && <MentorDmPage  />}  {/* Correct capitalization */}
          {activePage === 'mentordm' && <MentorDmPage />}
          {activePage === 'back' && <ModulePage />}
        </div>
      </div>
    </div>
  );
}

export default App;

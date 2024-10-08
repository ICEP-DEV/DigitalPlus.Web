import { useState } from 'react';  // Import useState for managing state
import NavBar from './MenteeModuleDetails/NavBar';
import SideBar from './MenteeModuleDetails/SideBar';
// Import the MentorDmPage component
import styles from './MenteeModuleDetails.module.css'; // Import the CSS module
import MenteeModulePage from './MenteeModulePage';
import MentorsPage from './MenteeModuleDetails/MentorsPage';
import MentorDmPage from './ModuleDetails/MentorDmPage';
import QuizPage from  './MenteeModuleDetails/QuizPage';
function App() {
  const [activePage, setActivePage] = useState('chat');  // Default page is ChatPage (LIVE CHAT)

  return (
    <div className={styles.appC}>
      <NavBar />
      <div className={styles.content}>
        <SideBar setActivePage={setActivePage} />
        <div className={styles.mainContent}>
        
          {activePage === 'quizz' && <QuizPage  />}
          {activePage === 'mentorslist' && <MentorsPage />}
          {activePage === 'quizhistory' && <MentorDmPage  />}  {/* Correct capitalization */}
          {activePage === 'mentordm' && <MentorDmPage />}
          {activePage === 'back' && <MenteeModulePage />}
        </div>
      </div>
    </div>
  );
}

export default App;

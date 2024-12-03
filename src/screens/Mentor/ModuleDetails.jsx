import { useState } from 'react';  // Import useState for managing state
import NavBar from './ModuleDetails/NavBar';
import SideBar from './ModuleDetails/SideBar';
// Import the MentorDmPage component
import styles from './ModuleDetails.module.css'; // Import the CSS module
import ModulePage from './ModulePage';
import ClassListPage from './ModuleDetails/ClassListPage';
import MentorDMComponent from './ModuleDetails/MentorDMComponent';
import SetQuiz from './ModuleDetails/SetQuiz';  // Correct capitalization
import RattingPage from './ModuleDetails/DynamicTable';  // Correct capitalization
import MentorChatBoard from './ModuleDetails/MentorChatBoard';

function App() {
  const [activePage, setActivePage] = useState('chat');  // Default page is ChatPage (LIVE CHAT)

  return (
    <div className={styles.appC}>
      <NavBar />
      <div className={styles.content}>
        <SideBar setActivePage={setActivePage} />
        <div className={styles.mainContent}>
        
          {activePage === 'quizz' && <SetQuiz setActivePage={setActivePage} />}
          {activePage === 'classlist' && <ClassListPage />}
          {activePage === 'chatboard' && <MentorChatBoard setActivePage={setActivePage}  />}  
          {activePage === 'mentordm' && <MentorDMComponent />}
          {activePage === 'back' && <ModulePage />}
          {activePage === 'ratting' && <RattingPage setActivePage={setActivePage}  />}
        </div>
      </div>
    </div>
  );
}

export default App;

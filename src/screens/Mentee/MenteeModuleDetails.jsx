import { useState } from 'react';  
import NavBar from './MenteeModuleDetails/NavBar';
import SideBar from './MenteeModuleDetails/SideBar';
import styles from './MenteeModuleDetails.module.css'; 
import MenteeModulePage from './MenteeModulePage';
import MentorsPage from './MenteeModuleDetails/MentorsPage';
import DMComponent from './MenteeModuleDetails/DMComponent';
import QuizPage from  './MenteeModuleDetails/QuizPage';
import ChatBoard from './MenteeModuleDetails/ChatBoard';

function App() {
  // Set the default page to 'quizz' so the QuizPage is loaded first
  const [activePage, setActivePage] = useState('quizz');  

  return (
    <div className={styles.appC}>
      <NavBar />
      <div className={styles.content}>
        <SideBar setActivePage={setActivePage} />
        <div className={styles.mainContent}>
          {/* Default page is QuizPage, and other pages will load based on activePage */}
          {activePage === 'quizz' && <QuizPage />}
          {activePage === 'mentorslist' && <MentorsPage />}
          {activePage === 'chatboard' && <ChatBoard />}
          {activePage === 'mentordm' && <DMComponent />}
          {activePage === 'back' && <MenteeModulePage />}
        </div>
      </div>
    </div>
  );
}

export default App;

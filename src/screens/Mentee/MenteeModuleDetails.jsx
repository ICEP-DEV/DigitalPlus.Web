import { useState } from 'react';  
import NavBar from './MenteeModuleDetails/NavBar';
import SideBar from './MenteeModuleDetails/SideBar';
import styles from './MenteeModuleDetails.module.css'; 
import MenteeModulePage from './MenteeModulePage';
import MentorsPage from './MenteeModuleDetails/MentorsPage';
import DMComponent from './MenteeModuleDetails/DMComponent';
import QuizPage from  './MenteeModuleDetails/QuizPage';
import ChatBoard from './MenteeModuleDetails/ChatBoard';
import QuizLandingPage from './MenteeModuleDetails/QuizLandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  // Set the default page to 'quizz' so the QuizPage is loaded first
  const [activePage, setActivePage] = useState('quizzLanding');  

  return (
    
    <div className={styles.appC}>
      <NavBar />
      <div className={styles.content}>
        <SideBar setActivePage={setActivePage} />
        <div className={styles.mainContent}>
          {/* Default page is QuizPage, and other pages will load based on activePage */}
          {activePage === 'quizzLanding'&& <QuizLandingPage />}
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

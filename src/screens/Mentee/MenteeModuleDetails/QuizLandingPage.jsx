import React, { useState } from 'react';
import styles from './QuizLandingPage.module.css'; // Import the CSS module
import QuizPage from './QuizPage'; // Import the QuizPage component

const QuizLandingPage = () => {
  const [showQuizz, setShowQuizz] = useState(false); // State to manage quiz visibility

  // Mock data for the quiz details
  const moduleName = "Introduction to Data Structures";
  const setDate = "2024-10-22"; // Example set date
  const dueDate = "2024-10-29"; // Example due date
  const timeAllocation = "30 minutes";

  const handleStartQuiz = () => {
    setShowQuizz(true); // Set the state to show the QuizPage
  };

  return (
    <div className={styles.quizzLanding_container}>
      {showQuizz ? (
        // Render the QuizPage when showQuizz is true
        <QuizPage moduleId={moduleName} />
      ) : (
        // Render the landing page details when showQuizz is false
        <>
          <h1 className={styles.title}>{moduleName}</h1>
          <div className={styles.details}>
            <p><strong>Set Date:</strong> {setDate}</p>
            <p><strong>Due Date:</strong> {dueDate}</p>
            <p><strong>Time Allocation:</strong> {timeAllocation}</p>
          </div>
          <button 
            type="button" 
            onClick={handleStartQuiz} 
            className={styles.startButton}
          >
            Start Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default QuizLandingPage;

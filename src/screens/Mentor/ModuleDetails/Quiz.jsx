import React, { useState } from 'react';
import styles from './Quiz.module.css'; // Import the CSS module
import SetQuizzPage from './SetQuiz'; // Import SetQuizzPage component

const QuizHistory = () => {
  const [activeTab, setActiveTab] = useState('setQuiz'); // Manage active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.quizHistoryContainer}>
      <h1 className={styles.heading}>Quiz</h1>  {/* Add the heading here */}
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === 'setQuiz' ? styles.activeTab : ''}`}
          onClick={() => handleTabClick('setQuiz')}
        >
          SET QUIZ
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'historyQuiz' ? styles.activeTab : ''}`}
          onClick={() => handleTabClick('historyQuiz')}
        >
          HISTORY QUIZ
        </div>
      </div>
      <div className={styles.content}>
        {activeTab === 'setQuiz' ? (
          <div className={`${styles.visible}`}>
            <SetQuizzPage />  {/* Render the SetQuizzPage component */}
          </div>
        ) : (
          <div className={`${styles.visible}`}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date Created</th>
                  <th>Number of Questions</th>
                  <th>Mentee Answers</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Methods</td>
                  <td>2024-10-05</td>
                  <td>10</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>2. If Statement</td>
                  <td>2024-10-03</td>
                  <td>8</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>3. Switch Statement</td>
                  <td>2024-10-01</td>
                  <td>7</td>
                  <td>3</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;

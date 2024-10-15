import React, { useState } from 'react';
import styles from './Quiz.module.css'; // Import the CSS module
import SetQuizzPage from './SetQuiz'; 
import { useParams } from 'react-router-dom'; // Import SetQuizzPage component

const QuizHistory = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState('setQuiz'); // Manage active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleViewRatings = () => {
    setActivePage('ratting'); // Navigate to the "ratting" page
  };
  const { moduleId } = useParams(); 
  return (
    <div className={styles.quizHistoryContainer}>
      <h1 className={styles.heading}>Quiz {moduleId}</h1>  {/* Add the heading here */}
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
<<<<<<< HEAD
=======
                
>>>>>>> ec32dfbdd1e52ee1f48cf3a23069786eaa4391de
                  <th>Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Methods</td>
                  <td>2024-10-05</td>
                  <td>10</td>
<<<<<<< HEAD
                  <td>
                    <button 
                      className={styles.viewButton} 
                      onClick={handleViewRatings}  // Trigger navigation to the "ratting" page
                    >
                      View Ratings
                    </button>
=======
                  
                  <td>
                    <button className={styles.viewButton}>View Ratings</button> {/* Button to view ratings */}
>>>>>>> ec32dfbdd1e52ee1f48cf3a23069786eaa4391de
                  </td>
                </tr>
                <tr>
                  <td>2. If Statement</td>
                  <td>2024-10-03</td>
                  <td>8</td>
<<<<<<< HEAD
                  <td>
                    <button 
                      className={styles.viewButton} 
                      onClick={handleViewRatings}  // Trigger navigation to the "ratting" page
                    >
                      View Ratings
                    </button>
=======
                  
                  <td>
                    <button className={styles.viewButton}>View Ratings</button> {/* Button to view ratings */}
>>>>>>> ec32dfbdd1e52ee1f48cf3a23069786eaa4391de
                  </td>
                </tr>
                <tr>
                  <td>3. Switch Statement</td>
                  <td>2024-10-01</td>
                  <td>7</td>
<<<<<<< HEAD
                  <td>
                    <button 
                      className={styles.viewButton} 
                      onClick={handleViewRatings}  // Trigger navigation to the "ratting" page
                    >
                      View Ratings
                    </button>
=======
                  
                  <td>
                    <button className={styles.viewButton}>View Ratings</button> {/* Button to view ratings */}
>>>>>>> ec32dfbdd1e52ee1f48cf3a23069786eaa4391de
                  </td>
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

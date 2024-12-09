import React, { useState, useEffect } from 'react';
import styles from './QuizLandingPage.module.css'; // Import the CSS module
import QuizPage from './QuizPage'; // Import the QuizPage component
import axios from 'axios';

const QuizLandingPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/Quiz');
        setQuizzes(response.data);
        setFilteredQuizzes(response.data);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter((quiz) =>
      quiz.id.toString().includes(searchTerm)
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const handleStartQuiz = (quizId) => {
    setSelectedQuizId(quizId); // Pass the quiz ID to QuizPage
  };

  return (
    <div className={styles.quizzLanding_container}>
      {selectedQuizId ? (
        <QuizPage quizId={selectedQuizId} /> // Pass quizId to QuizPage
      ) : (
        <>
          <div className={styles.quizzLanding_searchContainer}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Quiz ID..."
              className={styles.quizzLanding_searchInput}
            />
          </div>
          <div className={styles.quizzLanding_cardContainer}>
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className={styles.quizzLanding_card}>
                  <h2 className={styles.quizzLanding_cardTitle}>{quiz.title}</h2>
                  <div className={styles.quizzLanding_cardDetails}>
                    <p>
                      <strong>Quiz ID:</strong> {quiz.id}
                    </p>
                    <p>
                      <strong>Description:</strong> {quiz.description}
                    </p>
                    <p>
                      <strong>Set Date:</strong> {quiz.startDate}
                    </p>
                    <p>
                      <strong>Due Date:</strong> {quiz.endDate}
                    </p>
                    <p>
                      <strong>Time Allocation:</strong>{' '}
                      {quiz.timeAllocation || 'N/A'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartQuiz(quiz.id)} // Pass quiz ID
                    className={styles.quizzLanding_startButton}
                  >
                    Start Quiz
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.quizzLanding_noQuizzesMessage}>
                No quizzes match your search.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizLandingPage;

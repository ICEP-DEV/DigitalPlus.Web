import React, { useState, useEffect } from 'react';
import styles from './QuizLandingPage.module.css'; // Import the CSS module
import QuizPage from './QuizPage'; // Import the QuizPage component
import axios from 'axios'; // For fetching data

const QuizLandingPage = () => {
  const [quizzes, setQuizzes] = useState([]); // Store fetched quizzes
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Track the selected quiz to display its QuizPage
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const [filteredQuizzes, setFilteredQuizzes] = useState([]); // To store filtered quizzes

  // Fetch available quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('https://localhost:7050/api/Questions');
        setQuizzes(response.data);
        setFilteredQuizzes(response.data); // Initially display all quizzes
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  // Update filtered quizzes based on the search term
  useEffect(() => {
    const filtered = quizzes.filter((quiz) =>
      quiz.id.toString().includes(searchTerm)
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  // Handle starting the quiz for a selected quiz
  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  return (
    <div className={styles.quizzLanding_container}>
      {selectedQuiz ? (
        // Pass the quiz id to the QuizPage when a quiz is selected
        <QuizPage quizId={selectedQuiz.id} />
      ) : (
        <>
          {/* Search bar */}
          <div className={styles.quizzLanding_searchContainer}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Quiz ID..."
              className={styles.quizzLanding_searchInput}
            />
          </div>
          {/* Render the cards for all quizzes */}
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
                      <strong>Time Allocation:</strong> {quiz.timeAllocation || 'N/A'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartQuiz(quiz)}
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

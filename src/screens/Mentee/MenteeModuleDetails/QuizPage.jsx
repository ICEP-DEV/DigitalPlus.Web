import React, { useState, useEffect } from 'react';
import styles from './QuizPage.module.css';
import DynamicTable from './DynamicTable';
import axios from 'axios';

const QuizPage = ({ quizId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [quizTitle, setQuizTitle] = useState(''); // State for storing quiz title
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Fetch questions and quiz title for the selected quiz
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7163/api/Quiz/${quizId}`);
        const quizData = response.data;

        // Set the quiz title from the API response
        setQuizTitle(quizData.title); // Assuming 'title' is the key for the quiz title in the response

        // Extract questions from the API response and filter valid ones
        const extractedQuestions = Object.keys(quizData)
          .filter((key) => key.startsWith('question') && quizData[key]) // Filter for valid question fields
          .map((key) => quizData[key])
          .filter((question) => question !== 'string' && question !== null); // Remove placeholder or null values

        setQuestions(extractedQuestions);
      } catch (error) {
        console.error('Failed to fetch quiz details:', error);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  // Set the current date and time when the component is mounted
  useEffect(() => {
    const current = new Date();
    const date = current.toLocaleDateString(); // Get the date in a readable format
    const time = current.toLocaleTimeString(); // Get the time in a readable format
    setCurrentDate(date);
    setCurrentTime(time);
  }, []); // Only run once when the component mounts

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else {
      alert('Time is up! Please submit your answers.');
      setShowTable(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData([...submittedData, { question: questions[currentIndex], answer }]);
    setAnswer('');
    setCurrentIndex((prev) => prev + 1); // Move to the next question
  };

  const handleViewAnswers = () => setShowTable(true);
  const handleBackToQuiz = () => setShowTable(false);

  return (
    <div className={styles.quizContainer}>
      {showTable ? (
        <DynamicTable onBack={handleBackToQuiz} submittedData={submittedData} />
      ) : (
        <>
          <h1>{quizTitle || 'Loading Quiz Title...'}</h1> {/* Display the quiz title */}

          {/* Timer and progress bar */}
          <div className={styles.timerContainer}>
            <div className={styles.timeDisplay}>
              Time Left: {formatTime(timeLeft)}
            </div>
            <div className={styles.timeProgressBar}>
              <div
                className={styles.timeProgress}
                style={{ width: `${(timeLeft / 1800) * 100}%` }}
              />
            </div>
          </div>

          {/* Conditional Rendering */}
          {currentIndex < questions.length ? (
            <>
              {/* Show questions and answer input if there are remaining questions */}
              <div className={styles.questionContainer}>
                <h3>{questions[currentIndex] || 'Loading questions...'}</h3>
              </div>

              <form onSubmit={handleSubmit} className={styles.formContainer}>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows="5"
                  className={styles.answerInput}
                  required
                />
                <button type="submit" className={styles.submitButton}>
                  {currentIndex === questions.length - 1 ? 'Submit & Finish' : 'Submit'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Show "View Answers" button only after the last question */}
              <div className={styles.viewAnswersContainer}>
                <button onClick={handleViewAnswers} className={styles.viewAnswersButton}>
                  View Answers
                </button>
                <h1>Quiz Completed on</h1><br/>
                <h1>Date : {currentDate}</h1><br/> {/* Display current date */}
                <h1>Time : {currentTime}</h1> {/* Display current time */}
              </div>
            </>
          )}

          {/* Question navigation panel */}
          {currentIndex < questions.length && (
            <div className={styles.questionNav}>
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.navButton} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;

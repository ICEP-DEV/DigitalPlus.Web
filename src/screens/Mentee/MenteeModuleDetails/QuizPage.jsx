import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './QuizPage.module.css';
import DynamicTable from './DynamicTable';

const QuizPage = () => {
  const location = useLocation();
  const moduleId = location.state?.moduleId || "Ongoing Quiz";

  const questions = [
    "What is the time complexity of a binary search algorithm?",
    "Explain the difference between HTTP and HTTPS.",
    "What is a linked list in data structures?",
    "Describe the concept of a 'hash function'.",
    "What is recursion in programming?",
    "Explain the purpose of a database index.",
    "What is an algorithm?",
    "What is the difference between stack and queue?",
    "Explain the concept of object-oriented programming.",
    "What is a Turing machine?"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

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
    alert('Your answer has been submitted!');
    setAnswer('');
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handleQuestionChange = (index) => setCurrentIndex(index);
  const handleViewAnswers = () => setShowTable(true);
  const handleBackToQuiz = () => setShowTable(false);

  return (
    <div className={styles.quizContainer}>
      {showTable ? (
        <DynamicTable onBack={handleBackToQuiz} submittedData={submittedData} />
      ) : (
        <>
          <h1>{moduleId}</h1>

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


          <div className={styles.questionContainer}>
            <h3>{questions[currentIndex]}</h3>
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
            <button type="submit" className={styles.submitButton}>Submit</button>
            <button type="button" onClick={handleViewAnswers} className={styles.viewAnswersButton}>
              View Answers
            </button>
          </form>

          {/* Question navigation panel */}
          <div className={styles.questionNav}>
            {questions.map((_, index) => (
              <button
                key={index}
                className={`${styles.navButton} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => handleQuestionChange(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

        </>
      )}
    </div>
  );
};

export default QuizPage;

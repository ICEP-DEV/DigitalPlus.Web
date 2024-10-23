import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // Import useLocation to get state
import styles from './QuizPage.module.css'; // Import the CSS module
import DynamicTable from './DynamicTable';

const QuizPage = () => {
  const location = useLocation();  // Get the navigation state
  const moduleId = location.state?.moduleId || "Ongoing Quizz"; // Use moduleId if provided

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

  const [currentQuestion, setCurrentQuestion] = useState(
    questions[Math.floor(Math.random() * questions.length)]
  );
  const [answer, setAnswer] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 1800 seconds = 30 minutes

  // Handle the countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      alert('Time is up! Please submit your answers.');
      setShowTable(true); // Show the answers or navigate based on your requirements
    }
  }, [timeLeft]);

  // Convert seconds to mm:ss format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData([...submittedData, { question: currentQuestion, answer }]);
    alert('Your answer has been submitted!');
    setAnswer('');
    setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
  };

  const handleViewAnswers = () => {
    setShowTable(true);
  };

  const handleBackToQuiz = () => {
    setShowTable(false);
  };

  return (
    <div style={inlineStyles.container}>
      {showTable ? (
        <DynamicTable onBack={handleBackToQuiz} submittedData={submittedData} />
      ) : (
        <>
          <h1>{moduleId}</h1>
          <div style={inlineStyles.timer}>
            <strong>Time Left: {formatTime(timeLeft)}</strong>
          </div>
          <br/><br/>
          <div style={inlineStyles.questionContainer}>
            <h3>{currentQuestion}</h3>
          </div>

          <form onSubmit={handleSubmit} style={inlineStyles.formContainer}>
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows="5"
              cols="50"
              style={inlineStyles.textArea}
              required
            />
            <br />
            <button type="submit" style={inlineStyles.quizz_submitButton}>Submit</button>
            <button 
              type="button" 
              onClick={handleViewAnswers} 
              className={styles.quizz_viewButton}
            >
              View Answers
            </button>
          </form>
        </>
      )}
    </div>
  );
};

const inlineStyles = {
  container: {
    position: 'relative',
    left: '70px',
    top: '44px',
    marginRight: '10%',
    width: '80%',
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    border: 'solid 1px #0d1431',
    borderRadius: '15px'
  },
  timer: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#0d1431',
  },
  questionContainer: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    border: 'solid 1px #0d1431',
    marginBottom: '20px',
    fontSize: '18px'
  },
  formContainer: {
    display: 'inline-block',
    textAlign: 'left'
  },
  textArea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  submitButton: {
    backgroundColor: '#0d1431',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginRight: '10px'
  }
};

export default QuizPage;

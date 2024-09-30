import React, { useState } from 'react';
import styles from './QuizPage.module.css'; // Import the CSS module
import DynamicTable from './DynamicTable';
import SideBarNavBar from './Navigation/SideBarNavBar';
import { BsJustify } from 'react-icons/bs';

const QuizPage = () => {
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
    <SideBarNavBar>
    <div style={inlineStyles.container}>
      {showTable ? (
        <DynamicTable onBack={handleBackToQuiz} submittedData={submittedData} />
      ) : (
        <>
          
          <h1>Computer Science Quiz</h1><br/><br/>
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
            <button type="submit" style={inlineStyles.submitButton}>Submit</button>
            <button 
              type="button" 
              onClick={handleViewAnswers} 
              className={styles.viewButton}  // Use the module's viewButton class
            >
              View Answers
            </button>
          </form>
        </>
      )}
    </div>
    </SideBarNavBar>
  );
};

const inlineStyles = {
  container: {
    position: 'relative', // Add this
    left: '200px', // Add this to move the container 100px to the right
    top:'44px',
    marginRight:'10%',
   width: '80%',
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    border: 'solid 1px #0d1431',
    borderRadius:'15px'
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

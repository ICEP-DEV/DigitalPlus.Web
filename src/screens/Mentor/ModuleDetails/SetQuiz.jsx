import React, { useState } from 'react';
import styles from './SetQuiz.module.css';  // Import the CSS module

const SetQuiz = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', answerType: 'textBox', answer: '' },
  ]);

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', answerType: 'textBox', answer: '' },
    ]);
  };

  // Handle change in quiz title
  const handleQuizTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };

  // Handle change in question text
  const handleQuestionTextChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, questionText: value } : q
    );
    setQuestions(updatedQuestions);
  };

  // Handle change in answer type (TextBox or TextArea)
  const handleAnswerTypeChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, answerType: value } : q
    );
    setQuestions(updatedQuestions);
  };

  // Handle quiz form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ quizTitle, questions });
    alert('Quiz submitted!');
  };

  // Remove a question
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.quizContainer}>
      <h1 className={styles.quizTitle}>Set Quiz</h1>
      <form onSubmit={handleSubmit}>
        {/* Quiz Title */}
        <div>
          <label htmlFor="quizTitle" className={styles.label}>Quiz Title:</label>
          <input
            type="text"
            id="quizTitle"
            className={styles.quizTitleInput}
            value={quizTitle}
            onChange={handleQuizTitleChange}
            required
          />
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
          <div key={index} className={styles.questionContainer}>
            <label className={styles.questionLabel}>Question {index + 1}:</label>
            <input
              type="text"
              className={styles.questionInput}
              value={q.questionText}
              onChange={(e) => handleQuestionTextChange(index, e.target.value)}
              required
            />

            {/* Answer Type Selection */}
            <div>
              <label className={styles.label}>Answer Type:</label>
              <select
                value={q.answerType}
                onChange={(e) => handleAnswerTypeChange(index, e.target.value)}
                className={styles.answerTypeSelect}
              >
                <option value="textBox">TextBox (Short Answer)</option>
                <option value="textArea">TextArea (Long Answer)</option>
              </select>
            </div>

            {/* Render TextBox or TextArea based on selection */}
            {q.answerType === 'textBox' ? (
              <input
                type="text"
                className={styles.answerInput}
                placeholder="Answer (TextBox)"
              />
            ) : (
              <textarea
                className={styles.answerTextarea}
                placeholder="Answer (TextArea)"
              />
            )}

            {/* Remove Question Button */}
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className={styles.removeQuestionButton}
            >
              Remove Question
            </button>
          </div>
        ))}

        {/* Add Question Button */}
        <button type="button" onClick={addQuestion} className={styles.addQuestionButton}>
          Add Question
        </button>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton}>Submit Quiz</button>
      </form>
    </div>
  );
};

export default SetQuiz;

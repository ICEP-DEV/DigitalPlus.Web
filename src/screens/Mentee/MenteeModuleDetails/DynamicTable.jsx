import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import styles from "./DynamicTable.module.css";

const DynamicTable = ({ onBack, submittedData }) => {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Single search query for both
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    setRows(submittedData);
  }, [submittedData]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("https://localhost:7163/api/Quiz");
        const currentDate = new Date();
        const pastQuizzes = response.data.filter((quiz) => new Date(quiz.endDate) < currentDate);
        setQuizzes(pastQuizzes);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  // Handle changes in input fields for rows
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  // Handle Rating Change
  const handleRatingChange = (index, rating) => {
    const newRows = [...rows];
    newRows[index].ratings = rating;
    setRows(newRows);
  };

  // Delete Row
  const deleteRow = (index) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  // Filter for rows and quizzes based on searchQuery
  const filteredRows = rows.filter((row) => {
    const query = searchQuery.toLowerCase();
    return (
      row.name?.toLowerCase().includes(query) ||
      row.surname?.toLowerCase().includes(query) ||
      row.question?.toLowerCase().includes(query) ||
      row.answer?.toLowerCase().includes(query)
    );
  });

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.id.toString().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.rate_container}>
      <button onClick={onBack} className={styles.back_Button}>
        Back to Quizzes
      </button>
      <h2 className={styles.title}>Rate a Mentee's Answer</h2>

      {/* Unified Search Input */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search past quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Table for submitted data */}
      <table className={styles.rating_table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Questions</th>
            <th>Answers</th>
            <th>Ratings</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="name"
                  className={styles.rate_name_input}
                  value={row.name || ""}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="surname"
                  className={styles.rate_surname_input}
                  value={row.surname || ""}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </td>
              <td>
                <textarea name="questions" value={row.question} readOnly />
              </td>
              <td>
                <textarea name="answers" value={row.answer} readOnly />
              </td>
              <td className={styles.answer_rating}>
                {[...Array(5)].map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    color={starIndex < (row.ratings || 0) ? "#0d1431" : "gray"}
                    onClick={() => handleRatingChange(index, starIndex + 1)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </td>
              <td>
                <button
                  onClick={() => deleteRow(index)}
                  className={styles.rate_deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Past Quizzes Section */}
      <div className={styles.demoQuizzesContainer}>
        <h3>Past Quizzes Written by Mentees</h3>

        <div className={styles.demoQuizzes}>
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className={styles.quizCard}>
                <h4>{quiz.title}</h4>
                <p><strong>Description:</strong> {quiz.description}</p>
                <p><strong>Start Date:</strong> {new Date(quiz.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(quiz.endDate).toLocaleDateString()}</p>
                <p><strong>Time Allocation:</strong> {quiz.timeAllocation || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No past quizzes available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;

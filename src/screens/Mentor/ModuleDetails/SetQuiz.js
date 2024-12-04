import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SetQuiz.module.css";

const SetQuiz = () => {
  const [quizzes, setQuizzes] = useState([]); // Store fetched quizzes
  const [error, setError] = useState(""); // Error messages
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    ...Array.from({ length: 20 }).reduce((acc, _, index) => {
      acc[`question${index + 1}`] = "";
      return acc;
    }, {}),
  });
  const [editData, setEditData] = useState(null); // For updating a quiz
  const [searchId, setSearchId] = useState(""); // ID to search
  const [searchResult, setSearchResult] = useState(null); // Result of the search
  const [showTable, setShowTable] = useState(false); // Toggle quiz history visibility

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("https://localhost:7163/api/Quiz");
        setQuizzes(response.data);
      } catch (err) {
        setError("Failed to fetch quizzes. Please ensure the backend is running.");
        console.error(err);
      }
    };

    fetchQuizzes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editData) {
      setEditData({ ...editData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quizData = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      ...Array.from({ length: 20 }).reduce((acc, _, index) => {
        acc[`question${index + 1}`] = formData[`question${index + 1}`] || "";
        return acc;
      }, {}),
    };

    try {
      const response = await axios.post("https://localhost:7163/api/Quiz", quizData, {
        headers: { "Content-Type": "application/json" },
      });

      setQuizzes([...quizzes, response.data]);
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        ...Array.from({ length: 20 }).reduce((acc, _, index) => {
          acc[`question${index + 1}`] = "";
          return acc;
        }, {}),
      });
      alert("Quiz and questions submitted successfully.");
    } catch (err) {
      setError("Failed to submit quiz and questions. Please check your inputs and ensure the backend is running.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await axios.delete(`https://localhost:7163/api/Quiz/${id}`);
        setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
        alert("Quiz deleted successfully.");
      } catch (err) {
        setError("Failed to delete quiz. Please try again later.");
        console.error(err);
      }
    }
  };

  const handleSearch = () => {
    const result = quizzes.find((quiz) => quiz.id.toString() === searchId);
    setSearchResult(result || null);
  };

  const handleUpdate = async () => {
    if (!editData) return;

    try {
      await axios.put(`https://localhost:7163/api/Quiz/${editData.id}`, editData, {
        headers: { "Content-Type": "application/json" },
      });

      setQuizzes(
        quizzes.map((quiz) =>
          quiz.id === editData.id ? editData : quiz
        )
      );
      setEditData(null);
      alert("Quiz updated successfully.");
    } catch (err) {
      setError("Failed to update quiz. Please try again later.");
      console.error(err);
    }
  };

  const toggleTableVisibility = () => {
    setShowTable(!showTable);
  };

  const countNonNullQuestions = (quiz) => {
    return Object.keys(quiz)
      .filter((key) => key.startsWith("question") && quiz[key].trim() !== "")
      .length;
  };

  return (
    <div className={styles.SetQuiz_container}>
      <h1 className={styles.SetQuiz_title}>Set Quiz</h1>
      {error && <p className={styles.SetQuiz_error}>{error}</p>}

      <form onSubmit={editData ? handleUpdate : handleSubmit} className={styles.SetQuiz_form}>
        <h2>{editData ? "Edit Quiz" : "Add Quiz Details"}</h2>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Quiz Title"
            value={editData ? editData.title : formData.title}
            onChange={handleInputChange}
            required
            className={styles.SetQuiz_input}
          />
          <input
            type="text"
            name="description"
            placeholder="Quiz Description"
            value={editData ? editData.description : formData.description}
            onChange={handleInputChange}
            required
            className={styles.SetQuiz_input}
          />
          <input
            type="datetime-local"
            name="startDate"
            value={editData ? editData.startDate : formData.startDate}
            onChange={handleInputChange}
            required
            className={styles.SetQuiz_input}
          />
          <input
            type="datetime-local"
            name="endDate"
            value={editData ? editData.endDate : formData.endDate}
            onChange={handleInputChange}
            required
            className={styles.SetQuiz_input}
          />
        </div>

        <h2>Add Questions</h2>
        <div className={styles.SetQuiz_formGrid}>
          {Array.from({ length: 20 }).map((_, index) => (
            <input
              key={`question${index + 1}`}
              type="text"
              name={`question${index + 1}`}
              placeholder={`Question ${index + 1}`}
              value={editData ? editData[`question${index + 1}`] : formData[`question${index + 1}`]}
              onChange={handleInputChange}
              className={styles.SetQuiz_input}
            />
          ))}
        </div>
        <button type="submit" className={styles.SetQuiz_addButton}>
          {editData ? "Update Quiz" : "Submit Quiz"}
        </button>
      </form>

      <h2>Search Quiz by ID</h2>
      <div className={styles.SetQuiz_searchContainer}>
        <input
          type="text"
          placeholder="Enter Quiz ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className={styles.SetQuiz_input}
        />
        <button onClick={handleSearch} className={styles.SetQuiz_searchButton}>
          Search
        </button>
      </div>
      {searchResult ? (
        <div className={styles.SetQuiz_searchResult}>
          <h3 className={styles.SetQuiz_searchResultH3}>Search Result</h3>
          <p><strong>ID:</strong> {searchResult.id}</p>
          <p><strong>Title:</strong> {searchResult.title}</p>
          <p><strong>Description:</strong> {searchResult.description}</p>
          <p><strong>Start Date:</strong> {searchResult.startDate}</p>
          <p><strong>End Date:</strong> {searchResult.endDate}</p>
          <h4>Questions:</h4>
          <ul className={styles.SetQuiz_searchResultUl}>
            {Array.from({ length: 20 }).map((_, index) => (
              <li key={`result-q${index + 1}`} className={styles.SetQuiz_searchResultLi}>
                Q{index + 1}: {searchResult[`question${index + 1}`] || "N/A"}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        searchId && <p className={styles.SetQuiz_noData}>No quiz found with the provided ID.</p>
      )}

      <button onClick={toggleTableVisibility} className={styles.SetQuiz_viewHistoryButton}>
        {showTable ? "Hide Quiz History" : "View Quiz History"}
      </button>

      {showTable && (
        <div className={styles.SetQuiz_quizHistory}>
          <h2>Existing Quizzes</h2>
          <table className={styles.SetQuiz_questionsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Number of Questions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>{quiz.id}</td>
                    <td>{quiz.title}</td>
                    <td>{quiz.description}</td>
                    <td>{quiz.startDate}</td>
                    <td>{quiz.endDate}</td>
                    <td>{countNonNullQuestions(quiz)}</td>
                    <td>
                      <button
                        onClick={() => setEditData(quiz)}
                        className={styles.SetQuiz_editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className={styles.SetQuiz_deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.SetQuiz_noData}>
                    No quizzes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SetQuiz;

import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import styles from "./DynamicTable.module.css";

const DynamicTable = ({ onBack, submittedData }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(submittedData);
  }, [submittedData]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const deleteRow = (index) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  const duplicateRow = (index) => {
    const newRows = [...rows];
    const rowToDuplicate = { ...newRows[index] };
    newRows.splice(index + 1, 0, rowToDuplicate);
    setRows(newRows);
  };

  const handleRatingChange = (index, rating) => {
    const newRows = [...rows];
    newRows[index].ratings = rating;
    setRows(newRows);
  };

  return (
    <div className={styles.rate_container}>
      <button onClick={onBack} className={styles.back_Button}>
        Back to Quizzes
      </button>
      <h2 className={styles.title}>Rate a Mentee's Answer</h2>

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
          {rows.map((row, index) => (
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
                <button
                  onClick={() => duplicateRow(index)}
                  className={styles.rate_duplicateButton}
                >
                  + Rate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;

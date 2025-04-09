import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './DynamicTable.module.css'; // Import the CSS module

const DynamicTable = ({ setActivePage, submittedData }) => {  // Remove duplicate submittedData
  const [rows, setRows] = useState([]);

  
  useEffect(() => {
    setRows(Array.isArray(submittedData) ? submittedData : []);
  }, [submittedData]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleRatingChange = (index, rating) => {
    const newRows = [...rows];
    newRows[index].ratings = rating;
    setRows(newRows);
  };

  const handleBackClick = () => {
    alert("Hello");
    setActivePage('quizz');
  };

  return (
    <div className={styles.container}>
      <button onClick={handleBackClick} className={styles.backButton}>Back Quizes</button>
      <h2 className={styles.title}>Rate a Mentee's Answer</h2>

      <table className={styles.table}>
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
                  value={row.name || ''} // Handle undefined name
                  onChange={(e) => handleInputChange(index, e)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  name="surname" 
                  value={row.surname || ''} // Handle undefined surname
                  onChange={(e) => handleInputChange(index, e)}
                />
              </td>
              <td>
                <textarea 
                  name="questions" 
                  value={row.question || ''} // Handle undefined question
                  readOnly
                />
              </td>
              <td>
                <textarea 
                  name="answers" 
                  value={row.answer || ''} // Handle undefined answer
                  readOnly
                />
              </td>
              <td className={styles.rating}>
                {[...Array(5)].map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    color={starIndex < (row.ratings || 0) ? "#0d1431" : "gray"} // Handle undefined ratings
                    onClick={() => handleRatingChange(index, starIndex + 1)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </td>
              <td>
                <button onClick={() => deleteRow(index)} className={styles.deleteButton}>
                  Delete
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

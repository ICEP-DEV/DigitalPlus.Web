import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './DynamicTable.module.css'; // Import the CSS module

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
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleRatingChange = (index, rating) => {
    const newRows = [...rows];
    newRows[index].ratings = rating;
    setRows(newRows);
  };

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backButton}>Back Quizes</button>
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
                  value={row.name || ''} 
                  onChange={(e) => handleInputChange(index, e)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  name="surname" 
                  value={row.surname || ''} 
                  onChange={(e) => handleInputChange(index, e)}
                />
              </td>
              <td>
                <textarea 
                  name="questions" 
                  value={row.question} 
                  readOnly
                />
              </td>
              <td>
                <textarea 
                  name="answers" 
                  value={row.answer} 
                  readOnly
                />
              </td>
              <td className={styles.rating}>
                {[...Array(5)].map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    color={starIndex < (row.ratings || 0) ? "#0d1431" : "gray"}
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

// Styles specific to DynamicTable component are in DynamicTable.module.css
export default DynamicTable;

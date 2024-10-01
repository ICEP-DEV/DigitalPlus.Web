import React, { useState } from 'react';
import styles from './ScheduleComponent.module.css'; // Importing CSS for styling

const timeslots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Schedule = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ day: '', time: '' });
  const [formData, setFormData] = useState({ time: '', mentor: '', module: '' });
  const [schedule, setSchedule] = useState({});

  // Handle cell click to open popup
  const handleCellClick = (day, time) => {
    setSelectedSlot({ day, time });
    setPopupVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMentor = () => {
    const existingData = schedule[`${selectedSlot.day}-${selectedSlot.time}`] || [];
    setSchedule((prev) => ({
      ...prev,
      [`${selectedSlot.day}-${selectedSlot.time}`]: [...existingData, { ...formData }],
    }));
    setFormData({ time: '', mentor: '', module: '' });
  };

  const handleClearCell = (day, time) => {
    setSchedule((prev) => {
      const updatedSchedule = { ...prev };
      delete updatedSchedule[`${day}-${time}`];
      return updatedSchedule;
    });
  };

  const handleClearColumn = (day) => {
    setSchedule((prev) => {
      const updatedSchedule = { ...prev };
      timeslots.forEach((time) => {
        delete updatedSchedule[`${day}-${time}`];
      });
      return updatedSchedule;
    });
  };

  const handleSave = () => {
    setPopupVisible(false);
  };

  return (
    <div className={styles.scheduleContainer}>
  <div className={styles.scheduleHeader}>
    <h1>Mentor Roster</h1>
  </div>
  
  {/* Add the tableWrapper div to make the table scrollable */}
  <div className={styles.tableWrapper}>
    <table className={styles.timetable}>
      <thead>
        <tr>
          <th>TIME</th>
          {days.map((day) => (
            <th key={day}>
              <div className={styles.dayHeader}>
                {day}
                <button
                  className={styles.clearColumnButton}
                  onClick={() => handleClearColumn(day)}
                >
                  Clear {day}
                </button>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeslots.map((time) => (
          <tr key={time}>
            <td>{time}</td>
            {days.map((day) => (
              <td
                key={`${day}-${time}`}
                onClick={() => handleCellClick(day, time)}
                className={styles.cell}
              >
                {schedule[`${day}-${time}`]?.length ? (
                  <div className={styles.cellInfo}>
                    {schedule[`${day}-${time}`].map((data, index) => (
                      <div key={index} className={styles.mentorInfo}>
                        <strong>{data.mentor}</strong>
                        <p>{data.module}</p>
                      </div>
                    ))}
                    <button
                      className={styles.clearButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearCell(day, time);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className={styles.emptyCell}>Click to Add</div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Popup Form */}
  {popupVisible && (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h3>Enter Schedule Info</h3>
        <label>Time:</label>
        <select name="time" value={formData.time} onChange={handleChange}>
          <option>Select Time</option>
          {timeslots.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <label>Mentor:</label>
        <input
          name="mentor"
          type="text"
          value={formData.mentor}
          onChange={handleChange}
          placeholder="Enter Mentor"
        />

        <label>Module:</label>
        <input
          name="module"
          type="text"
          value={formData.module}
          onChange={handleChange}
          placeholder="Enter Module"
        />

        <div className={styles.popupActions}>
          <button onClick={handleAddMentor}>Add Mentor</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setPopupVisible(false)}>Close</button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default Schedule;

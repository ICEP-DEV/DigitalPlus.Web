import React, { useState } from 'react';
import styles from './ScheduleComponent.module.css';
import { GrSchedules } from "react-icons/gr";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const timeslots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', 
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const mentorModules = {
  'Mentor A': ['Module 1', 'Module 2'],
  'Mentor B': ['Module 2', 'Module 3'],
  'Mentor C': ['Module 1', 'Module 3'],
};

const mentors = Object.keys(mentorModules);

const Schedule = () => {
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ day: '', time: '' });
  const [formData, setFormData] = useState({ time: '', mentor: '', selectedModules: [] });
  const [schedule, setSchedule] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages

  const handleAddMentorClick = (day, time) => {
    setSelectedSlot({ day, time });
    setFormData({ time, mentor: '', selectedModules: [] });
    setAddPopupVisible(true);
  };

  const handleClearDay = (day) => {
    if (window.confirm(`Are you sure you want to clear all entries for ${day}?`)) {
      setSchedule((prev) => {
        const updatedSchedule = { ...prev };
        timeslots.forEach((time) => {
          delete updatedSchedule[`${day}-${time}`];
        });
        return updatedSchedule;
      });
      setSuccessMessage(`All entries for ${day} cleared successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEditClick = (day, time, index) => {
    const existingData = schedule[`${day}-${time}`] || [];
    if (existingData[index]) {
      const { mentor, selectedModules } = existingData[index];
      setFormData({ time, mentor, selectedModules, index });
      setSelectedSlot({ day, time });
      setEditPopupVisible(true);
    }
  };

  const handleDeleteClick = (day, time, index) => {
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      setSchedule(prev => {
        const updatedEntries = prev[`${day}-${time}`].filter((_, i) => i !== index);
        return {
          ...prev,
          [`${day}-${time}`]: updatedEntries.length ? updatedEntries : undefined,
        };
      });
      setSuccessMessage("Deleted successfully");
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mentor") {
      const selectedModules = mentorModules[value] || [];
      setFormData({ ...formData, [name]: value, selectedModules });
    } else if (name === "module") {
      setFormData((prev) => {
        const selectedModules = prev.selectedModules.includes(value)
          ? prev.selectedModules.filter((m) => m !== value)
          : [...prev.selectedModules, value];
        return { ...prev, selectedModules };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMentor = () => {
    const existingData = schedule[`${selectedSlot.day}-${formData.time}`] || [];
    setSchedule((prev) => ({
      ...prev,
      [`${selectedSlot.day}-${formData.time}`]: [...existingData, { ...formData }],
    }));
    setFormData({ time: '', mentor: '', selectedModules: [] });
    setAddPopupVisible(false);
  };

  const handleEditMentor = () => {
    if (window.confirm("Are you sure you want to save these edits?")) {
      setSchedule((prev) => {
        const updatedEntries = prev[`${selectedSlot.day}-${formData.time}`].map((entry, i) => 
          i === formData.index ? { ...formData } : entry
        );
        return { ...prev, [`${selectedSlot.day}-${formData.time}`]: updatedEntries };
      });
      setFormData({ time: '', mentor: '', selectedModules: [] });
      setEditPopupVisible(false);
      setSuccessMessage("Edited successfully");
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditPopupVisible(false);
  };

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.scheduleHeader}>
        <h1><GrSchedules /> Mentor Roster</h1>
      </div>

      {/* Display Success Message */}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.timetable}>
          <thead>
            <tr>
              <th>TIME</th>
              {days.map((day) => (
                <th key={day}>
                  <div className={styles.dayHeader}>
                    {day}
                    <FontAwesomeIcon
                      icon={faPlus}
                      className={`${styles.iconAction} ${styles.iconAdd}`} /* Add icon with green color */
                      onClick={() => handleAddMentorClick(day)}
                      title="Add"
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={`${styles.iconAction} ${styles.iconClear}`} /* Clear icon with red color */
                      onClick={() => handleClearDay(day)}
                      title="Clear All"
                    />
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
                  <td key={`${day}-${time}`} className={styles.cell}>
                    {schedule[`${day}-${time}`]?.length ? (
                      <div className={styles.cellInfo}>
                        {schedule[`${day}-${time}`].map((data, index) => (
                          <div key={index} className={styles.mentorInfo}>
                            <strong className={styles.mentorName}>{data.mentor}</strong>
                            <p className={styles.mentorModules}>{data.selectedModules.join(', ')}</p>
                            <div className={styles.icons}>
                              <FontAwesomeIcon
                                icon={faEdit}
                                className={styles.icon}
                                title="Edit"
                                onClick={() => handleEditClick(day, time, index)}
                              />
                              <FontAwesomeIcon
                                icon={faTrash}
                                className={styles.icon}
                                title="Delete"
                                onClick={() => handleDeleteClick(day, time, index)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyCell}></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Mentor Popup Form */}
      {addPopupVisible && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3 className={styles.dialogTitle}>Add Mentor</h3>
            
            {/* Form field for Time */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Time:</label>
              <select name="time" value={formData.time} onChange={handleChange} className={styles.formField}>
                <option value="">Select Time</option>
                {timeslots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Form field for Mentor */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Mentor:</label>
              <select name="mentor" value={formData.mentor} onChange={handleChange} className={styles.formField}>
                <option>Select Mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor} value={mentor}>
                    {mentor}
                  </option>
                ))}
              </select>
            </div>

            {/* Form field for Modules */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Modules:</label>
              <div className={styles.formField}>
                {mentorModules[formData.mentor]?.map((module) => (
                  <div key={module} className={styles.moduleOption}>
                    <span>{module}</span> {/* Module name first */}
                    <input
                      type="checkbox"
                      value={module}
                      checked={formData.selectedModules.includes(module)}
                      onChange={handleChange}
                      name="module"
                      className={styles.checkbox}
                    />
                  </div>
                )) || <p>No modules available</p>}
              </div>
            </div>

            <div className={styles.popupActions}>
              <button onClick={handleAddMentor}>Add Mentor</button>
              <button onClick={() => setAddPopupVisible(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Info Popup Form */}
      {editPopupVisible && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3 className={styles.dialogTitle}>Edit Schedule Info</h3>
            
            {/* Form field for Time */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Time:</label>
              <select name="time" value={formData.time} onChange={handleChange} className={styles.formField}>
                {timeslots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Form field for Mentor */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Mentor:</label>
              <select name="mentor" value={formData.mentor} onChange={handleChange} className={styles.formField}>
                <option>Select Mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor} value={mentor}>
                    {mentor}
                  </option>
                ))}
              </select>
            </div>

            {/* Form field for Modules */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Modules:</label>
              <div className={styles.formField}>
                {mentorModules[formData.mentor]?.map((module) => (
                  <div key={module} className={styles.moduleOption}>
                    <span>{module}</span> {/* Module name first */}
                    <input
                      type="checkbox"
                      value={module}
                      checked={formData.selectedModules.includes(module)}
                      onChange={handleChange}
                      name="module"
                      className={styles.checkbox}
                    />
                  </div>
                )) || <p>No modules available</p>}
              </div>
            </div>

            <div className={styles.popupActions}>
              <button onClick={handleEditMentor} className={styles.iconButton} title="Save Changes">
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button onClick={handleCancelEdit} className={styles.iconButton} title="Cancel Edit">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;

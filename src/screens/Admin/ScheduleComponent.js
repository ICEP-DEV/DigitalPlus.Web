import React, { useState, useEffect } from "react";
import styles from "./ScheduleComponent.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrSchedules } from "react-icons/gr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCheck,
  faTimes,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Make sure to import axios

const timeslots = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const mentorModules = {
  "Mentor A": ["Module 1", "Module 2"],
  "Mentor B": ["Module 2", "Module 3"],
  "Mentor C": ["Module 1", "Module 3"],
};

//Starting of the Function
const Schedule = () => {
  const [formData, setFormData] = useState({
    time: "",
    mentor: "",
    selectedModules: [],
    scheduleId: ""
  });

  const [selectedSlot, setSelectedSlot] = useState({
    day: "",
    time: "",
  });

  const getSavedSchedule = () => {
    const savedSchedule = localStorage.getItem("scheduleData");
    return savedSchedule ? JSON.parse(savedSchedule) : {};
  };

  const [mentorsdetailsb, setMentorsDetailsB] = useState([]);
  const [modulesb, setModulesB] = useState([]); // State to store modules based on mentorsId
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [schedule, setSchedule] = useState(getSavedSchedule());
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [mentorname, setMentorName] = useState("");
  const [scheduleToDelete, setScheduleToDelete] = useState(null); // Track which mentee to delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Save the schedule data to localStorage whenever it changes
    localStorage.setItem("scheduleData", JSON.stringify(schedule));
  }, [schedule]);

  // Retrieving data from the database
  useEffect(() => {
    const fetchMentordetailsB = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7163/api/DigitalPlusUser/GetAllMentors"
        );
        if (response.data) {
          setMentorsDetailsB(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMentorName = async (mentorId) => {
      try {
        const response = await axios.get(
          `https://localhost:7163/api/DigitalPlusUser/GetMentor/${mentorId}`
        );
        if (response.data) {
          setMentorName(response.data.firstName);
          console.log(response.data.firstName);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMentorName();
    fetchMentordetailsB();
  }, []);

  const fetchModulesByMentorsId = async (mentorId) => {
    console.log(mentorId);
    try {
      const response = await axios.get(
        `https://localhost:7163/api/AssignMod/getmodulesBy_MentorId/${mentorId}`
      );
      console.log(response.data);
      if (response.data.length > 0) {
        setModulesB(response.data);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      setModulesB([]); // Reset module on error
    }
  };

  const handleAddMentorClick = (day, time) => {
    setSelectedSlot({ day, time });
    setFormData({ time, mentor: "", selectedModules: [] });
    setAddPopupVisible(true);
  };

  const handleClearDay = (day) => {
    if (
      window.confirm(`Are you sure you want to clear all entries for ${day}?`)
    ) {
      setSchedule((prev) => {
        const updatedSchedule = { ...prev };
        timeslots.forEach((time) => {
          delete updatedSchedule[`${day}-${time}`];
        });
        return updatedSchedule;
      });

      setSuccessMessage(`All entries for ${day} cleared successfully.`);
      setTimeout(() => setSuccessMessage(""), 3000);
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

  const handleDeleteClick = async (day, time, index) => {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      try {
        // Check if we have a schedule entry (from day-time index)
        const entryToDelete = schedule[`${day}-${time}`]?.[index];
        const scheduleId = entryToDelete?.data?.result?.scheduleId || entryToDelete?.mentor?.scheduleId;
    
        // If scheduleToDelete is available (from dialog or other source)
        const scheduleIdFromDialog = scheduleToDelete?.scheduleId;
    
        // Use the scheduleId from the entry or the one from the dialog
        const finalScheduleId = scheduleId || scheduleIdFromDialog;
    
        if (!finalScheduleId) {
          console.error("Invalid entry or missing scheduleId:", entryToDelete);
          alert("Failed to find the schedule ID for deletion. Please make sure the schedule ID exists.");
          return;
        }
    
        // Perform the deletion with axios
        await axios.delete(`https://localhost:7163/api/DigitalPlusCrud/DeleteSchedule/${finalScheduleId}`);
    
        // Update the schedule state to remove the deleted entry
        setSchedule((prev) => {
          const updatedSchedule = { ...prev };
          if (scheduleId) {
            // Delete by day-time index
            const updatedEntries = updatedSchedule[`${day}-${time}`].filter((_, i) => i !== index);
            updatedSchedule[`${day}-${time}`] = updatedEntries.length ? updatedEntries : undefined;
          } else if (scheduleIdFromDialog) {
            // If using the scheduleId from the dialog (e.g., for batch deletions)
            updatedSchedule[`${day}-${time}`] = updatedSchedule[`${day}-${time}`]?.filter(
              schedule => schedule.scheduleId !== scheduleIdFromDialog
            );
          }
    
          return updatedSchedule;
        });
    
        // Show success message
        toast.success("Schedule deleted successfully!");
    
        // Reset states if applicable
        setDeleteDialogOpen(false); // Close dialog after deletion if applicable
        setScheduleToDelete(null); // Clear the selected schedule to delete (from dialog)
        
      } catch (error) {
        console.error("Error deleting schedule:", error);
        toast.error("Failed to delete schedule. Please try again.");
      }
    }
  };
  
  

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "mentor") {
      setFormData({ ...formData, mentor: value, selectedModules: [] });
      await fetchModulesByMentorsId(value); // Fetch modules only when mentor changes
    } else if (name === "module") {
      setFormData((prev) => {
        const selectedModules = Array.isArray(prev.selectedModules)
          ? prev.selectedModules
          : [];
        const isModuleSelected = selectedModules.includes(value);

        const updatedModules = isModuleSelected
          ? selectedModules.filter((module) => module !== value)
          : [...selectedModules, value];

        return { ...prev, selectedModules: updatedModules };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMentor = async (e) => {
    e.preventDefault();

    const payload = {
      scheduleId: formData.scheduleId,
      mentorId: formData.mentor,
      moduleCode: formData.module_Code,
      moduleDescription: formData.moduleDescription,
      adminId: formData.adminId,
      moduleId: formData.module_Id,
      moduleName: formData.module_Name,
      timeSlot: formData.time,
      daysOfTheWeek: selectedSlot.day,
      moduleList: formData.module_Code,
    };

    try {
      const response = await fetch(
        "https://localhost:7163/api/DigitalPlusCrud/AddSchedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to add mentor to the database");

      console.log("Schedule sent", await response.json());

      // Update the schedule in the table
      const existingData =
        schedule[`${selectedSlot.day}-${formData.time}`] || [];
      setSchedule((prev) => ({
        ...prev,
        [`${selectedSlot.day}-${formData.time}`]: [
          ...existingData,
          { ...formData },
        ],
      }));

      setAddPopupVisible(false);
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("There was an error adding the mentor. Please try again.");
    }
  };

  const handleEditMentor = () => {
    if (window.confirm("Are you sure you want to save these edits?")) {
      setSchedule((prev) => {
        const updatedEntries = prev[`${selectedSlot.day}-${formData.time}`].map(
          (entry, i) => (i === formData.index ? { ...formData } : entry)
        );
        return {
          ...prev,
          [`${selectedSlot.day}-${formData.time}`]: updatedEntries,
        };
      });
      setFormData({ time: "", mentor: "", selectedModules: [] });
      setEditPopupVisible(false);
      setSuccessMessage("Edited successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditPopupVisible(false);
  };

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.scheduleHeader}>
        <h1>
          <GrSchedules /> Mentor Roster
        </h1>
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
                            <strong className={styles.mentorName}>
                              {data.mentor}
                            </strong>
                            <p className={styles.mentorModules}>
                              {data.selectedModules.join(", ")}
                            </p>
                            <div className={styles.icons}>
                              <FontAwesomeIcon
                                icon={faEdit}
                                className={styles.icon}
                                title="Edit"
                                onClick={() =>
                                  handleEditClick(day, time, index)
                                }
                              />
                              <FontAwesomeIcon
                                icon={faTrash}
                                className={styles.icon}
                                title="Delete"
                                onClick={() =>
                                  handleDeleteClick(day, time, index)
                                }
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
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={styles.formField}
              >
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
              <select
                name="mentor"
                value={mentorname}
                onChange={handleChange}
                className={styles.formField}
              >
                <option>Select Mentor</option>
                {mentorsdetailsb.map((mentor) => (
                  <option key={mentor.mentorId} value={mentor.mentorId}>
                    {`${mentor.firstName} ${mentor.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            {/* Form field for Module */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Modules:</label>
              <div className={styles.checkboxContainer}>
                {modulesb.map((module) => (
                  <div key={module.moduleCode} className={styles.moduleOption}>
                    <input
                      type="checkbox"
                      id={`module-${module.module_Id}`}
                      value={module.moduleCode}
                      checked={
                        Array.isArray(formData.selectedModules) &&
                        formData.selectedModules.includes(module.moduleCode)
                      } // Check if selectedModules is an array before using includes
                      onChange={handleChange}
                      name="module"
                      className={styles.checkbox}
                    />
                    <label
                      htmlFor={`module-${module.module_Id}`}
                      className={styles.checkboxLabel}
                    >
                      {module.moduleCode}
                    </label>
                  </div>
                ))}
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
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={styles.formField}
              >
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
              <select
                name="mentor"
                value={formData.mentor}
                onChange={handleChange}
                className={styles.formField}
              >
                <option>Select Mentor</option>
                {mentorsdetailsb.map((mentor) => (
                  <option key={mentor} value={mentor}>
                    {`${mentor.firstName} ${mentor.lastName}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Form field for Modules */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Modules:</label>
              <div className={styles.formField}>
                {modulesb[formData.mentor]?.map((module) => (
                  <div key={module} className={styles.moduleOption}>
                    <span>{module}</span> {/* Module name first */}
                    <input
                      type=""
                      value={module.Module_Code}
                      checked={formData.selectedModules.includes(module)}
                      onChange={handleChange}
                      S
                      name="module"
                      className={styles.checkbox}
                    />
                  </div>
                )) || <p>No modules available</p>}
              </div>
            </div>

            <div className={styles.popupActions}>
              <button
                onClick={handleEditMentor}
                className={styles.iconButton}
                title="Save Changes"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                onClick={handleCancelEdit}
                className={styles.iconButton}
                title="Cancel Edit"
              >
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

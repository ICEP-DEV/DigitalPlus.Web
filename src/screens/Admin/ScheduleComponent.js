import React, { useState, useEffect } from "react";
import styles from "./ScheduleComponent.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrSchedules } from "react-icons/gr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus,faCheck,faTimes,faEdit,faTrash,} from "@fortawesome/free-solid-svg-icons";
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
const user = JSON.parse(localStorage.getItem("user"));
const adminId = user?.admin_Id;

//Starting of the Function
const Schedule = () => {
  const [formData, setFormData] = useState({
    time: "",
    mentor: "",
    adminId: adminId,
    selectedModules: [],
    scheduleId: "",
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

    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          "https://localhost:7163/api/DigitalPlusCrud/GetAllSchedules",
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch schedules.");
        }
        const data = await response.json();
        // Process the data into a suitable format for the schedule
        const formattedSchedule = data.reduce((acc, item) => {
          const key = `${item.dayOfTheWeek}-${item.timeSlot}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push({
            mentorName: item.mentorName,
            selectedModules: item.moduleList

          });
          return acc;
        }, {});
        setSchedule(formattedSchedule);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
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
    try {
      // Retrieve schedule data for the selected day and time
      const existingData = schedule[`${day}-${time}`] || [];
      if (!existingData[index]) {
        throw new Error("No data found for the selected schedule.");
      }

      // Extract relevant fields from the existing data
      const { mentorId, moduleList, scheduleId, mentorName } =
        existingData[index];

      // Update formData with the existing schedule details
      setFormData({
        time,
        mentor: mentorId,
        mentorName: mentorName || "", // Fallback to empty if mentorName is undefined
        selectedModules: moduleList || [], // Fallback to empty array
        index,
        scheduleId: scheduleId || "", // Ensure scheduleId is available
      });

      // Store selected slot information
      setSelectedSlot({ day, time });

      // Show the edit popup
      setEditPopupVisible(true);
    } catch (error) {
      console.error("Error during edit operation:", error.message);
      toast.error(
        error.message || "An error occurred while opening the edit form."
      );
    }
  };

  const handleDeleteClick = async (day, time, index) => {
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      try {
        const entryToDelete = schedule?.[`${day}-${time}`]?.[index];
  
        // Validate entry
        if (!entryToDelete) {
          console.error("No entry found for the provided day, time, and index:", {
            day,
            time,
            index,
          });
          alert("Failed to find the entry to delete. Please try again.");
          return;
        }
  
        const mentorId = entryToDelete?.mentor || entryToDelete?.mentorId;
        if (!mentorId) {
          console.error("Invalid entry or missing mentor ID:", entryToDelete);
          alert("Failed to find the mentor ID for deletion. Please ensure it exists.");
          return;
        }
  
        // Perform deletion
        const response = await axios.delete(
          `https://localhost:7163/api/DigitalPlusCrud/DeleteSchedulesByMentorId/mentor/${mentorId}`
        );
  
        if (response.status !== 204 && response.status !== 200) {
          throw new Error("Failed to delete the schedule on the server.");
        }
  
        // Update state
        setSchedule((prev) => {
          const updatedSchedule = { ...prev };
          const updatedEntries = updatedSchedule[`${day}-${time}`]?.filter(
            (_, i) => i !== index
          );
  
          if (updatedEntries?.length) {
            updatedSchedule[`${day}-${time}`] = updatedEntries;
          } else {
            delete updatedSchedule[`${day}-${time}`];
          }
  
          return updatedSchedule;
        });
  
        toast.success("Schedule deleted successfully!");
      } catch (error) {
        console.error("Error deleting schedule:", error);
        toast.error("Failed to delete schedule. Please try again.");
      }
    }
  };
  

  const handleChange = async (e) => {
    const { name, value } = e.target;
  
    if (name === "mentor") {
      // Find the selected mentor
      const selectedMentor = mentorsdetailsb.find(
        (mentor) => mentor.mentorId?.toString() === value
      );
  
      setFormData({
        ...formData,
        mentor: value,
        mentorName: selectedMentor
          ? `${selectedMentor.firstName} ${selectedMentor.lastName}`
          : "", // Fallback if mentor not found
        selectedModules: [], // Reset modules when mentor changes
      });
  
      if (value) {
        await fetchModulesByMentorsId(value);
      } else {
        console.warn("Mentor ID is undefined or invalid:", value);
      }
    } else if (name === "module") {
      // Add or remove modules
      setFormData((prev) => {
        const selectedModules = Array.isArray(prev.selectedModules)
          ? prev.selectedModules
          : [];
        const isModuleSelected = selectedModules.includes(value);
  
        const updatedModules = isModuleSelected
          ? selectedModules.filter((module) => module !== value) // Remove
          : [...selectedModules, value]; // Add
  
        return { ...prev, selectedModules: updatedModules };
      });
    } else {
      // Handle other fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleAddMentor = async (e) => {
    e.preventDefault();

    const payload = {
      ScheduleId: formData.scheduleId,
      MentorId: formData.mentor,
      MentorName: formData.mentorName,
      AdminId: adminId,
      TimeSlot: formData.time,
      DayOfTheWeek: selectedSlot.day,
      ModuleList: formData.selectedModules,
    };

    console.log("Payload:", payload); // Debugging line

    try {
      const response = await fetch(
        "https://localhost:7163/api/DigitalPlusCrud/CreateSchedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Details:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`Failed to add mentor. Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Schedule sent", responseData);

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

  const handleEditMentor = async () => {
    if (window.confirm("Are you sure you want to save these edits?")) {
      try {
        // Validate mentor ID
        const mentorId = formData.mentor || selectedSlot?.mentorId;
        if (!mentorId) {
          throw new Error("Mentor ID is missing. Please check your input.");
        }
  
        // Fetch existing schedule data
        const response = await fetch(
          "https://localhost:7163/api/DigitalPlusCrud/GetAllSchedules",
          {
            method: "GET",
          }
        );
  
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Schedule not found for the given Mentor ID.");
          } else {
            throw new Error("Failed to fetch schedule data. Please try again.");
          }
        }
  
        const existingData = await response.json();
  
        // Merge updated data with existing data
        const updatedSchedule = {
          ...existingData,
          ScheduleId: formData.scheduleId || existingData.scheduleId,
          MentorId: mentorId || existingData.mentorId,
          MentorName: formData.mentorName || existingData.mentorName,
          AdminId: formData.adminId || existingData.adminId,
          TimeSlot: formData.time || existingData.timeSlot,
          DayOfTheWeek: selectedSlot?.day || existingData.dayOfTheWeek,
          ModuleList: formData.selectedModules.length
            ? formData.selectedModules
            : existingData.moduleList,
        };
  
        // Update schedule on the server
        const updateResponse = await fetch(
          `https://localhost:7163/api/DigitalPlusCrud/UpdateSchedulesByMentorId/mentor/${mentorId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSchedule),
          }
        );
  
        if (!updateResponse.ok) {
          throw new Error("Failed to update the schedule. Please try again.");
        }
  
        // Update local state with new data
        setSchedule((prev) => {
          const updatedEntries = prev[`${selectedSlot?.day}-${formData.time}`].map(
            (entry, i) =>
              i === formData.index ? { ...entry, ...updatedSchedule } : entry
          );
          return {
            ...prev,
            [`${selectedSlot?.day}-${formData.time}`]: updatedEntries,
          };
        });
  
        // Reset form, close popup, and show success message
        setFormData({
          time: "",
          mentor: "",
          selectedModules: [],
          scheduleId: "",
        });
        setEditPopupVisible(false);
        setSuccessMessage("Edited successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error during edit operation:", error.message);
        toast.error(
          error.message ||
            "There was an error saving the changes. Please try again."
        );
      }
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
                              {data.mentorName}
                            </strong>
                            <p className={styles.mentorModules}>
                              {(data.selectedModules || []).join(", ")}
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
                value={formData.mentor}
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

            {/* Form field for Mentor Name */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Mentor Name:</label>
              <input
                type="text"
                name="mentorName"
                value={formData.mentorName}
                onChange={handleChange}
                className={styles.formField}
              />
            </div>

            {/* Form field for Day of the Week */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Day of the Week:</label>
              <select
                name="day"
                value={selectedSlot.day}
                onChange={(e) =>
                  setSelectedSlot({ ...selectedSlot, day: e.target.value })
                }
                className={styles.formField}
              >
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
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

            {/*Field for Schedule ID */}
            {/* <div className={styles.formRow}>
              <label className={styles.formLabel}>Schedule ID:</label>
              <input
                type="text"
                name="scheduleId"
                value={formData.scheduleId || ""} // The scheduleId is fetched from the database
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduleId: e.target.value,
                  }))
                }
                className={styles.formField}
                readOnly // Make the field read-only so users cannot change it
              />
            </div> */}

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

            {/* Mentor Dropdown */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Mentor:</label>
              <select
                name="mentor"
                value={formData.mentor}
                onChange={handleChange}
                className={styles.formField}
              >
                <option value="">Select Mentor</option>
                {mentorsdetailsb.map((mentor) => (
                  <option key={mentor.mentorId} value={mentor.mentorId}>
                    {`${mentor.firstName} ${mentor.lastName}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Mentor's Name Field */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Mentor's Name:</label>
              <input
                type="text"
                name="mentorName"
                value={formData.mentorName}
                readOnly
                className={styles.formField}
              />
            </div>

            {/* Form field for Day of the Week */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Day of the Week:</label>
              <select
                name="day"
                value={selectedSlot.day}
                onChange={(e) =>
                  setSelectedSlot({ ...selectedSlot, day: e.target.value })
                }
                className={styles.formField}
              >
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Form field for Modules */}
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

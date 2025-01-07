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

//Starting of the Function
const Schedule = () => {
  const [formData, setFormData] = useState({
    time: "",
    mentor: "",
    mentorId: "",
    adminId: "1",
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
      if (!mentorId) {
        console.error("mentorId is not defined");
        return;
      }

      try {
        const response = await axios.get(
          `https://localhost:7163/api/DigitalPlusUser/GetMentor/${mentorId}`
        );

        if (response.data && response.data.firstName) {
          setMentorName(response.data.firstName);
          console.log(response.data.firstName);
        } else {
          console.error(
            "Mentor data is not in the expected format",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching mentor name:", error);
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
        const scheduleId =
          entryToDelete?.data?.result?.scheduleId ||
          entryToDelete?.mentor?.scheduleId;

        // If scheduleToDelete is available (from dialog or other source)
        const scheduleIdFromDialog = scheduleToDelete?.scheduleId;

        // Use the scheduleId from the entry or the one from the dialog
        const finalScheduleId = scheduleId || scheduleIdFromDialog;

        if (!finalScheduleId) {
          console.error("Invalid entry or missing scheduleId:", entryToDelete);
          alert(
            "Failed to find the schedule ID for deletion. Please make sure the schedule ID exists."
          );
          return;
        }

        // Perform the deletion with axios
        await axios.delete(
          `https://localhost:7163/api/DigitalPlusCrud/DeleteSchedule/${finalScheduleId}`
        );

        // Update the schedule state to remove the deleted entry
        setSchedule((prev) => {
          const updatedSchedule = { ...prev };
          if (scheduleId) {
            // Delete by day-time index
            const updatedEntries = updatedSchedule[`${day}-${time}`].filter(
              (_, i) => i !== index
            );
            updatedSchedule[`${day}-${time}`] = updatedEntries.length
              ? updatedEntries
              : undefined;
          } else if (scheduleIdFromDialog) {
            // If using the scheduleId from the dialog (e.g., for batch deletions)
            updatedSchedule[`${day}-${time}`] = updatedSchedule[
              `${day}-${time}`
            ]?.filter(
              (schedule) => schedule.scheduleId !== scheduleIdFromDialog
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
      // Find the selected mentor's full name
      const selectedMentor = mentorsdetailsb.find(
        (mentor) => mentor.mentorId.toString() === value
      );

      // Update the formData with mentor details and reset selectedModules
      setFormData({
        ...formData,
        mentor: value,
        mentorName: selectedMentor
          ? `${selectedMentor.firstName} ${selectedMentor.lastName}`
          : "", // Fallback if mentor not found
        selectedModules: [], // Reset modules when the mentor changes
      });

      // Fetch modules for the selected mentor
      await fetchModulesByMentorsId(value);
    } else if (name === "module") {
      // Handle adding/removing modules
      setFormData((prev) => {
        const selectedModules = Array.isArray(prev.selectedModules)
          ? prev.selectedModules
          : [];
        const isModuleSelected = selectedModules.includes(value);

        const updatedModules = isModuleSelected
          ? selectedModules.filter((module) => module !== value) // Remove module
          : [...selectedModules, value]; // Add module

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
      scheduleId: formData.scheduleId,
      mentorId: formData.mentor,
      mentorName: formData.mentorName,
      adminId: formData.adminId,
      timeSlot: formData.time,
      daysOfTheWeek: selectedSlot.day,
      moduleList: formData.selectedModules,
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
        const errorText = await response.text(); // Get error details
        console.error("Server response:", errorText); // Log server response
        throw new Error("Failed to add mentor to the database");
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
        // Fetch the existing data from the database for the given scheduleId
        const scheduleId = formData.scheduleId; // Ensure formData has the scheduleId field
        const response = await fetch(
          `https://localhost:7163/api/DigitalPlusCrud/GetSchedule/${scheduleId}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch existing schedule data.");
        }

        const existingData = await response.json();

        // Check if we successfully fetched the existing schedule
        if (!existingData) {
          throw new Error("No existing schedule found for the given ID.");
        }

        // Merge the updated data with the existing data
        const updatedSchedule = {
          ...existingData,
          scheduleId: formData.scheduleId || existingData.scheduleId,
          mentorId: formData.mentor || existingData.mentorId, // Preserve previous data if not updated
          mentorName: formData.mentorName || existingData.mentorName,
          adminId: formData.adminId || existingData.adminId,
          timeSlot: formData.time || existingData.timeSlot,
          daysOfTheWeek: selectedSlot.day || existingData.daysOfTheWeek,
          moduleList: formData.selectedModules || existingData.moduleList,
          // moduleCode: formData.module_Code || existingData.moduleCode,
          //moduleDescription: formData.moduleDescription || existingData.moduleDescription,
          // moduleId: formData.module_Id || existingData.moduleId,
          // moduleName: formData.module_Name || existingData.moduleName,
        };

        // Send the updated data back to the server
        const updateResponse = await fetch(
          `https://localhost:7163/api/DigitalPlusCrud/UpdateSchedule/${scheduleId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSchedule),
          }
        );

        if (!updateResponse.ok) {
          throw new Error("Failed to update the schedule.");
        }

        // Update the schedule in the local state
        setSchedule((prev) => {
          const updatedEntries = prev[
            `${selectedSlot.day}-${formData.time}`
          ].map((entry, i) => (i === formData.index ? updatedSchedule : entry));
          return {
            ...prev,
            [`${selectedSlot.day}-${formData.time}`]: updatedEntries,
          };
        });

        // Reset form and hide the edit popup
        setFormData({ time: "", mentor: "", selectedModules: [] });
        setEditPopupVisible(false);
        setSuccessMessage("Edited successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error during edit operation:", error);
        toast.error("There was an error saving the changes. Please try again.");
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

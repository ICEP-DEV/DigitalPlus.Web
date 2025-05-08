import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Save,
  Update,
  ManageAccounts,
  Delete,
  AssignmentInd,
  Cancel,
  Book,
} from "@mui/icons-material";
import { Icon, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./MenteeModule.module.css";
import NavBar from "./Navigation/NavBar.jsx";
import SideBar from "./Navigation/SideBar";
import Modal from "react-modal"; // Use react-modal for the dialog

Modal.setAppElement("#root"); // Accessibility requirement for React Modal

export default function MenteeModulePage() {
  const [modules, setModules] = useState([]); // Store all modules globally
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseModules, setCourseModules] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [checkedModules, setCheckedModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedModules, setAssignedModules] = useState([]);

  const navigate = useNavigate();

  // Retrieve mentee ID from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const menteeId = user?.mentee_Id;
  const departmentId = user?.departmentId;

  console.log("Mentee ID:", menteeId);

  // Fetch department info when departmentId changes
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        if (!departmentId)
          throw new Error("Department ID not in local storage");

        const response = await axios.get(
          `https://localhost:7163/api/DigitalPlusCrud/GetDepartment/${departmentId}`
        );
        if (response.data?.result) {
          setSelectedDepartment(response.data.result.department_Name);
        }
      } catch (err) {
        console.error("Error fetching department:", err.message);
        setError(err.message);
      }
    };

    fetchDepartment();
  }, [departmentId]);

  // Fetch courses when departmentId changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!departmentId)
          throw new Error("Department ID not in local storage");

        const response = await axios.get(
          `https://localhost:7163/api/DigitalPlusCrud/GetCoursesByDepartment/${departmentId}`
        );
        if (response.data) {
          setAllCourses(response.data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err.message);
        setError(err.message);
      }
    };

    fetchCourses();
  }, [departmentId]);

  // Fetch course modules when selectedCourse changes
  useEffect(() => {
    const fetchCourseModules = async () => {
      try {
        if (!selectedCourse) {
          setError("Please select a course to view its modules.");
          setCourseModules([]);
          return;
        }

        const response = await axios.get(
          `https://localhost:7163/api/DigitalPlusCrud/GetModulesByCourseId/course/${selectedCourse}`
        );
        if (response.data && response.data.length > 0) {
          setCourseModules(response.data);
        } else {
          setCourseModules([]);
          setError("No modules found for the selected course.");
        }
      } catch (err) {
        console.error("Error fetching course modules:", err.message);
        setError("Error fetching modules for the selected course.");
      }
    };

    fetchCourseModules();
  }, [selectedCourse]);

  // Fetch assigned and all modules when menteeId changes
  useEffect(() => {
    const fetchModules = async () => {
      try {
        if (!menteeId) throw new Error("Mentee ID not found in local storage.");

        // Fetch all modules
        const allModulesResponse = await axios.get(
          "https://localhost:7163/api/DigitalPlusCrud/GetAllModules"
        );
        const allModules = allModulesResponse.data;
        localStorage.setItem("modules", JSON.stringify(allModules));

        // Fetch modules assigned to mentee
        const assignedResponse = await axios.get(
          `https://localhost:7163/api/AssignMod/getmodulesBy_MenteeId/${menteeId}`
        );
        const assignedModules = assignedResponse.data || [];

        setAssignedModules(assignedModules);

        // Match assigned modules to full details
        const detailedAssigned = assignedModules.map((module) => {
          const detailed = allModules.find(
            (m) => m.module_Id === module.moduleId
          );
          return detailed || module;
        });

        setModules(detailedAssigned);
        console.log("Assigned Module Details:", detailedAssigned);
      } catch (err) {
        console.error("Error fetching modules:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [menteeId]);

  const handleNavigation = (moduleCode) => {
    const selectedModule = modules.find((m) => m.module_Code === moduleCode);
    const moduleId = selectedModule?.module_Id;

    if (!moduleId) {
      console.error(`Module ID not found for moduleCode: ${moduleCode}`);
    } else {
      console.log(`Navigating to module:`, { moduleCode, moduleId });

      // Save the selected module details in localStorage
      localStorage.setItem(
        "selectedModule",
        JSON.stringify({ moduleCode, moduleId })
      );

      navigate(`/mentee-dashboard/modules/${moduleCode}`);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment("");
    setSelectedCourse("");
    setCheckedModules([]);
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourse(courseId);
  };

  const handleModuleSelection = (event) => {
    setCheckedModules(event.target.value);
  };

  const handleRemoveModule = async (assignModId) => {
    console.log(assignModId);
    try {
      await axios.delete(
        `https://localhost:7163/api/AssignMod/deleteMentee/${assignModId}`
      );
      // Update assignedModules state by filtering out the deleted module
      setModules((prevAssignedModules) =>
        prevAssignedModules.filter(
          (module) => module.assignModId !== assignModId
        )
      );
      console.log("Module removed successfully.");
    } catch (error) {
      console.error("Error removing module:", error);
      console.log("Failed to remove module. Please try again.", "error");
    }
  };

  // const handleModuleCheck = (moduleId) => {

  //   console.log(moduleId);

  //   setCheckedModules((prev) => {
  //     if (prev.includes(moduleId)) {
  //       return prev.filter((id) => id !== moduleId);
  //     }
  //     return [...prev, moduleId];
  //   });

  // };

  const handleAddModules = async () => {
    try {
      const modulesToadd = checkedModules.map((moduleId) => ({
        menteeId,
        moduleId,
      }));

      await Promise.all(
        modulesToadd.map((assignment) =>
          axios.post(
            "https://localhost:7163/api/AssignMod/MenteeAssignMod",
            assignment
          )
        )
      );

      setCheckedModules([]);
      closeModal();
    } catch (err) {
      console.error("Error adding modules:", err);
      setError("Failed to add selected modules.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredModules = courseModules.filter(
    (module) =>
      module.module_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.module_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavBar />
      <SideBar modules={modules} /> {/* Pass the module list to Sidebar */}
      <div className={styles["course-modules"]}>
        <button className={styles["add-module-button"]} onClick={openModal}>
          MANAGE MODULES
        </button>
        <h1>Assigned Modules</h1>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingMessage}>Loading Modules Data...</p>
          </div>
        ) : modules.length > 0 ? (
          <div className={styles["module-grid"]}>
            {modules.map(
              (module) =>
                module?.module_Code && (
                  <div key={module.module_Id} className={styles["module-card"]}>
                    <img
                      className={styles["module-image"]}
                      src={`https://picsum.photos/seed/${module.module_Code}/300/200`} // Dynamic image URL
                      alt={module.description || "Module Image"}
                    />
                    <div className={styles["module-content"]}>
                      <h2>{module.module_Name}</h2>
                      <p>{module.description || "No description available."}</p>
                      <button
                        className={styles["module-button"]}
                        onClick={() => handleNavigation(module.module_Code)}
                      >
                        {module.module_Code}
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        ) : (
          <p>No modules assigned to this mentee yet.</p>
        )}
      </div>
      {/* Modal for Adding Modules */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Module"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Add Module</h2>
        <form>
          <label>
            Department:
            <input
              type="text"
              value={selectedDepartment}
              placeholder={selectedDepartment}
              readOnly
            />
          </label>
          <label>
            Course:
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseSelection(e.target.value)}
            >
              <option value="">Select Course</option>
              {allCourses.map((course) => (
                <option key={course.course_Id} value={course.course_Id}>
                  {course.course_Name}
                </option>
              ))}
            </select>
          </label>

          {/* Display assigned modules with remove icons */}
          {assignedModules.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {assignedModules.map((module) => (
                <div
                  key={module.moduleId}
                  value={module.assignModId}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Button variant="outlined" style={{ textTransform: "none" }}>
                    {module.moduleCode}
                  </Button>
                  <IconButton
                    aria-label="remove"
                    color="secondary"
                    onClick={() => handleRemoveModule(module.assignModId)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              ))}
            </div>
          ) : (
            <Typography color="textSecondary" style={{ marginBottom: "16px" }}>
              No modules assigned.
            </Typography>
          )}

          {/* Select Modules */}
          <Select
            multiple
            displayEmpty
            value={checkedModules}
            onChange={handleModuleSelection}
            fullWidth
            renderValue={(selected) =>
              selected.length === 0 ? (
                <em>Select Modules</em>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selected.map((id) => {
                    const module = modules.find(
                      (module) => module.module_Id === id
                    );
                    return (
                      <Button
                        key={id}
                        variant="contained"
                        size="small"
                        style={{ textTransform: "none" }}
                      >
                        {module?.module_Code}
                      </Button>
                    );
                  })}
                </div>
              )
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            <MenuItem disabled value="">
              <em>Select Modules</em>
            </MenuItem>
            {filteredModules
              .filter(
                (module) =>
                  !assignedModules.some(
                    (assigned) => assigned.moduleId === module.module_Id
                  ) && !checkedModules.includes(module.module_Id)
              )
              .map((module) => (
                <MenuItem key={module.module_Id} value={module.module_Id}>
                  {module.module_Code} - {module.course_Name}
                </MenuItem>
              ))}
          </Select>

          <div className={styles["modal-buttons"]}>
            <button type="button" onClick={handleAddModules}>
              Add Selected Modules
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

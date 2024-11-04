import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FaBook,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import styles from "./ModulesContent.module.css";

const ModulesContent = () => {
  const carouselRef = useRef(null);
   const [modules, setModules] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [filteredModules, setFilteredModules] = useState([]);
  const [Module_Name, setModuleName] = useState("");
  const [Module_Code, setModuleCode] = useState("");
  const [Course_Id, setCourseId] = useState("");
  const [Description, setDescription] = useState("");
  const [Department_Id, setDepartment] = useState("");
  const [editingModule, setEditingModule] = useState(null);
  const [allDepartments, setAllDepartments]= useState([]);

  // Define an array of random colors
  const backgroundColors = [
    "#FFEBEE",
    "#E3F2FD",
    "#E8F5E9",
    "#FFF3E0",
    "#F3E5F5",
    "#FBE9E7",
    "#FFFDE7",
    "#E0F7FA",
  ];

  // Function to get a random background color
  const getRandomColor = () =>
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  // State to manage modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllDepartments');
      console.log (response.data.result);
      setAllDepartments(response.data.result); // assuming response.data is an array
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch Module
  const fetchModules = async () => {
    try {
        const response = await axios.get("https://localhost:7163/api/DigitalPlusCrud/GetAllModules", {
            params: { department: selectedDepartment }
        });
        console.log("Fetched modules:", response.data); // Add this line
        setModules(response.data);
        setFilteredModules(response.data);
    } catch (error) {
        console.error("Error fetching modules:", error);
        // Optionally reset to empty array on error
        setFilteredModules([]); 
    }
};

  // Call fetchDepartments in useEffect
  useEffect(() => {
    fetchDepartments();
    //fetchModules();
  }, []);

  const handleDepartmentChange = async (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);

    // Fetch modules based on the new department selection
    await fetchModules(); // Call fetchModules directly
  };

  const handleAddModule = async () => {
    if (Module_Name && Module_Code && Course_Id && Description && Department_Id) {
      if (!Module_Name || !Module_Code || !Course_Id || !Description || !Department_Id) {
        alert("Please fill in all required fields.");
        return;
      }
      try {
        const newModule = {
          moduleName: Module_Name, // adjust field names based on API docs
          moduleCode: Module_Code,
          courseId: Course_Id,
          description: Description,
          departmentId: Department_Id, // assuming single department ID is expected
          backgroundColor: getRandomColor(),
        };

        await axios.post("https://localhost:7163/api/DigitalPlusCrud/AddModule", newModule);
        fetchModules();
        setIsModalOpen(false);
        resetForm();
      } catch (error) {
        console.error("Error adding module:", error.response ? error.response.data : error.message);
      }
    } else {
      alert("Please fill in all required fields.");
    }
};

  const handleDeleteModule = async (Module_Id) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        await axios.delete(
          `https://localhost:7163/api/DigitalPlusCrud/DeleteModule/${Module_Id}`
        );
        fetchModules();
      } catch (error) {
        console.error("Error deleting module:", error);
        // Optionally, show a user-friendly error message here
      }
    }
  };

  const handleEditModule = (modules) => {
    setEditingModule(modules);
    setModuleName(modules.Module_Name);
    setModuleCode(modules.Module_Code);
    setCourseId(modules.Course_Id);
    setDescription(modules.Description);
    setIsModalOpen(true);
  };

  const handleUpdateModule = async (Module_Id) => {
    if (Module_Name && Course_Id && Description) {
      const updatedModule = {
        name: Module_Name,
        courseId: Course_Id,
        description: Description,
      };
      await axios.put(
        `https://localhost:7163/api/DigitalPlusCrud/UpdateModule/${Module_Id}`,
        updatedModule
      );
      fetchModules();
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setEditingModule(null);
    setModuleName("");
    setModuleCode("");
    setCourseId("");
    setDescription("");
  };

  // Carousel navigation handlers
  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= 200;
    }
  };

  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += 200;
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    if (window.confirm("Are you sure you want to cancel editing?")) {
      setEditingModule(null);
      setModuleName("");
      setModuleCode("");
      setCourseId("");
      setDescription("");
      setIsModalOpen(false); // Close the modal
    }
  };

  return (
    <div className={styles.modulesContainer}>
      <h2 className={styles.modulesTitle}>
        <FaBook /> Modules
      </h2>

      {/* Department Dropdown */}
      <div className={styles.modulesDepartmentDropdown}>
        <select value={selectedDepartment} onChange={handleDepartmentChange}>
          <option value="All">All Departments</option>
          {allDepartments.map((dep,xid) => (
                        <option key={xid+1} value={xid+1}>
                          {dep.department_Name}
                        </option>
                      ))}
       
        </select>
      </div>

      {/* Carousel with filtered modules */}
      <div className={styles.modulesCarousel}>
        <button
          className={`${styles.modulesCarouselBtn} ${styles.modulesLeftBtn}`}
          onClick={handlePrevClick}
          aria-label="Previous"
        >
          {"<"}
        </button>
        <div className={styles.modulesCarouselItems} ref={carouselRef}>
        {Array.isArray(filteredModules) && filteredModules.map((module) => (
            <div
              className={styles.modulesCarouselItem}
              key={module.code} // Use module code as the key
              style={{ backgroundColor: module.backgroundColor }}
            >
              {/* Module icon above the details */}
              <div className={styles.modulesModuleIcon}>{module.icon}</div>

              {/* Display module details */}
              <p>
                <strong>Name:</strong> {module.Module_Name}
              </p>
              <p>
                <strong>Code:</strong> {module.Module_Code}
              </p>
              <p>
                <strong>Course ID:</strong> {module.Course_Id}
              </p>
              <p>
                <strong>Description:</strong> {module.Description}
              </p>

              {/* Icons for Edit and Delete at the bottom left corner */}
              <div className={styles.moduleIcons}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => handleEditModule(module)}
                  title="Edit Module"
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => handleDeleteModule(module.code)}
                  title="Delete Module"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className={`${styles.modulesCarouselBtn} ${styles.modulesLeftBtn}`}
          onClick={handleNextClick}
          aria-label="Next"
        >
          {">"}
        </button>
      </div>

      {/* Add Module Button under the carousel */}
      <div className={styles.addModuleContainer}>
        <button
          className={styles.addModuleButton}
          onClick={(handleAddModule) => {
            setEditingModule(null); // Clear editingModule
            setModuleName("");
            setModuleCode("");
            setCourseId("");
            setDescription("");
            setIsModalOpen(true); // Open the modal
          }}
          title="Add Module"
        >
          <FaPlus className={styles.addModuleIcon} />
        </button>
      </div>

      {/* Modal for Add/Edit Module */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* Form content */}
            <div className={styles.modulesFormContainer}>
              {/* Add/Edit Module Section */}
              <div className={styles.modulesAddModuleSection}>
                {/* Section 1 */}
                <div className={styles.formSection}>
                  <label className={styles.label}>Module Name</label>
                  <input
                    type="text"
                    value={Module_Name}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Module Name"
                    className={styles.newModuleInput}
                  />
                  <label className={styles.label}>Module Code</label>
                  <input
                    type="text"
                    value={Module_Code}
                    onChange={(e) => setModuleCode(e.target.value)}
                    placeholder="Module Code"
                    className={styles.newModuleInput}
                    disabled={!!editingModule} // Disable code input when editing
                  />
                </div>
                {/* Section 2 */}
                <div className={styles.formSection}>
                  <label className={styles.label}>Course ID</label>
                  <input
                    type="text"
                    value={Course_Id}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="Course ID"
                    className={styles.newModuleInput}
                  />
                  <label className={styles.label}>Description</label>
                  <textarea
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className={styles.newModuleTextarea}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {editingModule ? (
                <div className={styles.editModuleActions}>
                  <button
                    className={styles.updateModuleButton}
                    onClick={handleUpdateModule(editingModule.Module_Id)}
                    title="Update Module"
                  >
                    <FaCheck className={styles.updateModuleIcon} />
                  </button>
                  <button
                    className={styles.cancelModuleButton}
                    onClick={handleCancelEdit}
                    title="Cancel Editing"
                  >
                    <FaTimes className={styles.cancelModuleIcon} />
                  </button>
                </div>
              ) : (
                <div className={styles.addModuleActions}>
                  <button
                    className={styles.updateModuleButton}
                    onClick={handleAddModule}
                    title="Add Module"
                  >
                    <FaCheck className={styles.updateModuleIcon} />
                  </button>
                  <button
                    className={styles.cancelModuleButton}
                    onClick={() => setIsModalOpen(false)}
                    title="Cancel"
                  >
                    <FaTimes className={styles.cancelModuleIcon} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesContent;

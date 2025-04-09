import React, { useState, useRef, useEffect } from "react";
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

  // Hardcoded list of departments
  const [departments, setDepartments] = useState([]);

  // State to hold modules
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to hold the currently selected department and filtered modules
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredModules, setFilteredModules] = useState([]);

  // State for managing new module creation and editing
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleCode, setNewModuleCode] = useState("");
  const [newCourseId, setNewCourseId] = useState(0);
  const [newDescription, setNewDescription] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [editingModule, setEditingModule] = useState(null); // State for the module being edited

  // State to manage modal open/close
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");

  // Fetch modules from the server when the component mounts
  useEffect(() => {
    fetchModulesFromServer();
  }, []);

  // Function to fetch modules from the server
  const fetchModulesFromServer = () => {
    setLoading(true);
    fetch("https://localhost:7163/api/DigitalPlusCrud/GetAllModules")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch modules");
        }
      })
      .then((data) => {
        // Assign random colors and icons to each module
        const modulesWithStyles = data.map((module) => ({
          ...module,
          department: module.department || "Unknown Department", // Ensure department is set
          icon: <FaBook size={40} />,
          backgroundColor: getRandomColor(),
        }));
        setModules(modulesWithStyles);
        filterModules(modulesWithStyles, selectedDepartment);
        setLoading(false);
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  };

  // Function to filter modules based on selected department
  const filterModules = (modulesList, departmentId) => {
    if (departmentId === "ALL DEPARTMENTS" || departmentId === "") {
      setFilteredModules(modulesList);
    } else {
      const filtered = modulesList.filter(
        (module) => module.department_Id === parseInt(departmentId) // Ensure correct type
      );
      setFilteredModules(filtered);
    }
  };

  // Function to add a new module
  const handleAddModule = () => {
    console.log("New Department Value:", newDepartment); // Debugging log

    if (
      newModuleName.trim() !== "" &&
      newModuleCode.trim() !== "" &&
      newCourseId !== 0 &&
      newDescription.trim() !== "" &&
      newDepartment !== "" // Ensure newDepartment is not empty
    ) {
      if (window.confirm("Are you sure you want to add this module?")) {
        const newModule = {
          module_Id: 0,
          module_Name: newModuleName,
          module_Code: newModuleCode,
          course_Id: parseInt(newCourseId),
          description: newDescription,
          department_Id: parseInt(newDepartment) || 0, // Ensure it's a number
        };

        // Send POST request to API
        fetch("https://localhost:7163/api/DigitalPlusCrud/AddModule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newModule),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Failed to add module");
            }
          })
          .then((data) => {
            // Clear input fields
            setNewModuleName("");
            setNewModuleCode("");
            setNewCourseId(0);
            setNewDescription("");
            setNewDepartment("");
            setIsModuleModalOpen(false); // Close the modal

            // Refresh modules
            fetchModulesFromServer();
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Function to edit an existing module
  const handleEditModule = (module) => {
    setEditingModule(module);
    setNewModuleName(module.module_Name);
    setNewModuleCode(module.module_Code);
    setNewCourseId(module.course_Id);
    setNewDescription(module.description);
    setNewDepartment(module.department_Id);
    setIsModuleModalOpen(true); // Open the modal for editing
  };

  // Function to delete a module
  const handleDeleteModule = (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      fetch(
        `https://localhost:7163/api/DigitalPlusCrud/DeleteModule/${moduleId}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => {
          if (response.ok) {
            alert("Module deleted successfully");
            fetchModulesFromServer(); // Refresh the module list
          } else {
            throw new Error("Failed to delete module");
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  //Fetch departments from the server
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    fetch("https://localhost:7163/api/DigitalPlusCrud/GetAllDepartments")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Debugging

        if (Array.isArray(data.result)) {
          setDepartments(data.result); // ✅ Store only the array of departments
        } else {
          console.error("API did not return an array:", data);
          setDepartments([]); // Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        setDepartments([]); // Ensure it's always an array
      });
  };

  // Function to add a new department
  const handleAddDepartment = () => {
    if (newDepartmentName.trim() !== "") {
      if (window.confirm("Are you sure you want to add this department?")) {
        const newDepartment = {
          department_Id: 0, // Adjust this based on your API model
          department_Name: newDepartmentName, // Adjust this based on your API model
        };

        // Send POST request to the backend
        fetch("https://localhost:7163/api/DigitalPlusCrud/AddDepartment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDepartment),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Failed to add department");
            }
          })
          .then((data) => {
            // Update the state with the new department
            setDepartments((prevDepartments) => [...prevDepartments, data]);
            setNewDepartmentName("");
            setIsDepartmentModalOpen(false); // Close the modal
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    } else {
      alert("Please enter a department name.");
    }
  };

  // Function to handle department dropdown change
  const handleDepartmentChange = (event) => {
    const selectedDept = event.target.value;
    setSelectedDepartment(selectedDept);
    filterModules(modules, selectedDept);
  };

  console.log(departments);
  console.log(module.department_Id);
  console.log(
    departments.find((d) => d.department_Id === module.department_Id)
  );

  return (
    <div className={styles.modulesContainer}>
      <h2 className={styles.modulesTitle}>
        <FaBook /> Modules
      </h2>

      {/* Department Dropdown */}
      <div className={styles.modulesDepartmentDropdown}>
        <select
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className={styles.newModuleSelect}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.department_Id} value={dept.department_Id}>
              {dept.department_Name}
            </option>
          ))}
        </select>
      </div>

      {/* Carousel with filtered modules */}
      {loading ? (
        <p>Loading modules...</p>
      ) : (
        <div className={styles.modulesCarousel}>
          <div className={styles.modulesCarouselItems} ref={carouselRef}>
            {filteredModules.map((module) => (
              <div
                className={styles.modulesCarouselItem}
                key={module.module_Id}
              >
                {/* Module Details */}
                <div className={styles.moduleDetails}>
                  <p>
                    <strong>Name:</strong> {module.module_Name}
                  </p>
                  <p>
                    <strong>Code:</strong> {module.module_Code}
                  </p>
                  <p>
                    <strong>Course ID:</strong> {module.course_Id}
                  </p>
                  <p>
                    <strong>Description:</strong> {module.description}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {departments.find(
                      (d) => d.department_Id === module.department_Id
                    )?.department_Name || "Unknown"}
                  </p>
                </div>

                {/* Edit & Delete Buttons on the Right */}
                <div className={styles.moduleIcons}>
                  <button
                    onClick={() => handleEditModule(module)}
                    className={styles.editIcon}
                    title="Edit Module"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module.module_Id)}
                    className={styles.deleteIcon}
                    title="Delete Module"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Module Button under the carousel */}
      <div className={styles.addModuleContainer}>
        <button
          className={styles.addModuleButton}
          onClick={() => {
            setIsModuleModalOpen(true); // Open the module modal
          }}
          title="Add Module"
        >
          <FaPlus className={styles.addModuleIcon} />
        </button>
      </div>

      {/* Add Department Button */}
      <div className={styles.addDepartmentContainer}>
        <button
          className={styles.addDepartmentButton}
          onClick={() => {
            setIsDepartmentModalOpen(true); // Open the department modal
          }}
          title="Add Department"
        >
          <FaPlus className={styles.addDepartmentIcon} />
        </button>
      </div>

      {/* Department Table Below Add Icon */}
      <div className={styles.departmentTableContainer}>
        <h3>Departments</h3>
        <table className={styles.departmentTable}>
          <thead>
            <tr>
              <th>Department Name</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept.department_Id}>
                  <td>{dept.department_Name}</td>{" "}
                  {/* ✅ Correctly extract department name */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="1">No departments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Module */}
      {isModuleModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* Form content */}
            <div className={styles.modulesFormContainer}>
              <div className={styles.modulesAddModuleSection}>
                <div className={styles.formSection}>
                  <label className={styles.label}>Module Name</label>
                  <input
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="Module Name"
                    className={styles.newModuleInput}
                  />
                  <label className={styles.label}>Module Code</label>
                  <input
                    type="text"
                    value={newModuleCode}
                    onChange={(e) => setNewModuleCode(e.target.value)}
                    placeholder="Module Code"
                    className={styles.newModuleInput}
                    disabled={!!editingModule} // Disable code input when editing
                  />
                </div>
                <div className={styles.formSection}>
                  <label className={styles.label}>Course ID</label>
                  <input
                    type="number"
                    value={newCourseId}
                    onChange={(e) =>
                      setNewCourseId(parseInt(e.target.value) || 0)
                    }
                    placeholder="Course ID"
                    className={styles.newModuleInput}
                  />
                  <label className={styles.label}>Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Description"
                    className={styles.newModuleTextarea}
                  />
                  <label className={styles.label}>Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(parseInt(e.target.value))}
                    className={styles.newModuleSelect}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option
                        key={dept.department_Id}
                        value={dept.department_Id}
                      >
                        {dept.department_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.addModuleActions}>
                <button
                  className={styles.addModuleButton}
                  onClick={editingModule ? handleEditModule : handleAddModule}
                  title={editingModule ? "Update Module" : "Add Module"}
                >
                  <FaCheck className={styles.addModuleIcon} />
                </button>
                <button
                  className={styles.cancelModuleButton}
                  onClick={() => setIsModuleModalOpen(false)}
                  title="Cancel"
                >
                  <FaTimes className={styles.cancelModuleIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add Department */}
      {isDepartmentModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modulesFormContainer}>
              <div className={styles.modulesAddModuleSection}>
                <div className={styles.formSection}>
                  <label className={styles.label}>Department Name</label>
                  <input
                    type="text"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    placeholder="Department Name"
                    className={styles.newModuleInput}
                  />
                </div>
              </div>
              <div className={styles.addModuleActions}>
                <button
                  className={styles.addModuleButton}
                  onClick={handleAddDepartment}
                  title="Add Department"
                >
                  <FaCheck className={styles.addModuleIcon} />
                </button>
                <button
                  className={styles.cancelModuleButton}
                  onClick={() => setIsDepartmentModalOpen(false)}
                  title="Cancel"
                >
                  <FaTimes className={styles.cancelModuleIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesContent;

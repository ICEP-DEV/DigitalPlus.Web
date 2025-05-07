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
  const [courses, setCourses] = useState([]);
  const [newCourseCode, setNewCourseCode] = useState("");

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
  const [newCourseName, setNewCourseName] = useState("");
  const [selectedCourseDeptId, setSelectedCourseDeptId] = useState("");

  // State to manage modal open/close
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);

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
        const modulesWithStyles = data.map((module) => {
          const course = courses.find((c) => c.course_Id === module.course_Id);
          const department = course ? course.department_Id : null;

          return {
            ...module,
            department_Id: department,
            course_Name: course ? course.course_Name : "Unknown",
            icon: <FaBook size={40} />,
            backgroundColor: getRandomColor(),
          };
        });

        setModules(modulesWithStyles);
        filterModules(modulesWithStyles, selectedDepartment);
        setLoading(false);
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  };

  // fetching the courses from the server
  useEffect(() => {
    fetch("https://localhost:7163/api/DigitalPlusCrud/GetAllCourses")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.result)) {
          setCourses(data.result);
        } else {
          console.error("Course API did not return an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  //adding the course to the module
  const handleAddCourse = () => {
    if (!newCourseName || !newCourseCode || !selectedCourseDeptId)
      return alert("All fields required.");

    const newCourse = {
      course_Id: 0,
      course_Name: newCourseName,
      course_Code: newCourseCode,
      department_Id: parseInt(selectedCourseDeptId),
    };

    fetch("https://localhost:7163/api/DigitalPlusCrud/AddCourse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    })
      .then((res) => res.json())
      .then(() => {
        setNewCourseName("");
        setNewCourseCode("");
        setSelectedCourseDeptId("");
        setIsAddCourseModalOpen(false);
        // Refresh courses
        fetch("https://localhost:7163/api/DigitalPlusCrud/GetAllCourses")
          .then((res) => res.json())
          .then((data) => setCourses(data.result || []));
      })
      .catch((err) => alert("Error adding course: " + err.message));
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Delete this course?")) {
      fetch(`https://localhost:7163/api/DigitalPlusCrud/DeleteCourse/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete course");
          // Refresh list
          setCourses((prev) => prev.filter((c) => c.course_Id !== id));
        })
        .catch((err) => alert(err.message));
    }
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

  // Function to update an existing module
  const handleUpdateModule = () => {
    if (
      newModuleName.trim() !== "" &&
      newModuleCode.trim() !== "" &&
      newCourseId !== 0 &&
      newDescription.trim() !== "" &&
      newDepartment !== ""
    ) {
      const updatedModule = {
        module_Id: editingModule.module_Id,
        module_Name: newModuleName,
        module_Code: newModuleCode,
        course_Id: parseInt(newCourseId),
        description: newDescription,
        department_Id: parseInt(newDepartment),
      };

      console.log("Prepared updated module:", updatedModule);
      setPendingUpdateData(updatedModule);
      setShowConfirmModal(true); // Show confirmation modal
    } else {
      console.log("Validation failed");
      alert("Please fill in all fields.");
    }

    const confirmUpdateModule = () => {
      if (!pendingUpdateData) return;
    
      fetch("https://localhost:7163/api/DigitalPlusCrud/UpdateModule", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pendingUpdateData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Module updated successfully");
            setIsModuleModalOpen(false);
            setEditingModule(null);
            setNewModuleName("");
            setNewModuleCode("");
            setNewCourseId(0);
            setNewDescription("");
            setNewDepartment("");
            fetchModulesFromServer(); // Refresh list
          } else {
            throw new Error("Failed to update module");
          }
        })
        .catch((error) => {
          console.error("Error updating module:", error);
        })
        .finally(() => {
          setShowConfirmModal(false);
          setPendingUpdateData(null);
        });
    };
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

  const handleDeleteDepartment = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      fetch(
        `https://localhost:7163/api/DigitalPlusCrud/DeleteDepartment/${id}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete department");
          setDepartments((prev) => prev.filter((d) => d.department_Id !== id));
        })
        .catch((err) => alert(err.message));
    }
  };

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
            {filteredModules.map((module) => {
              const course = courses.find(
                (c) => c.course_Id === module.course_Id
              );
              const department = departments.find(
                (d) => d.department_Id === course?.department_Id
              );

              return (
                <div
                  className={styles.modulesCarouselItem}
                  key={module.module_Id}
                >
                  <div className={styles.moduleDetails}>
                    <p>
                      <strong>Name:</strong> {module.module_Name}
                    </p>
                    <p>
                      <strong>Code:</strong> {module.module_Code}
                    </p>
                    <p>
                      <strong>Course:</strong>{" "}
                      {course?.course_Name || "Unknown"}
                    </p>
                    <p>
                      <strong>Description:</strong> {module.description}
                    </p>
                    <p>
                      <strong>Department:</strong>{" "}
                      {department?.department_Name || "Unknown"}
                    </p>
                  </div>

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
              );
            })}
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

      {/* Add Course Button */}
      <button onClick={() => setIsAddCourseModalOpen(true)}>
        <FaPlus /> Add Course
      </button>

      {/* Add Department Button */}
      <div className={styles.addDepartmentContainer}>
        <button
          className={styles.addDepartmentButton}
          onClick={() => {
            setIsDepartmentModalOpen(true); // Open the department modal
          }}
          title="Add Department"
        >
          <FaPlus className={styles.addDepartmentIcon} /> Add Department
        </button>
      </div>

      <div className={styles.departmentTableContainer}>
        <h3>Courses</h3>
        <table className={styles.departmentTable}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => {
                const dept = departments.find(
                  (d) => d.department_Id === course.department_Id
                );
                return (
                  <tr key={course.course_Id}>
                    <td>{course.course_Code}</td>
                    <td>{course.course_Name}</td>
                    <td>{dept?.department_Name || "Unknown"}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteCourse(course.course_Id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3">No courses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Department Table Below Add Icon */}
      <div className={styles.departmentTableContainer}>
        <h3>Departments</h3>
        <table className={styles.departmentTable}>
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept.department_Id}>
                  <td>{dept.department_Name}</td>{" "}
                  <td>
                    <button
                      onClick={() => handleDeleteDepartment(dept.department_Id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
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
                  <label className={styles.label}>Course</label>
                  <select
                    value={newCourseId}
                    onChange={(e) => {
                      const selectedCourseId = parseInt(e.target.value);
                      setNewCourseId(selectedCourseId);

                      const selectedCourse = courses.find(
                        (course) => course.course_Id === selectedCourseId
                      );
                      if (selectedCourse) {
                        setNewDepartment(selectedCourse.department_Id); // ✅ This line is crucial
                      } else {
                        setNewDepartment("");
                      }
                    }}
                    className={styles.newModuleSelect}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.course_Id} value={course.course_Id}>
                        {course.course_Name}
                      </option>
                    ))}
                  </select>

                  <label className={styles.label}>Department</label>
                  <input
                    type="text"
                    value={
                      departments.find(
                        (d) => d.department_Id === parseInt(newDepartment)
                      )?.department_Name || ""
                    }
                    disabled
                    className={styles.newModuleInput}
                  />

                  <label className={styles.label}>Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Description"
                    className={styles.newModuleTextarea}
                  />
                </div>
              </div>
              <div className={styles.addModuleActions}>
                <button
                  className={styles.addModuleButton}
                  onClick={editingModule ? handleUpdateModule : handleAddModule}
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

      {/* Modal for managing the course*/}
      {isAddCourseModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modulesFormContainer}>
              <div className={styles.modulesAddModuleSection}>
                <label className={styles.label}>Course Name</label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className={styles.newModuleInput}
                />
                <label className={styles.label}>Course Code</label>
                <input
                  type="text"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className={styles.newModuleInput}
                />
                <label className={styles.label}>Department</label>
                <select
                  value={selectedCourseDeptId}
                  onChange={(e) => setSelectedCourseDeptId(e.target.value)}
                  className={styles.newModuleSelect}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.department_Id} value={d.department_Id}>
                      {d.department_Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.addModuleActions}>
                <button
                  className={styles.addModuleButton}
                  onClick={handleAddCourse}
                >
                  <FaCheck />
                </button>
                <button
                  className={styles.cancelModuleButton}
                  onClick={() => setIsAddCourseModalOpen(false)}
                >
                  <FaTimes />
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

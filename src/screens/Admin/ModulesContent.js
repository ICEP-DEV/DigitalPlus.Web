import React, { useState, useRef, useEffect } from 'react';
import {
  FaBook,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCheck,
} from 'react-icons/fa';
import styles from './ModulesContent.module.css';

const ModulesContent = () => {
  const carouselRef = useRef(null);

  // Define an array of random colors
  const backgroundColors = [
    '#FFEBEE',
    '#E3F2FD',
    '#E8F5E9',
    '#FFF3E0',
    '#F3E5F5',
    '#FBE9E7',
    '#FFFDE7',
    '#E0F7FA',
  ];

  // Function to get a random background color
  const getRandomColor = () =>
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  // Hardcoded list of departments
  const departments = [
    'ALL DEPARTMENTS',
    'COMPUTER SCIENCE',
    'MULTIMEDIA COMPUTING',
    'COMPUTER SYSTEM ENGINEERING',
    'INFORMATICS',
    'INFORMATION TECHNOLOGY',
  ];

  // State to hold modules
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to hold the currently selected department and filtered modules
  const [selectedDepartment, setSelectedDepartment] = useState(
    'ALL DEPARTMENTS'
  );
  const [filteredModules, setFilteredModules] = useState([]);

  // State for managing new module creation and editing
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleCode, setNewModuleCode] = useState('');
  const [newCourseId, setNewCourseId] = useState(0);
  const [newDescription, setNewDescription] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [editingModule, setEditingModule] = useState(null); // State for the module being edited

  // State to manage modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch modules from the server when the component mounts
  useEffect(() => {
    fetchModulesFromServer();
  }, []);

  // Function to fetch modules from the server
  const fetchModulesFromServer = () => {
    setLoading(true);
    fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllModules')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch modules');
        }
      })
      .then((data) => {
        // Assign random colors and icons to each module
        const modulesWithStyles = data.map((module) => ({
          ...module,
          department: module.department || 'Unknown Department', // Ensure department is set
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
  const filterModules = (modulesList, department) => {
    if (department === 'ALL DEPARTMENTS') {
      setFilteredModules(modulesList);
    } else {
      const filtered = modulesList.filter(
        (module) => module.department === department
      );
      setFilteredModules(filtered);
    }
  };

  // Function to handle department dropdown change
  const handleDepartmentChange = (e) => {
    const selected = e.target.value;
    setSelectedDepartment(selected);
    filterModules(modules, selected);
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / 3;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNextClick = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / 3;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Function to add a new module
  const handleAddModule = () => {
    if (
      newModuleName.trim() !== '' &&
      newModuleCode.trim() !== '' &&
      newCourseId !== 0 &&
      newDescription.trim() !== '' &&
      newDepartment.trim() !== ''
    ) {
      if (window.confirm('Are you sure you want to add this module?')) {
        const newModule = {
          module_Id: 0,
          module_Name: newModuleName,
          module_Code: newModuleCode,
          course_Id: parseInt(newCourseId),
          description: newDescription,
          department: newDepartment,
        };

        // Send POST request to API
        fetch('https://localhost:7163/api/DigitalPlusCrud/AddModule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newModule),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to add module');
            }
          })
          .then((data) => {
            // Clear the input fields
            setNewModuleName('');
            setNewModuleCode('');
            setNewCourseId(0);
            setNewDescription('');
            setNewDepartment('');
            setIsModalOpen(false); // Close the modal

            // Refresh modules from the server
            fetchModulesFromServer();
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Function to delete a module
  const handleDeleteModule = (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      fetch(
        `https://localhost:7163/api/DigitalPlusCrud/DeleteModule/${moduleId}`,
        {
          method: 'DELETE',
        }
      )
        .then((response) => {
          if (response.ok) {
            // Refresh modules from the server
            fetchModulesFromServer();
          } else {
            throw new Error('Failed to delete module');
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  // Function to start editing a module
  const handleEditModule = (module) => {
    setEditingModule(module);
    setNewModuleName(module.module_Name);
    setNewModuleCode(module.module_Code);
    setNewCourseId(module.course_Id);
    setNewDescription(module.description);
    setNewDepartment(module.department);
    setIsModalOpen(true); // Open the modal
  };

  // Function to update a module
  const handleUpdateModule = () => {
    if (
      newModuleName.trim() !== '' &&
      newCourseId !== 0 &&
      newDescription.trim() !== '' &&
      newDepartment.trim() !== ''
    ) {
      if (window.confirm('Are you sure you want to update this module?')) {
        const updatedModule = {
          module_Id: editingModule.module_Id,
          module_Name: newModuleName,
          module_Code: newModuleCode,
          course_Id: parseInt(newCourseId),
          description: newDescription,
          department: newDepartment,
        };

        // Send PUT request to API
        fetch(
          `https://localhost:7163/api/DigitalPlusCrud/UpdateModule/${editingModule.module_Id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedModule),
          }
        )
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to update module');
            }
          })
          .then((data) => {
            // Clear the editing state and input fields
            setEditingModule(null);
            setNewModuleName('');
            setNewModuleCode('');
            setNewCourseId(0);
            setNewDescription('');
            setNewDepartment('');
            setIsModalOpen(false); // Close the modal

            // Refresh modules from the server
            fetchModulesFromServer();
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    if (window.confirm('Are you sure you want to cancel editing?')) {
      setEditingModule(null);
      setNewModuleName('');
      setNewModuleCode('');
      setNewCourseId(0);
      setNewDescription('');
      setNewDepartment('');
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
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Carousel with filtered modules */}
      {loading ? (
        <p>Loading modules...</p>
      ) : (
        <div className={styles.modulesCarousel}>
          <button
            className={`${styles.modulesCarouselBtn} ${styles.modulesLeftBtn}`}
            onClick={handlePrevClick}
            aria-label="Previous"
          >
            {'<'}
          </button>
          <div className={styles.modulesCarouselItems} ref={carouselRef}>
            {filteredModules.map((module) => (
              <div
                className={styles.modulesCarouselItem}
                key={module.module_Id}
                style={{ backgroundColor: module.backgroundColor }}
              >
                {/* Module icon above the details */}
                <div className={styles.modulesModuleIcon}>{module.icon}</div>

                {/* Display module details */}
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
                  <strong>Department:</strong> {module.department}
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
                    onClick={() => handleDeleteModule(module.module_Id)}
                    title="Delete Module"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            className={`${styles.modulesCarouselBtn} ${styles.modulesRightBtn}`}
            onClick={handleNextClick}
            aria-label="Next"
          >
            {'>'}
          </button>
        </div>
      )}

      {/* Add Module Button under the carousel */}
      <div className={styles.addModuleContainer}>
        <button
          className={styles.addModuleButton}
          onClick={() => {
            setEditingModule(null); // Clear editingModule
            setNewModuleName('');
            setNewModuleCode('');
            setNewCourseId(0);
            setNewDescription('');
            setNewDepartment('');
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
                {/* Section 2 */}
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
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className={styles.newModuleSelect}
                  >
                    <option value="">Select Department</option>
                    {departments.slice(1).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              {editingModule ? (
                <div className={styles.editModuleActions}>
                  <button
                    className={styles.updateModuleButton}
                    onClick={handleUpdateModule}
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

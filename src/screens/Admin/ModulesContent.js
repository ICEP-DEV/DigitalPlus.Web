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
  const [departments, setDepartments] = useState([
    'ALL DEPARTMENTS',
    'COMPUTER SCIENCE',
    'MULTIMEDIA COMPUTING',
    'COMPUTER SYSTEM ENGINEERING',
    'INFORMATICS',
    'INFORMATION TECHNOLOGY',
  ]);

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
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');

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
            setIsModuleModalOpen(false); // Close the modal

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

  // Function to edit an existing module
  const handleEditModule = (module) => {
    setEditingModule(module);
    setNewModuleName(module.module_Name);
    setNewModuleCode(module.module_Code);
    setNewCourseId(module.course_Id);
    setNewDescription(module.description);
    setNewDepartment(module.department);
    setIsModuleModalOpen(true); // Open the modal for editing
  };

  // Function to delete a module
  const handleDeleteModule = (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      fetch(`https://localhost:7163/api/DigitalPlusCrud/DeleteModule/${moduleId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            alert('Module deleted successfully');
            fetchModulesFromServer(); // Refresh the module list
          } else {
            throw new Error('Failed to delete module');
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  // Function to add a new department
  const handleAddDepartment = () => {
    if (newDepartmentName.trim() !== '') {
      const updatedDepartments = [...departments, newDepartmentName];
      setDepartments(updatedDepartments);
      setNewDepartmentName('');
      setIsDepartmentModalOpen(false); // Close the modal
    } else {
      alert('Please enter a department name.');
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

                {/* Edit and Delete buttons */}
                <div className={styles.modulesActionButtons}>
                  <button
                    onClick={() => handleEditModule(module)}
                    className={styles.editButton}
                    title="Edit Module"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module.module_Id)}
                    className={styles.deleteButton}
                    title="Delete Module"
                  >
                    <FaTrash />
                  </button>
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
            {departments.map((dept) => (
              <tr key={dept}>
                <td>{dept}</td>
              </tr>
            ))}
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
              <div className={styles.addModuleActions}>
                <button
                  className={styles.addModuleButton}
                  onClick={handleAddModule}
                  title="Add Module"
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
                </button>kj
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


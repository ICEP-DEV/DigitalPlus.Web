import React, { useState, useRef } from 'react';
import { 
  FaBook, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaTimes, 
  FaCheck 
} from 'react-icons/fa'; // Imported FaCheck for the green tick icon
import styles from './ModulesContent.module.css';

const ModulesContent = () => {
  const carouselRef = useRef(null);

  // Define an array of random colors
  const backgroundColors = [
    '#FFEBEE', '#E3F2FD', '#E8F5E9',
    '#FFF3E0', '#F3E5F5', '#FBE9E7',
    '#FFFDE7', '#E0F7FA'
  ];

  // Function to get a random background color
  const getRandomColor = () =>
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  // Initial modules data
  const initialModules = [
    {
      name: 'Programming Fundamentals',
      code: 'PF101',
      courseId: 'CS101',
      description: 'Introduction to programming concepts.',
      department: 'Department 1',
      icon: <FaBook size={40} />, // Adjusted icon size
      backgroundColor: getRandomColor(),
    },
    {
      name: 'Web Development',
      code: 'WD201',
      courseId: 'CS201',
      description: 'Learn how to build modern web applications.',
      department: 'Department 1',
      icon: <FaBook size={40} />,
      backgroundColor: getRandomColor(),
    },
    {
      name: 'Computer Architecture',
      code: 'CA301',
      courseId: 'CS301',
      description: 'Study the internal workings of computers.',
      department: 'Department 2',
      icon: <FaBook size={40} />,
      backgroundColor: getRandomColor(),
    },
    {
      name: 'Data Structures',
      code: 'DS401',
      courseId: 'CS401',
      description: 'Advanced data structures and algorithms.',
      department: 'Department 2',
      icon: <FaBook size={40} />,
      backgroundColor: getRandomColor(),
    },
    {
      name: 'Cyber Security',
      code: 'CS501',
      courseId: 'CS501',
      description: 'Fundamentals of cyber security.',
      department: 'Department 3',
      icon: <FaBook size={40} />,
      backgroundColor: getRandomColor(),
    },
  ];

  // State to hold modules
  const [modules, setModules] = useState(initialModules);

  // State to hold the currently selected department and filtered modules
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [filteredModules, setFilteredModules] = useState(modules);

  // State for managing new module creation and editing
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleCode, setNewModuleCode] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingModule, setEditingModule] = useState(null); // State for the module being edited

  // State to manage modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle department dropdown change
  const handleDepartmentChange = (e) => {
    const selected = e.target.value;
    setSelectedDepartment(selected);

    if (selected === 'All') {
      setFilteredModules(modules); // Show all modules
    } else {
      // Filter modules by the selected department
      const filtered = modules.filter((module) => module.department === selected);
      setFilteredModules(filtered);
    }
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
      newCourseId.trim() !== '' &&
      newDescription.trim() !== '' &&
      !modules.some((module) => module.code === newModuleCode)
    ) {
      if (window.confirm('Are you sure you want to add this module?')) {
        const newModule = {
          name: newModuleName,
          code: newModuleCode,
          courseId: newCourseId,
          description: newDescription,
          department: selectedDepartment,
          icon: <FaBook size={40} />, // Adjusted icon size
          backgroundColor: getRandomColor(),
        };
        const updatedModules = [...modules, newModule];
        setModules(updatedModules);
        // Update the filtered modules
        if (selectedDepartment === 'All' || selectedDepartment === newModule.department) {
          setFilteredModules([...filteredModules, newModule]);
        }
        // Clear the input fields
        setNewModuleName('');
        setNewModuleCode('');
        setNewCourseId('');
        setNewDescription('');
        setIsModalOpen(false); // Close the modal
      }
    } else {
      alert('Please fill in all fields or check if the Module Code is unique.');
    }
  };

  // Function to delete a module
  const handleDeleteModule = (moduleCode) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      const updatedModules = modules.filter(
        (module) => module.code !== moduleCode
      );
      setModules(updatedModules);
      // Update the filtered modules
      const updatedFilteredModules = filteredModules.filter(
        (module) => module.code !== moduleCode
      );
      setFilteredModules(updatedFilteredModules);
    }
  };

  // Function to start editing a module
  const handleEditModule = (module) => {
    setEditingModule(module);
    setNewModuleName(module.name);
    setNewModuleCode(module.code);
    setNewCourseId(module.courseId);
    setNewDescription(module.description);
    setIsModalOpen(true); // Open the modal
  };

  // Function to update a module
  const handleUpdateModule = () => {
    if (
      newModuleName.trim() !== '' &&
      newModuleCode.trim() !== '' &&
      newCourseId.trim() !== '' &&
      newDescription.trim() !== ''
    ) {
      if (
        window.confirm('Are you sure you want to update this module?')
      ) {
        const updatedModule = {
          ...editingModule,
          name: newModuleName,
          // code: newModuleCode, // Code is not changed during editing
          courseId: newCourseId,
          description: newDescription,
        };

        const updatedModules = modules.map((module) =>
          module.code === editingModule.code ? updatedModule : module
        );
        setModules(updatedModules);

        // Update the filtered modules
        const updatedFilteredModules = filteredModules.map((module) =>
          module.code === editingModule.code ? updatedModule : module
        );
        setFilteredModules(updatedFilteredModules);

        // Clear the editing state and input fields
        setEditingModule(null);
        setNewModuleName('');
        setNewModuleCode('');
        setNewCourseId('');
        setNewDescription('');
        setIsModalOpen(false); // Close the modal
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
      setNewCourseId('');
      setNewDescription('');
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
          <option value="Department 1">Department 1</option>
          <option value="Department 2">Department 2</option>
          <option value="Department 3">Department 3</option>
        </select>
      </div>

      {/* Carousel with filtered modules */}
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
              key={module.code} // Use module code as the key
              style={{ backgroundColor: module.backgroundColor }}
            >
              {/* Module icon above the details */}
              <div className={styles.modulesModuleIcon}>{module.icon}</div>

              {/* Display module details */}
              <p>
                <strong>Name:</strong> {module.name}
              </p>
              <p>
                <strong>Code:</strong> {module.code}
              </p>
              <p>
                <strong>Course ID:</strong> {module.courseId}
              </p>
              <p>
                <strong>Description:</strong> {module.description}
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
          className={`${styles.modulesCarouselBtn} ${styles.modulesRightBtn}`}
          onClick={handleNextClick}
          aria-label="Next"
        >
          {'>'}
        </button>
      </div>

      {/* Add Module Button under the carousel */}
      <div className={styles.addModuleContainer}>
        <button
          className={styles.addModuleButton}
          onClick={() => {
            setEditingModule(null); // Clear editingModule
            setNewModuleName('');
            setNewModuleCode('');
            setNewCourseId('');
            setNewDescription('');
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
                    type="text"
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
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

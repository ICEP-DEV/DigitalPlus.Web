import React, { useState, useRef } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa'; // Import the FaTrash icon
import styles from './ModulesContent.module.css'; // Import CSS module
import { MdAssignmentInd } from "react-icons/md";
import { MdAssignmentAdd } from "react-icons/md";

const ModulesContent = () => {
  const carouselRef = useRef(null);

  // Define an array of random colors
  const backgroundColors = ['#FFEBEE', '#E3F2FD', '#E8F5E9', '#FFF3E0', '#F3E5F5', '#FBE9E7', '#FFFDE7', '#E0F7FA'];

  // Function to get a random background color
  const getRandomColor = () => backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  // Modules with their associated faculty
  const allModules = [
    { id: 'PPAF05D', faculty: 'Faculty 1', icon: <FaBook size={60} />, backgroundColor: getRandomColor(), mentors: ['Masedi SK', 'Malebana PJ'] },
    { id: 'WEBF15D', faculty: 'Faculty 1', icon: <FaBook size={60} />, backgroundColor: getRandomColor(), mentors: [] },
    { id: 'CFAF05D', faculty: 'Faculty 2', icon: <FaBook size={60} />, backgroundColor: getRandomColor(), mentors: [] },
    { id: 'DATA05D', faculty: 'Faculty 2', icon: <FaBook size={60} />, backgroundColor: getRandomColor(), mentors: ['John Doe'] },
    { id: 'SEC05D', faculty: 'Faculty 3', icon: <FaBook size={60} />, backgroundColor: getRandomColor(), mentors: [] }
  ];

  // State to hold the currently selected faculty and filtered modules
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [filteredModules, setFilteredModules] = useState(allModules);

  // State for managing new module creation and mentor assignment
  const [newModuleId, setNewModuleId] = useState('');
  const existingMentors = ['Masedi SK', 'Malebana PJ', 'John Doe', 'Jane Smith', 'Lerato M'];
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');

  // Function to handle dropdown change
  const handleFacultyChange = (e) => {
    const selected = e.target.value;
    setSelectedFaculty(selected);

    if (selected === 'All') {
      setFilteredModules(allModules); // Show all modules
    } else {
      // Filter modules by the selected faculty
      const filtered = allModules.filter((module) => module.faculty === selected);
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

  const handleAddModule = () => {
    if (newModuleId.trim() !== '' && !allModules.some(module => module.id === newModuleId)) {
      const newModule = { id: newModuleId, faculty: selectedFaculty, icon: <FaBook size={60} />, backgroundColor: getRandomColor(), mentors: [] };
      setFilteredModules([...filteredModules, newModule]);
      setNewModuleId('');
    }
  };

  const handleAssignMentor = () => {
    if (selectedModule && selectedMentor) {
      const updatedModules = filteredModules.map((module) => {
        if (module.id === selectedModule && !module.mentors.includes(selectedMentor)) {
          return { ...module, mentors: [...module.mentors, selectedMentor] };
        }
        return module;
      });
      setFilteredModules(updatedModules);
      setSelectedMentor('');
    }
  };

  const handleDeleteMentor = (mentorToRemove, moduleId) => {
    const updatedModules = filteredModules.map((module) => {
      if (module.id === moduleId) {
        return { ...module, mentors: module.mentors.filter((mentor) => mentor !== mentorToRemove) };
      }
      return module;
    });
    setFilteredModules(updatedModules);
  };

  return (
    <div className={styles.modulesContainer}>
      <h2 className={styles.modulesTitle}> <FaBook /> Modules</h2>

      {/* Faculty Dropdown */}
      <div className={styles.modulesFacultyDropdown}>
        <select value={selectedFaculty} onChange={handleFacultyChange}>
          <option value="All">All Faculties</option>
          <option value="Faculty 1">Faculty 1</option>
          <option value="Faculty 2">Faculty 2</option>
          <option value="Faculty 3">Faculty 3</option>
        </select>
      </div>

      {/* Carousel with filtered modules */}
      <div className={styles.modulesCarousel}>
        <button className={`${styles.modulesCarouselBtn} ${styles.modulesLeftBtn}`} onClick={handlePrevClick}>
          {'<'}
        </button>
        <div className={styles.modulesCarouselItems} ref={carouselRef}>
          {filteredModules.map((module) => (
            <div
              className={styles.modulesCarouselItem}
              key={module.id}
              style={{ backgroundColor: module.backgroundColor }} // Apply background color here
            >
              <div className={styles.modulesModuleIcon}>{module.icon}</div>
              <p>{module.id}</p>
              <div className={styles.modulesMentorList}>
                {module.mentors.map((mentor, index) => (
                  <div key={index} className={styles.modulesMentorItem}>
                    <span className={styles.mentorName}>{mentor}</span>
                    <FaTrash 
                      className={styles.trashIcon} 
                      onClick={() => handleDeleteMentor(mentor, module.id)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className={`${styles.modulesCarouselBtn} ${styles.modulesRightBtn}`} onClick={handleNextClick}>
          {'>'}
        </button>
      </div>

      {/* Assign Mentor to Module Section */}
      <div className={styles.modulesFormContainer}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <div className={styles.modulesSelectSection}>
            <label className={styles.label}>Select Module</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className={styles.modulesSelect}
            >
              <option value="">Select Module</option>
              {filteredModules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.id}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.mentorsSelectSection}>
            <label className={styles.label}>Select Mentor</label>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className={styles.mentorsSelect}
            >
              <option value="">Select Mentor</option>
              {existingMentors.map((mentor, index) => (
                <option key={index} value={mentor}>
                  {mentor}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.assignMentorButton} onClick={handleAssignMentor}>
          <MdAssignmentInd />
            Assign Mentor
          </button>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.modulesAddModuleSection}>
            <label className={styles.label}>New Module</label>
            <input
              type="text"
              value={newModuleId}
              onChange={(e) => setNewModuleId(e.target.value)}
              placeholder="New Module ID"
              className={styles.newModuleInput}
            />
          </div>

          <button className={styles.addModuleButton} onClick={handleAddModule}>
          <MdAssignmentAdd />
            Add Module
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModulesContent;

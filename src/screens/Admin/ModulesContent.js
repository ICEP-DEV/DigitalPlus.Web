import React, { useState, useRef } from 'react';
import styles from './ModulesContent.module.css'; // Import CSS module
import { FaBook, FaUserSlash } from 'react-icons/fa';

const ModulesContent = () => {
  const carouselRef = useRef(null);
  
  const [modules, setModules] = useState([
    { id: 'PPAF05D', icon: <FaBook size={60} />, mentors: ['Masedi SK', 'Malebana PJ'] },
    { id: 'WEBF15D', icon: <FaBook size={60} />, mentors: [] },
    { id: 'CFAF05D', icon: <FaBook size={60} />, mentors: [] },
    { id: 'DATA05D', icon: <FaBook size={60} />, mentors: ['John Doe'] },
    { id: 'SEC05D', icon: <FaBook size={60} />, mentors: [] }
  ]);

  const [newModuleId, setNewModuleId] = useState('');
  const existingMentors = ['Masedi SK', 'Malebana PJ', 'John Doe', 'Jane Smith', 'Lerato M'];
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');

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
    if (newModuleId.trim() !== '' && !modules.some(module => module.id === newModuleId)) {
      const newModule = { id: newModuleId, icon: <FaBook size={60} />, mentors: [] };
      setModules([...modules, newModule]);
      setNewModuleId('');
    }
  };

  const handleAssignMentor = () => {
    if (selectedModule && selectedMentor) {
      const updatedModules = modules.map((module) => {
        if (module.id === selectedModule && !module.mentors.includes(selectedMentor)) {
          return { ...module, mentors: [...module.mentors, selectedMentor] };
        }
        return module;
      });
      setModules(updatedModules);
      setSelectedMentor('');
    }
  };

  const handleDeleteMentor = (mentorToRemove, moduleId) => {
    const updatedModules = modules.map((module) => {
      if (module.id === moduleId) {
        return { ...module, mentors: module.mentors.filter((mentor) => mentor !== mentorToRemove) };
      }
      return module;
    });
    setModules(updatedModules);
  };

  return (
    <div className={styles.modulesContainer}>
      <h2 className={styles.modulesTitle}>Modules</h2>

      {/* Faculty Dropdown */}
      <div className={styles.facultyDropdown}>
        <select>
          <option value="faculty">FACULTY</option>
          <option value="faculty1">Faculty 1</option>
          <option value="faculty2">Faculty 2</option>
        </select>
      </div>

      {/* Carousel with modules */}
      <div className={styles.modulesCarousel}>
        <button className={`${styles.carouselBtn} ${styles.leftBtn}`} onClick={handlePrevClick}>
          {'<'}
        </button>
        <div className={styles.carouselItems} ref={carouselRef}>
          {modules.map((module) => (
            <div className={styles.carouselItem} key={module.id}>
              <div className={styles.moduleIcon}>{module.icon}</div>
              <p>{module.id}</p>
              <div className={styles.moduleMentors}>
                <div className={styles.mentorList}>
                  {module.mentors.map((mentor, index) => (
                    <div key={index} className={styles.mentorItem}>
                      <span>{mentor}</span>
                      <button onClick={() => handleDeleteMentor(mentor, module.id)} className={styles.deleteMentorBtn}>
                        <FaUserSlash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className={`${styles.carouselBtn} ${styles.rightBtn}`} onClick={handleNextClick}>
          {'>'}
        </button>
      </div>

      {/* Assign Mentor to Module Section */}
      <div className={styles.assignMentorSection}>
        <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
          <option value="">Select Module</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.id}
            </option>
          ))}
        </select>

        <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
          <option value="">Select Mentor</option>
          {existingMentors.map((mentor, index) => (
            <option key={index} value={mentor}>
              {mentor}
            </option>
          ))}
        </select>

        <button className={styles.addButton} onClick={handleAssignMentor}>
          Assign Mentor
        </button>
      </div>

      {/* Add new Module Section */}
      <div className={styles.assignMentorSection}>
        <input
          type="text"
          value={newModuleId}
          onChange={(e) => setNewModuleId(e.target.value)}
          placeholder="New Module ID"
        />
        <button className={styles.addButton} onClick={handleAddModule}>
          Add Module
        </button>
      </div>
    </div>
  );
};

export default ModulesContent;

import React, { useState } from 'react';
import styles from './DepartmentContent.module.css'; // Import the CSS module

const DepartmentContent = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleModuleChange = (event) => {
    const moduleName = event.target.value;
    if (event.target.checked) {
      setSelectedModules([...selectedModules, moduleName]);
    } else {
      setSelectedModules(selectedModules.filter((module) => module !== moduleName));
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const clearSelectedModules = () => {
    setSelectedModules([]);
  };

  const departments = [
    {
      name: 'COMPUTER SCIENCE',
      modules: [
        { year: '1st YEAR MODULES', names: ['PPA05D', 'CFA05D', 'INFF25D', 'LFSF25X', 'WEBF15D', 'CAPF05X', 'CBF15D'] },
        { year: '2nd YEAR MODULES', names: ['PPA05D', 'CFA05D', 'CAPF05D'] }
      ]
    },
    {
      name: 'INFORMATICS',
      modules: [
        { year: '1st YEAR MODULES', names: ['PPA05D/PPA115D', 'CFAF05D/CFA05D', 'CAPF05D'] },
        { year: '2nd YEAR MODULES', names: ['PPA05D/PPA115D', 'CFAF05D/CFA05D', 'CAPF05D'] }
      ]
    },
    {
      name: 'MULTIMEDIA COMPUTING',
      modules: [
        { year: '1st YEAR MODULES', names: ['PPA05D/PPA115D', 'CFAF05D/CFA05D', 'CAPF05D'] },
        { year: '2nd YEAR MODULES', names: ['PPA05D/PPA115D', 'CFAF05D/CFA05D', 'CAPF05D'] }
      ]
    }
  ];

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className={styles.departmentContentContainer}>
      <div className={styles.departmentSearchBarContainer}>
        <input
          type="text"
          placeholder="Search for a department..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.departmentSearchBar}
        />
      </div>

      <div className={styles.departmentColumns}>
        {filteredDepartments.length === 0 ? (
          <p>No departments found</p>
        ) : (
          filteredDepartments.map((department) => (
            <div key={department.name} className={styles.departmentColumn}>
              <h2>{department.name}</h2>
              {department.modules.map((module, index) => (
                <div key={index}>
                  <h3>{module.year}</h3>
                  {module.names.length === 0 ? (
                    <p>No modules available</p>
                  ) : (
                    module.names.map((moduleName) => (
                      <label key={moduleName} className={styles.departmentModuleLabel}>
                        {moduleName}
                        <input
                          type="checkbox"
                          value={moduleName}
                          onChange={handleModuleChange}
                        />
                        <span className={styles.departmentCheckmark}></span>
                      </label>
                    ))
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <div className={styles.departmentSubmitButtonContainer}>
        <button className={styles.departmentSubmitButton}>Submit</button>
        <button className={styles.departmentClearButton} onClick={clearSelectedModules}>Clear</button>
      </div>
    </div>
  );
};

export default DepartmentContent;

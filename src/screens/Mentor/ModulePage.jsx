import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ModulePage.module.css';
import NavBar from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar';
import HeaderAnnouncementPage from './Headers/HeaderAnnouncementPage.js';

export default function ModulePage() {
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the modules assigned to the mentor
    const fetchModules = async () => {
      try {
        const response = await axios.get('https://localhost:7163/api/AssignMod/mentor/1'); // Adjust mentorId as needed
        const moduleData = response.data;
        
        // Set the modules state with the fetched data
        setModules(moduleData);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    fetchModules();
  }, []); // Empty dependency array to run only once when the component mounts

  const handleNavigation = (moduleId) => {
    navigate(`/mentor-dashboard/module/${moduleId}`);
  };

  return (
    <div>
      <NavBar />
      <SideBar />
      <div className={styles['course-modules']}>
        <h1>Modules</h1>
        {/* Top two modules */}
        <div className={styles['module-grid']}>
          {modules.slice(0, 2).map((module) => (
            <div key={module.assignModId} className={styles['module-card']}>
              <img src={`https://picsum.photos/seed/${module.moduleCode}/300/200`} alt={module.moduleDescription} />
              <div className={styles['module-content']}>
                <h2>{module.moduleName}</h2>
                <p>{module.moduleDescription}</p>
                <button onClick={() => handleNavigation(module.moduleCode)}>
                  {module.moduleCode}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Bottom two modules */}
        <div className={styles['module-grid']}>
          {modules.slice(2, 4).map((module) => (
            <div key={module.assignModId} className={styles['module-card']}>
              <img src={`https://picsum.photos/seed/${module.moduleCode}/300/200`} alt={module.moduleDescription} />
              <div className={styles['module-content']}>
                <h2>{module.moduleName}</h2>
                <p>{module.moduleDescription}</p>
                <button onClick={() => handleNavigation(module.moduleCode)}>
                  {module.moduleCode}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

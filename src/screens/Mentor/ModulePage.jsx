import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ModulePage.module.css';
import NavBar from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar';

export default function ModulePage() {
  const [modules, setModules] = useState([]);
  console.log(modules);
  const navigate = useNavigate();

  // Hardcoded mentorId
  const user = JSON.parse(localStorage.getItem('user'));
  const mentorId = user.mentorId;

  useEffect(() => {
    // Fetch the modules assigned to the mentor
    const fetchModules = async () => {
      try {
        // First API call to get assigned modules
        const assignedModulesResponse = await axios.get(`https://localhost:7163/api/AssignMod/getmodulesBy_MentorId/${mentorId}`);
        const assignedModules = assignedModulesResponse.data;

        // For each assigned module, fetch detailed information
        const moduleDetails = await Promise.all(
          assignedModules.map(async (module) => {
            const moduleDetailsResponse = await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetModule/${module.moduleId}`);
            return moduleDetailsResponse.data.result; // Use "result" to match the corrected response structure
          })
        );

        setModules(moduleDetails);
        console.log(moduleDetails); // Log to check final module data
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    fetchModules();
  }, [mentorId]);

  const handleNavigation = (moduleCode) => {
    // Find the selected module details
    const selectedModule = modules.find((m) => m.module_Code === moduleCode);

    if (selectedModule) {
      // Save the selected module details in localStorage
      localStorage.setItem(
        'selectedModule',
        JSON.stringify({
          moduleCode: selectedModule.module_Code,
          moduleId: selectedModule.module_Id,
        })
      );
    }

    navigate(`/mentor-dashboard/module/${moduleCode}`);
  };

  return (
    <div>
      <NavBar />
      <SideBar />
      <div className={styles['course-modules']}>
        <h1>Modules</h1>
        {modules.length > 0 ? (
          <>
            <div className={styles['module-grid']}>
              {modules.slice(0, 2).map((module) => (
                module && module.module_Code ? (
                  <div key={module.module_Id} className={styles['module-card']}>
                    <img className={styles['module-image']} src={`https://picsum.photos/seed/${module.module_Code}/300/200`} alt={module.description} />
                    <div className={styles['module-content']}>
                      <h2>{module.module_Name}</h2>
                      <p>{module.description}</p>
                      <button className={styles['module-button']} onClick={() => handleNavigation(module.module_Code)}>
                        {module.module_Code}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>Module data is missing or incomplete</p>
                )
              ))}
            </div>
            <div className={styles['module-grid']}>
              {modules.slice(2, 4).map((module) => (
                module && module.module_Code ? (
                  <div key={module.module_Id} className={styles['module-card']}>
                    <img className={styles['module-image']} src={`https://picsum.photos/seed/${module.module_Code}/300/200`} alt={module.description} />
                    <div className={styles['module-content']}>
                      <h2>{module.module_Name}</h2>
                      <p>{module.description}</p>
                      <button className={styles['module-button']} onClick={() => handleNavigation(module.module_Code)}>
                        {module.module_Code}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>Module data is missing or incomplete</p>
                )
              ))}
            </div>
          </>
        ) : (
          <p>No modules assigned to this mentor yet.</p>
        )}
      </div>
    </div>
  );
}

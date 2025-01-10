import React, { useEffect, useState } from 'react';  
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './MenteeModule.module.css';
import NavBar from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar';

export default function MenteeModulePage() {
  const [modules, setModules] = useState([]); // Store all modules globally
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve mentee ID from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const menteeId = user?.mentee_Id;

  console.log('Mentee ID:', menteeId);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        if (!menteeId) {
          throw new Error('Mentee ID not found in local storage.');
        }

        // Fetch all available modules (global data)
        const allModulesResponse = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
        const allModules = allModulesResponse.data;

        // Save the fetched modules in localStorage for global access
        localStorage.setItem('modules', JSON.stringify(allModules));

        // Fetch the modules assigned to the mentee
        const assignedModulesResponse = await axios.get(`https://localhost:7163/api/AssignMod/getmodulesBy_MenteeId/${menteeId}`);
        const assignedModules = assignedModulesResponse.data;

        // Map the assigned modules with detailed data
        const assignedModuleDetails = assignedModules.map((module) => {
          const detailedModule = allModules.find((m) => m.module_Id === module.moduleId);
          return detailedModule || module; // Use the detailed module info if found
        });

        setModules(assignedModuleDetails);
        console.log('Assigned Module Details:', assignedModuleDetails);
      } catch (err) {
        console.error('Error fetching modules:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [menteeId]);

  const handleNavigation = (moduleCode) => {
    const selectedModule = modules.find((m) => m.module_Code === moduleCode);
    const moduleId = selectedModule?.module_Id;
  
    if (!moduleId) {
      console.error(`Module ID not found for moduleCode: ${moduleCode}`);
    } else {
      console.log(`Navigating to module:`, { moduleCode, moduleId });
      
      // Save the selected module details in localStorage
      localStorage.setItem('selectedModule', JSON.stringify({ moduleCode, moduleId }));
      
      navigate(`/mentee-dashboard/modules/${moduleCode}`);
    }
  };
  

  if (loading) return <p>Loading modules...</p>;

  return (
    <div>
      <NavBar />
      <SideBar modules={modules} /> {/* Pass the module list to Sidebar */}
      <div className={styles['course-modules']}>
        <h1>Assigned Modules</h1>
        {modules.length > 0 ? (
          <div className={styles['module-grid']}>
            {modules.map((module) =>
              module && module.module_Code ? (
                <div key={module.module_Id} className={styles['module-card']}>
                  <img
                    className={styles['module-image']}
                    src={`https://picsum.photos/seed/${module.module_Code}/300/200`} // Dynamic image URL
                    alt={module.description || 'Module Image'}
                  />
                  <div className={styles['module-content']}>
                    <h2>{module.module_Name}</h2>
                    <p>{module.description || 'No description available.'}</p>
                    <button
                      className={styles['module-button']}
                      onClick={() => handleNavigation(module.module_Code)}
                    >
                      {module.module_Code}
                    </button>
                  </div>
                </div>
              ) : (
                <p>Module data is missing or incomplete</p>
              )
            )}
          </div>
        ) : (
          <p>No modules assigned to this mentee yet.</p>
        )}
      </div>
    </div>
  );
}

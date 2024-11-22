import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './MenteeModule.module.css';
import NavBar from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar';

export default function MenteeModulePage() {
  const [modules, setModules] = useState([]);
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

        // Fetch the modules assigned to the mentee
        const assignedModulesResponse = await axios.get(`https://localhost:7163/api/AssignMod/getmodulesBy_MenteeId/${menteeId}`);
        const assignedModules = assignedModulesResponse.data;

        // Fetch detailed information for each module
        const moduleDetails = await Promise.all(
          assignedModules.map(async (module) => {
            const moduleDetailsResponse = await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetModule/${module.moduleId}`);
            return moduleDetailsResponse.data.result; // Match the mentor's structure
          })
        );

        setModules(moduleDetails);
        console.log('Module Details:', moduleDetails);
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
    navigate(`/mentee-dashboard/modules/${moduleCode}`, { state: { moduleCode } });
  };

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <NavBar />
      <SideBar />
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

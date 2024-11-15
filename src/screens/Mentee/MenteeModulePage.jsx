import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import styles from './MenteeModule.module.css'; // Import the CSS module
import NavBar from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar';

const modules = [
  { id: 'PPAF05D', image: 'https://picsum.photos/seed/PPA/300/200', description: 'Principles of Programming A' },
  { id: 'COHF05D', image: 'https://picsum.photos/seed/PPB/300/200', description: 'Computational Mathematics' },
  { id: 'CFAF05D', image: 'https://picsum.photos/seed/OOP/300/200', description: 'Computing Fundamentals A' },
  { id: 'CAPF05X', image: 'https://picsum.photos/seed/AOP/300/200', description: 'Communication For Acardemic Purspose' },
];

export default function ModulePage() {
  const navigate = useNavigate();  // Create navigate function to handle navigation

  const handleNavigation = (moduleId) => {
    navigate(`/mentee-dashboard/modules/${moduleId}`, { state: { moduleId } });  // Pass moduleId as state
  };

  return (
    <div>
    <NavBar />
    <SideBar />
 
      <div className={styles['course-modules']}>
        <h1>Modules</h1>
        <div className={styles['module-grid']}>
          {modules.slice(0, 2).map((module) => (  // Display first two modules
            <div key={module.id} className={styles['module-card']}>
              <img src={module.image} alt={module.description} />
              <div className={styles['module-content']}>
                <h2>{module.id}</h2>
                <p>{module.description}</p>
                <button onClick={() => handleNavigation(module.id)}>{module.id}</button> {/* Navigate on click */}
              </div>
            </div>
          ))}
        </div>
        <div className={styles['module-grid']}>
          {modules.slice(2, 4).map((module) => (  // Display remaining two modules
            <div key={module.id} className={styles['module-card']}>
              <img src={module.image} alt={module.description} />
              <div className={styles['module-content']}>
                <h2>{module.id}</h2>
                <p>{module.description}</p>
                <button onClick={() => handleNavigation(module.id)}>{module.id}</button> {/* Navigate on click */}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    
  );
}

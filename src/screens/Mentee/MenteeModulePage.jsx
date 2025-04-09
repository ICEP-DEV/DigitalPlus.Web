import React, { useEffect, useState } from 'react';  
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { Add, Save, Update, ManageAccounts, Delete, AssignmentInd, Cancel, Book } from '@mui/icons-material';
import { Icon, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './MenteeModule.module.css';
import NavBar from './Navigation/NavBar.jsx';
import SideBar from './Navigation/SideBar';
import Modal from 'react-modal'; // Use react-modal for the dialog

Modal.setAppElement('#root'); // Accessibility requirement for React Modal


export default function MenteeModulePage() {

  const [modules, setModules] = useState([]); // Store all modules globally
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseModules,setCourseModules] = useState([]);
  const [allCourses,setAllCourses] = useState([]);
  const [checkedModules, setCheckedModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedModules,setAssignedModules]= useState([]);
    
  const navigate = useNavigate();

  // Retrieve mentee ID from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const menteeId = user?.mentee_Id;
  const departmentId=user?.departmentId;

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

        if(assignedModulesResponse.data && assignedModulesResponse.data.length > 0){
          setAssignedModules(assignedModules);
        }else{
          setAssignedModules([]);
        }
       
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

    const fetchDepartment = async () =>{

      if(!departmentId) throw new Error('Department ID not in the local storage');

      const menteeDept = await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetDepartment/${departmentId}`)
      if (menteeDept.data) {
        setSelectedDepartment(menteeDept.data.result.department_Name); 
     }
    };

    const fetchCourses = async () =>{
      if(!departmentId) throw new Error('Department ID not in the local storage');

      const depAllCourses= await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetCoursesByDepartment/department/${departmentId}`);
      if(depAllCourses.data){
        setAllCourses(depAllCourses.data);
      }
    };

    const fetchCourseModules = async () =>{
      try {
        if (!selectedCourse) {
          setError('Please select a course to view its modules.');
          setCourseModules([]);
          return;
        }

        const allCourseModules = await axios.get(`https://localhost:7163/api/DigitalPlusCrud/GetModulesByCourseId/course/${selectedCourse}`);
        console.log(allCourseModules);
        if (allCourseModules.data.length < 0) {
          setError('No modules found for the selected course.');
          setCourseModules([]);
        } else {
          setCourseModules(allCourseModules.data);
         
        }
      } catch (err) {
        console.error('Error fetching course modules:', err.message);
        setError('Error fetching modules for the selected course.');
      }

    };

    fetchCourseModules();
    fetchDepartment();
    fetchCourses();
    fetchModules();
  }, [menteeId,departmentId,selectedCourse]);

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
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment('');
    setSelectedCourse('');
    setCheckedModules([]);
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourse(courseId);
   
  };

  const handleModuleSelection = (event) =>{
    setCheckedModules(event.target.value);
  }

  const handleRemoveModule = async (assignModId) => {
    console.log(assignModId)
    try {
      await axios.delete(`https://localhost:7163/api/AssignMod/deleteMentee/${assignModId}`);
      // Update assignedModules state by filtering out the deleted module
      setModules((prevAssignedModules) =>
        prevAssignedModules.filter((module) => module.assignModId !== assignModId)
      );
      console.log('Module removed successfully.');
    } catch (error) {
      console.error("Error removing module:", error);
      console.log('Failed to remove module. Please try again.', 'error');
    }
  };

  // const handleModuleCheck = (moduleId) => {

  //   console.log(moduleId);
    
  //   setCheckedModules((prev) => {
  //     if (prev.includes(moduleId)) {
  //       return prev.filter((id) => id !== moduleId);
  //     }
  //     return [...prev, moduleId];
  //   });
    
  // };

  const handleAddModules = async () => {
    try{

      
      const modulesToadd= checkedModules.map((moduleId) => ({
        menteeId,
        moduleId
      }));

      await Promise.all(
        modulesToadd.map((assignment) => 
          axios.post('https://localhost:7163/api/AssignMod/MenteeAssignMod',assignment)
        )
      );
      
      setCheckedModules([]);
      closeModal();
    
      
    }catch(err){
      console.error('Error adding modules:', err);
      setError('Failed to add selected modules.');
    }
   
  };

  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  

  const filteredModules = courseModules.filter((module) =>
    module.module_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.module_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

 

  return (
    <div>
      <NavBar />
      <SideBar modules={modules} /> {/* Pass the module list to Sidebar */}
      <div className={styles["course-modules"]}>
        <button className={styles["add-module-button"]} onClick={openModal}>
          MANAGE MODULES
        </button>
        <h1>Assigned Modules</h1>
  
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingMessage}>Loading Modules Data...</p>
          </div>
        ) : modules.length > 0 ? (
          <div className={styles["module-grid"]}>
            {modules.map(
              (module) =>
                module?.module_Code && (
                  <div key={module.module_Id} className={styles["module-card"]}>
                    <img
                      className={styles["module-image"]}
                      src={`https://picsum.photos/seed/${module.module_Code}/300/200`} // Dynamic image URL
                      alt={module.description || "Module Image"}
                    />
                    <div className={styles["module-content"]}>
                      <h2>{module.module_Name}</h2>
                      <p>{module.description || "No description available."}</p>
                      <button
                        className={styles["module-button"]}
                        onClick={() => handleNavigation(module.module_Code)}
                      >
                        {module.module_Code}
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        ) : (
          <p>No modules assigned to this mentee yet.</p>
        )}
      </div>
  
      {/* Modal for Adding Modules */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Module"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Add Module</h2>
        <form>
          <label>
            Department:
            <input
              type="text"
              value={selectedDepartment}
              placeholder={selectedDepartment}
              readOnly
            />
          </label>
          <label>
            Course:
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseSelection(e.target.value)}
            >
              <option value="">Select Course</option>
              {allCourses.map((course) => (
                <option key={course.course_Id} value={course.course_Id}>
                  {course.course_Name}
                </option>
              ))}
            </select>
          </label>
  
          {/* Display assigned modules with remove icons */}
          {assignedModules.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {assignedModules.map((module) => (
                <div key={module.moduleId} value={module.assignModId} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Button variant="outlined" style={{ textTransform: "none" }}>
                    {module.moduleCode}
                  </Button>
                  <IconButton
                    aria-label="remove"
                    color="secondary"
                    onClick={() => handleRemoveModule(module.assignModId)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              ))}
            </div>
          ) : (
            <Typography color="textSecondary" style={{ marginBottom: "16px" }}>
              No modules assigned.
            </Typography>
          )}
  
          {/* Select Modules */}
          <Select
            multiple
            displayEmpty
            value={checkedModules}
            onChange={handleModuleSelection}
            fullWidth
            renderValue={(selected) =>
              selected.length === 0 ? (
                <em>Select Modules</em>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selected.map((id) => {
                    const module = modules.find((module) => module.module_Id === id);
                    return (
                      <Button key={id} variant="contained" size="small" style={{ textTransform: "none" }}>
                        {module?.module_Code}
                      </Button>
                    );
                  })}
                </div>
              )
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            <MenuItem disabled value="">
              <em>Select Modules</em>
            </MenuItem>
            {filteredModules
              .filter(
                (module) =>
                  !assignedModules.some((assigned) => assigned.moduleId === module.module_Id) &&
                  !checkedModules.includes(module.module_Id)
              )
              .map((module) => (
                <MenuItem key={module.module_Id} value={module.module_Id}>
                  {module.module_Code}
                </MenuItem>
              ))}
          </Select>
  
          <div className={styles["modal-buttons"]}>
            <button type="button" onClick={handleAddModules}>
              Add Selected Modules
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
  
}

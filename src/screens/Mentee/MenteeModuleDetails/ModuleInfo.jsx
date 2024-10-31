import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to get navigation state
import styles from './ModuleInfo.module.css'; // Import the CSS module

const ModuleInfo = ({ moduleDetails }) => {
  const location = useLocation(); // Get the navigation state
  const moduleId = location.state?.moduleId; // Access moduleId from the state

  // Check if the moduleId matches, otherwise display a default module
  const selectedModule = moduleDetails.find(module => module.id === moduleId) || moduleDetails[0];

  return (
    <div className={styles.moduleInficontainer}>
      <img src={selectedModule.image} alt="Module" className={styles.moduleImage} />
      <div className={styles.section}>
        <h2>Description</h2>
        <p>{selectedModule.description}</p>
      </div>
      <div className={styles.section}>
        <h2>Learning Objectives</h2>
        <ul>
          {selectedModule.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>
      <div className={styles.section}>
        <h2>Learn More</h2>
        <ul>
          {selectedModule.resources.map((resource, index) => (
            <li key={index}>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                {resource.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.section}>
        <h2>Download Study Guide</h2>
        <a href={selectedModule.studyGuide} download className={styles.downloadButton}>
          Download PDF
        </a>
      </div>
    </div>
  );
};

// Default props to illustrate the structure
ModuleInfo.defaultProps = {
  moduleDetails: [
    {
      image: "https://imgv2-2-f.scribdassets.com/img/word_document/317276308/original/adfe3e30f6/1611644272?v=1", // Updated image URL
      description:
        "This module introduces the fundamental data structures used in computer science, including arrays, linked lists, stacks, queues, trees, and graphs. Students will learn about the operations, time complexity, and practical applications of each structure.",
      objectives: [
        "Understand the concept of data structures",
        "Learn how to implement various data structures",
        "Analyze the time complexity of different operations",
        "Explore real-world applications of data structures",
      ],
      resources: [
        {
          name: "Official Documentation",
          link: "https://example.com/data-structures-doc",
        },
        {
          name: "Introduction to Algorithms - Online Course",
          link: "https://example.com/intro-to-algorithms",
        },
      ],
      studyGuide: "/path/to/study-guide.pdf", // Replace with the actual file path
    },
  ],
};

export default ModuleInfo;

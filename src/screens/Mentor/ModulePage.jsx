import React from 'react';
import './ModulePage.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Icons for navigation
import SideBarNavBar from './Navigation/SideBarNavBar';

const modules = [
  { id: 1, title: 'PPA F050', imgSrc: 'https://example.com/image1.png' }, // Replace with actual image URLs
  { id: 2, title: 'PRB 216D', imgSrc: 'https://example.com/image2.png' },
  { id: 3, title: 'OOP 216D', imgSrc: 'https://example.com/image3.png' },
  { id: 4, title: 'AGP 316D', imgSrc: 'https://example.com/image4.png' },
];

const ModulePage = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % modules.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? modules.length - 1 : prevIndex - 1));
  };

  return (
    <SideBarNavBar>
    <div className="module-page-container">
      <button className="module-nav left" onClick={handlePrev}>
        <FaChevronLeft />
      </button>

      <div className="module-carousel">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={`module-item ${index === activeIndex ? 'active' : ''}`}
          >
            <img src={module.imgSrc} alt={module.title} />
            <div className="module-item-title">{module.title}</div>
          </div>
        ))}
      </div>

      <button className="module-nav right" onClick={handleNext}>
        <FaChevronRight />
      </button>
    </div>
    </SideBarNavBar>
  );
};

export default ModulePage;

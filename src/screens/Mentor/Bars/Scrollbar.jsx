import React from 'react';

const Scrollbar = ({ slideCount, currentIndex, onChange }) => {
    const handleClick = (index) => {
        onChange(index);
    };

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '30px', // Adjusted from '30px' to '60px' to move the scrollbar up
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }}
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newIndex = Math.floor((clickX / rect.width) * slideCount);
                    handleClick(newIndex);
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: `${((currentIndex + 1) / slideCount) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #007bff, #00d4ff)',
                        borderRadius: '8px',
                        transition: 'width 0.3s ease',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${((currentIndex + 0.5) / slideCount) * 100}%`,
                        width: '20px',
                        height: '20px',
                        background: 'linear-gradient(45deg, #007bff, #00d4ff)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                    }}
                />
            </div>
        </div>
    );
};

export default Scrollbar;

import React, { useState } from 'react';
import KeyPageAlert from './KeyPageAlert';
import styles from './ParentComponent.module.css';

function ParentComponent() {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
        console.log("Modal opened");
    };

    const handleCloseModal = () => {
        setShowModal(false);
        console.log("Modal closed");
    };

    return (
        <div className={styles.container}>
            <button className={styles.openModalButton} onClick={handleOpenModal}>
                Open Key Alert Modal
            </button>
            <KeyPageAlert showModal={showModal} onClose={handleCloseModal} />
        </div>
    );
}

export default ParentComponent;



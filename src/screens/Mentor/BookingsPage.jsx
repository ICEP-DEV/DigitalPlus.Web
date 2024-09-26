import React, { useState } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import styles from './BookingsPage.module.css'; // Import CSS

const MentorBookingsPage = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      date: '2024-09-22',
      time: '10:00 AM',
      sessionType: 'Online',
      module: 'PPAFO5D',
    },
    {
      id: 2,
      name: 'Jane',
      surname: 'Smith',
      date: '2024-09-23',
      time: '12:00 PM',
      sessionType: 'Contact',
      module: 'PPB115D',
    },
  ]);

  const [modalInfo, setModalInfo] = useState({ show: false, action: '', bookingId: null });
  const [reason, setReason] = useState('');

  // Handle modal open
  const openModal = (action, id) => {
    setModalInfo({ show: true, action, bookingId: id });
  };

  // Handle modal close
  const closeModal = () => {
    setModalInfo({ show: false, action: '', bookingId: null });
    setReason('');
  };

  // Handle submit for confirm, cancel, or reschedule
  const handleSubmit = () => {
    const { action, bookingId } = modalInfo;

    if (reason.trim() === '') {
      alert('Please provide a reason.');
      return;
    }

    switch (action) {
      case 'Confirm':
        alert(`Booking with ID ${bookingId} has been confirmed for the reason: ${reason}.`);
        // Add logic to update confirmation status
        break;
      case 'Cancel':
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
        alert(`Booking with ID ${bookingId} has been canceled for the reason: ${reason}.`);
        break;
      case 'Reschedule':
        alert(`Rescheduling booking with ID ${bookingId} for the reason: ${reason}.`);
        // Add logic to reschedule the booking
        break;
      default:
        break;
    }

    closeModal();
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <SideBar />
      <div className={styles.contentWrapper}>
{/*       
        <h1 className={styles.bookingsMainTitle}>BOOKINGS</h1> */}
       
        <div className={styles.bookingSection}>
          <h2 className={styles.bookingsTitle}>Upcoming Bookings</h2>

          {bookings.length === 0 ? (
            <p className={styles.noBookings}>No bookings available.</p>
          ) : (
            <table className={styles.bookingsTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Session Type</th>
                  <th>Module</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.name}</td>
                    <td>{booking.surname}</td>
                    <td>{booking.date}</td>
                    <td>{booking.time}</td>
                    <td>{booking.sessionType}</td>
                    <td>{booking.module}</td>
                    <td>
                      <button className={styles.confirmButton} onClick={() => openModal('Confirm', booking.id)}>
                        Confirm
                      </button>
                      <button className={styles.cancelButton} onClick={() => openModal('Cancel', booking.id)}>
                        Cancel
                      </button>
                      <button className={styles.rescheduleButton} onClick={() => openModal('Reschedule', booking.id)}>
                        Reschedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal for actions */}
        {modalInfo.show && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>{modalInfo.action} Booking</h2>
              <textarea
                placeholder="Please provide a reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={styles.reasonInput}
              />
              <div className={styles.modalActions}>
                <button onClick={handleSubmit} className={styles.submitButton}>
                  Submit
                </button>
                <button onClick={closeModal} className={styles.closeButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorBookingsPage;

import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './CalendarPage.module.css'; // Import the CSS module
import { useFetchBookings } from './useFetchBookings'; // Reuse the same hook
import Modal from 'react-modal';

const localizer = momentLocalizer(moment);

// Required for accessibility when using React Modal
Modal.setAppElement('#root');

const CalenderPage = () => {
  const { bookings } = useFetchBookings(); // Reuse the bookings from the hook
  const [selectedEvent, setSelectedEvent] = useState(null); // Track the selected event for the modal

  // Function to handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <div className={styles.container}>
        <NavBar />
        <SideBar />

        <div className={styles.calendarContainer}>
          <h1>Mentor calendar</h1>
          <Calendar
            localizer={localizer}
            events={bookings.map((event) => ({
              ...event, // Pass all event details
              title: `${event.name} ${event.surname} (Module ${event.module})`,
              start: event.start,
              end: event.end,
              allDay: false,
            }))}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleEventClick} // Event handler for when an event is clicked
            toolbar={false}
            style={{ height: '70vh' }}
          />
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onRequestClose={closeModal}
          contentLabel="Event Details"
          className={styles.modal} // Add any styling to the modal
        >
          <h2>Event Details</h2>
          <p><strong>Mentee:</strong> {selectedEvent.name} {selectedEvent.surname}</p>
          <p><strong>Module:</strong> {selectedEvent.module}</p>
          <p><strong>Time:</strong> {moment(selectedEvent.start).format('hh:mm A')}</p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </>
  );
};

export default CalenderPage;

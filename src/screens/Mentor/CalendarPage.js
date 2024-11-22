import React, { useState, useEffect } from 'react';
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

const CalendarPage = () => {
  const [bookings, setBookings] = useState([]); // State to store bookings
  const [selectedEvent, setSelectedEvent] = useState(null); // Track the selected event for the modal
  //const [loading, setLoading] = useState(true); // Loading state for the API call
  const [error, setError] = useState(null); // Error state for the API call

  // Fetch bookings from the API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch all appointments
        const response = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllAppointments');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        
        const data = await response.json();
        console.log('API response:', data);
        
        // Ensure 'result' is an array and contains at least one booking
        if (!Array.isArray(data.result) || data.result.length === 0) {
          throw new Error('No bookings found');
        }
        
        // Fetch the modules
        const moduleResponse = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
        if (!moduleResponse.ok) throw new Error('Failed to fetch modules');
        const moduleData = await moduleResponse.json();
        
        // Create a mapping from moduleId to moduleName
        const moduleMapping = moduleData.reduce((acc, module) => {
          acc[module.module_Id] = module.module_Name;
          return acc;
        }, {});
        
        // Format the bookings and dynamically fetch mentee details for each appointment
        const formattedBookings = await Promise.all(data.result.map(async (event) => {
          // Fetch the mentee details using the studentNumber (menteeId) for each appointment
          const menteeResponse = await fetch(`https://localhost:7163/api/DigitalPlusUser/GetMentee/${event.studentNumber}`);
          if (!menteeResponse.ok) throw new Error('Failed to fetch mentee details');
          const menteeData = await menteeResponse.json();
          
          // Format each booking with its own mentee details
          return {
            id: event.appointmentId,
            name: menteeData.firstName || 'Unknown Name', // Use mentee firstName
            surname: menteeData.lastName || 'Unknown Name', // Use mentee lastName
            module: moduleMapping[event.moduleId] || 'Internet programming', // Get module name
            sessionType: event.lessonType,
            dateTime: event.dateTime,
            start: new Date(event.dateTime), // Convert dateTime to Date object for start
            end: new Date(new Date(event.dateTime).getTime() + 60 * 60 * 1000), // Assuming 1-hour duration for each appointment
          };
        }));
        
        // Set the formatted bookings state
        setBookings(formattedBookings);
      } catch (error) {
        //setError(error.message);
      } finally {
        //setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  // Handle event click (open the modal with event details)
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedEvent(null);
  };

  //if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className={styles.container}>
        <NavBar />
        <SideBar />

        {/* Modal for event details */}
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

        <div className={styles.calendarContainer}>
          <h1>Mentor calendar</h1>
          <Calendar
            localizer={localizer}
            events={bookings.map((event) => ({
              ...event,
              title: `${event.name} ${event.surname} (${event.module})`,
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
    </>
  );
};

export default CalendarPage;

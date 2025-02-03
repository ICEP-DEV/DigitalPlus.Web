import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './CalendarPage.module.css'; // Import the CSS module
import Modal from 'react-modal';

// Required for accessibility when using React Modal
Modal.setAppElement('#root');

const localizer = momentLocalizer(moment);

// Custom Toolbar Component with View Filters
const CustomToolbar = (props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
      {/* Navigation Buttons */}
      <div>
        <button 
          onClick={() => props.onNavigate('PREV')} 
          style={{
            color: 'Black',
            padding: '8px 12px',
            margin: '0 5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
          }}
        >
          Prev
        </button>
        <button 
          onClick={() => props.onNavigate('TODAY')} 
          style={{
            color: 'Black',
            padding: '8px 12px',
            margin: '0 5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Today
        </button>
        <button 
          onClick={() => props.onNavigate('NEXT')} 
          style={{
            color: 'Black',
            padding: '8px 12px',
            margin: '0 5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
          }}
        >
          Next
        </button>
      </div>

      {/* View Label */}
      <div>
        <strong>{props.label}</strong>
      </div>

      {/* View Filter Buttons */}
      <div>
        <button 
          onClick={() => props.onView('month')} 
          style={{
            padding: '8px 12px',
            margin: '0 5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: props.view === 'month' ? '#007bff' : '#f8f9fa',
            color: props.view === 'month' ? '#fff' : '#000',
            cursor: 'pointer',
          }}
        >
          Month
        </button>
        <button 
          onClick={() => props.onView('week')} 
          style={{
            padding: '8px 12px',
            margin: '0 5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: props.view === 'week' ? '#007bff' : '#f8f9fa',
            color: props.view === 'week' ? '#fff' : '#000',
            cursor: 'pointer',
          }}
        >
          Week
        </button>
        <button 
          onClick={() => props.onView('day')} 
          style={{
            padding: '8px 12px',
            margin: '0 5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: props.view === 'day' ? '#007bff' : '#f8f9fa',
            color: props.view === 'day' ? '#fff' : '#000',
            cursor: 'pointer',
          }}
        >
          Day
        </button>
      </div>
    </div>
  );
};


const CalendarPage = () => {
  const [bookings, setBookings] = useState([]); // State to store bookings
  const [selectedEvent, setSelectedEvent] = useState(null); // Track the selected event for the modal
  const [error, setError] = useState(null); // Error state for the API call

  const storedUser = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, []);
  // Fetch bookings from the API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch all appointments
        const response = await fetch(`https://localhost:7163/api/DigitalPlusCrud/GetAppointmentsByMentorId/${storedUser.mentorId}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        
        const data = await response.json();
        
        if (!Array.isArray(data.result) || data.result.length === 0) {
          throw new Error('No Appointments found');
        }
        
        const moduleResponse = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
        if (!moduleResponse.ok) throw new Error('Failed to fetch modules');
        const moduleData = await moduleResponse.json();
        
        const moduleMapping = moduleData.reduce((acc, module) => {
          acc[module.module_Id] = module.module_Name;
          return acc;
        }, {});
        
        const formattedBookings = await Promise.all(data.result.map(async (event) => {
          const menteeResponse = await fetch(`https://localhost:7163/api/DigitalPlusUser/GetMentee/${event.studentNumber}`);
          if (!menteeResponse.ok) throw new Error('Failed to fetch mentee details');
          const menteeData = await menteeResponse.json();
          
          return {
            id: event.appointmentId,
            name: menteeData.firstName || 'Unknown Name',
            surname: menteeData.lastName || 'Unknown Name',
            module: moduleMapping[event.moduleId] || 'Internet programming',
            sessionType: event.lessonType,
            dateTime: event.dateTime,
            start: new Date(event.dateTime),
            end: new Date(new Date(event.dateTime).getTime() + 60 * 60 * 1000),
          };
        }));
        
        setBookings(formattedBookings);
        scheduleReminders(formattedBookings);
      } catch (error) {
        setError(error.message);
      }
    };
    
    fetchBookings();
  }, []);

  const scheduleReminders = (appointments, mentorEmail) => {
    appointments.forEach((appointment) => {
      const currentTime = new Date().getTime();
      const appointmentTime = new Date(appointment.dateTime).getTime();
  
      //console.log("Appo "+appointments.json())

      const reminderIntervals = [
        { label: 'You have an appointment in 2 minutes', delta: 2 * 60 * 1000 },
        { label: 'You have an appointment in 15 minutes', delta: 15 * 60 * 1000 },
        { label: 'You have an appointment in 1 hour', delta: 60 * 60 * 1000 },
        { label: 'You have an appointment in 1 day', delta: 24 * 60 * 60 * 1000 },
      ];
  
      reminderIntervals.forEach(({ label, delta }) => {
        const reminderTime = appointmentTime - delta;
        if (reminderTime > currentTime) {
          setTimeout(async () => {
            alert(`Reminder: ${label} with ${appointment.name} ${appointment.surname}`);
  
            // Send email reminder to the backend
            await fetch('https://localhost:7163/api/Email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: `${storedUser.mentorId}@tut4life.ac.za`, // Mentor's email
                subject: `Appointment Reminder: ${label}`,
                message: `Hi, this is a reminder for your ${appointment.sessionType} appointment with ${appointment.name} ${appointment.surname} scheduled at ${new Date(appointment.dateTime).toLocaleString()}. Reminder: ${label}`,
              }),
            });
          }, reminderTime - currentTime);
        }
      });
    });
  };
  
  

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  

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
            className={styles.modal}
          >
            <h2>Event Details</h2>
            <p><strong>Mentee:</strong> {selectedEvent.name} {selectedEvent.surname}</p>
            <p><strong>Module:</strong> {selectedEvent.module}</p>
            <p><strong>Type:</strong> {selectedEvent.sessionType}</p>
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
            onSelectEvent={handleEventClick}
            components={{
              toolbar: CustomToolbar, // Use the custom toolbar
            }}
            style={{ height: '70vh' }}
          />

        </div>
      </div>
    </>
  );
};

export default CalendarPage;

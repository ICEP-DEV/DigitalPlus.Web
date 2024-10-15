import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './CalendarPage.module.css'; // Import the CSS module

const localizer = momentLocalizer(moment);

const CalenderPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllAppointments');
        const data = await response.json();

        if (data.success) {
          const formattedEvents = data.result.map(event => ({
            title: `${event.fullNames} (Module ${event.module_code})`,
            start: new Date(event.dateTime),
            end: new Date(moment(event.dateTime).add(1, 'hours').format()), // Adds 1 hour for end time
            allDay: false,
          }));

          setEvents(formattedEvents);
        } else {
          console.error('Failed to fetch appointments:', data.message);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <NavBar />
        <SideBar />

        <div className={styles.calendarContainer}>
          <h1>Mentor calendar</h1>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            toolbar={false}
            style={{ height: '70vh' }}
          />
        </div>
      </div>
    </>
  );
};

export default CalenderPage;

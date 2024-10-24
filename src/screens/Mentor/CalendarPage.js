import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './CalendarPage.module.css'; // Import the CSS module
import { useFetchBookings } from './useFetchBookings'; // Reuse the same hook

const localizer = momentLocalizer(moment);

const CalenderPage = () => {
  const { bookings } = useFetchBookings(); // Reuse the bookings from the hook

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
              title: `${event.name} ${event.surname} (Module ${event.module})`,
              start: event.start,
              end: event.end,
              allDay: false,
            }))}
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

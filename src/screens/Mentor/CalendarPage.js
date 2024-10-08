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
    const dummyData = [
      {
        name: 'John',
        surname: 'Doe',
        date: '2024-10-09',
        time: '10:10 AM',
        sessionType: 'Online',
        module: 'PPAFO5D',
      },
      {
        name: 'Jane',
        surname: 'Smith',
        date: '2024-10-08',
        time: '02:30 PM',
        sessionType: 'In-person',
        module: 'ITMAF5H',
      },
      {
        name: 'Alice',
        surname: 'Johnson',
        date: '2024-10-07',
        time: '11:00 AM',
        sessionType: 'Online',
        module: 'DBADF4B',
      },
    ];

    const formattedEvents = dummyData.map(event => ({
      title: `${event.name} ${event.surname} (${event.module})`,
      start: new Date(`${event.date} ${event.time}`),
      end: new Date(`${event.date} ${moment(event.time, 'h:mm A').add(1, 'hours').format('hh:mm A')}`),
      allDay: false,
    }));

    setEvents(formattedEvents);
  }, []);

  return (
    <>
    <div className={styles.container}>
        <NavBar />
        <SideBar />


        <div className={styles.calendarContainer}>
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

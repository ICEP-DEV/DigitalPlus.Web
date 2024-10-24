import { useState, useEffect } from 'react';
import moment from 'moment';

export const useFetchBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllAppointments');
        const data = await response.json();

        if (data.success) {
          const formattedBookings = data.result.map((event) => ({
            id: event.appointmentId,
            name: event.fullNames.split(' ')[0], // Assuming fullNames is 'First Last'
            surname: event.fullNames.split(' ')[1] || '',
            date: moment(event.dateTime).format('YYYY-MM-DD'),
            time: moment(event.dateTime).format('hh:mm A'),
            sessionType: event.lessonType,
            module: event.module_code, // Replace if module_code needs adjustment
            start: new Date(event.dateTime),
            end: new Date(moment(event.dateTime).add(1, 'hours').format()), // Adding 1 hour to end time for calendar events
          }));

          setBookings(formattedBookings);
        } else {
          setError(data.message || 'Failed to fetch bookings.');
        }
      } catch (error) {
        setError('Error fetching bookings: ' + error.message);
      }
    };

    fetchData();
  }, []);

  return { bookings, error };
};

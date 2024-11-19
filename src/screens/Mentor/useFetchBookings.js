import { useState, useEffect } from 'react';
import moment from 'moment';

export const useFetchBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [modules, setModules] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const moduleData = await response.json();
  
        // Map the modules into a key-value pair (module_Id -> module_Name)
        const moduleMap = moduleData.reduce((acc, module) => {
          acc[module.module_Id] = module.module_Name;
          return acc;
        }, {});
        
        setModules(moduleMap); // Update state with the fetched modules
      } catch (error) {
        setError('Error fetching modules: ' + error.message);
      }
    };

    const fetchBookings = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await fetch('https://localhost:7163/api/Booking/GetBookingsByMentorId/222870097');
        const data = await response.json();
        //console.log(data);

        if (data.success) {
          const formattedBookings = data.result.map((event) => ({
            id: event.id,
            name: event.name.split(' ')[0],
            surname: event.fullNames.split(' ')[1] || '',
            date: moment(event.dateTime).format('YYYY-MM-DD'),
            time: moment(event.dateTime).format('hh:mm A'),
            sessionType: event.sessionType,
            module: modules[event.moduleId] || 'Unknown Module', // Use event.moduleId instead of event.module_Id
            start: new Date(event.dateTime),
            end: new Date(moment(event.dateTime).add(1, 'hours').format()),
          }));

          setBookings(formattedBookings);
        } else {
          setError(data.message || 'Failed to fetch bookings.');
        }
      } catch (error) {
        setError('Error fetching bookings: ' + error.message);
      }
    };

    // First fetch the modules, then fetch bookings
    fetchModules().then(() => fetchBookings());
  }, [modules]);

  return { bookings, error };
};

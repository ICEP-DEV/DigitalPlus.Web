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
        const moduleData = await response.json();
        if (moduleData.success) {
          const moduleMap = moduleData.result.reduce((acc, module) => {
            acc[module.module_Id] = module.module_Name; // Assuming module_Id and module_Name are the correct fields
            return acc;
          }, {});
          setModules(moduleMap);
        } else {
          setError(moduleData.message || 'Failed to fetch modules.');
        }
      } catch (error) {
        setError('Error fetching modules: ' + error.message);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllAppointments');
        const data = await response.json();

        if (data.success) {
          const formattedBookings = data.result.map((event) => ({
            id: event.appointmentId,
            name: event.fullNames.split(' ')[0],
            surname: event.fullNames.split(' ')[1] || '',
            date: moment(event.dateTime).format('YYYY-MM-DD'),
            time: moment(event.dateTime).format('hh:mm A'),
            sessionType: event.lessonType,
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

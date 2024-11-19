import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';
import styles from './BookingsPage.module.css';

const MentorBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [modules, setModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ show: false, action: '', bookingId: null });
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
        if (!response.ok) throw new Error('Failed to fetch modules');
        const moduleData = await response.json();
        const moduleMap = moduleData.reduce((acc, module) => {
          acc[module.module_Id] = module.module_Name;
          return acc;
        }, {});
        setModules(moduleMap);
      } catch (error) {
        //setError(error.message);
      }
    };

    const fetchBookings = async () => {
      try {
        // Fetch bookings by mentorId
        const response = await fetch('https://localhost:7163/api/Booking/GetBookingsByMentorId/222870097');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
    
        console.log("line 38 and below: is fine");
        // Ensure the response is an array
        if (Array.isArray(data)) {
          const formattedBookings = await Promise.all(data.map(async (event) => {
            console.log("line 42 and below: is fine");
            // Fetch the mentee details (name, surname)
            const menteeResponse = await fetch('https://localhost:7163/api/DigitalPlusUser/GetMentee/222870098');
            console.log("line 45 and below: is fine");
            if (!menteeResponse.ok) throw new Error('Failed to fetch mentee details');
            const menteeData = await menteeResponse.json();
            
            console.log("line 49 and below: is fine");
            // Map the booking data with mentee name and other fields
            return {
              id: event.bookingId,
              name: 'Aviwe' || 'Unknown Name', // Ensure name is not undefined
              surname: 'Baleni' || '', // Ensure surname is not undefined
              date: new Date(event.bookingDateTime).toLocaleDateString(),
              time: new Date(event.bookingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sessionType: event.sessionType,
              module: modules[event.moduleId] || 'Unknown Module',
              start: new Date(event.bookingDateTime),
              end: new Date(new Date(event.bookingDateTime).getTime() + 60 * 60 * 1000), // Assuming 1-hour duration
            }
          }));
          setBookings(formattedBookings);
        } else {
          //setError('Response data is not an array.');
          console.log("Its not an Array!!");
        }
      } catch (error) {
        //setError(error.message);
        console.log("Problem in the try-catch");
      } finally {
        setLoading(false);
      }
    };
    
    

    fetchModules().then(fetchBookings);
  }, [modules]); // Run fetchBookings when modules are updated

  const openModal = (action, id) => {
    setModalInfo({ show: true, action, bookingId: id });
  };

  const closeModal = () => {
    setModalInfo({ show: false, action: '', bookingId: null });
    setReason('');
  };

  const handleSubmit = async () => {
    const { action, bookingId } = modalInfo;
    const reasonToSend = reason.trim() || null; // If reason is empty, don't send it to the API
  
    try {
      switch (action) {
        case 'Confirm':
          // API call to confirm the booking
          const confirmResponse = await fetch(`https://localhost:7163/api/Booking/MoveToAppointment/${bookingId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: reasonToSend }), // Optional reason
          });
  
          if (!confirmResponse.ok) throw new Error('Failed to confirm booking');
          toast.success(`Booking with ID ${bookingId} has been confirmed.`);
          break;
  
        case 'Cancel':
          // Show confirmation dialog for cancellation
          if (window.confirm('Are you sure you want to cancel this booking?')) {
            const cancelResponse = await fetch(`https://localhost:7163/api/Booking/DeleteBooking/1`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reason: reasonToSend }), // Optional reason
            });
  
            if (!cancelResponse.ok) throw new Error('Failed to cancel booking');
            toast.info(`Booking with ID ${bookingId} has been canceled.`);
          }
          break;
  
        case 'Reschedule':
          // API call to reschedule the booking
          if (reasonToSend === null) {
            toast.error('Please provide a reason for rescheduling.');
            return;
          }
  
          const rescheduleResponse = await fetch(`https://localhost:7163/api/Booking/UpdateBooking/${bookingId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: reasonToSend }), // Optional reason
          });
  
          if (!rescheduleResponse.ok) throw new Error('Failed to reschedule booking');
          toast.warning(`Rescheduling booking with ID ${bookingId} for the reason: ${reasonToSend}.`);
          break;
  
        default:
          break;
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      closeModal();
    }
  };
  
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <SideBar />

      <div className={styles.contentWrapper}>
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
                    <td className={styles.actionButtons}>
                      <button className={styles.confirmButton} onClick={() => openModal('Confirm', booking.id)}>
                        Confirm
                      </button>
                      <button className={styles.rescheduleButton} onClick={() => openModal('Reschedule', booking.id)}>
                        Reschedule
                      </button>
                      <button className={styles.cancelButton} onClick={() => openModal('Cancel', booking.id)}>
                        Cancel
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

              {/* Show the reason input only for Reschedule */}
              {modalInfo.action === 'Reschedule' && (
                <textarea
                  placeholder="Please provide a reason (optional)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={styles.reasonInput}
                />
              )}

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



        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default MentorBookingsPage;

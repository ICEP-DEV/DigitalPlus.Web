import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './Navigation/NavBar';
import SideBar from './Navigation/SideBar';
import styles from './BookingsPage.module.css';

const MentorBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [modules, setModules] = useState({});
  //const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ show: false, action: '', bookingId: null });
  const [reason, setReason] = useState('');


  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('https://localhost:7163/api/DigitalPlusCrud/GetAllModules');
        if (!response.ok) throw new Error('Failed to fetch modules');
        
        const moduleData = await response.json();
        console.log(moduleData);
        const moduleMap = moduleData.reduce((acc, module) => {
          acc[module.module_Id] = module.module_Name;
          return acc;
        }, {});
        console.log(moduleMap);
        console.log("UP");
        setModules(moduleMap);
      } catch (error) {
        //setError(error.message);
      }
    };

    

    const fetchBookings = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        // Fetch bookings by mentorId dynamically
        console.log(storedUser.mentorId);
        const response = await fetch(`https://localhost:7163/api/Booking/GetBookingsByMentorId/${storedUser.mentorId}`);
        console.log(storedUser.mentorId);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        //console.log(data);
  
    
        // Ensure the response is an array
        if (Array.isArray(data)) {
          const formattedBookings = await Promise.all(data.map(async (event) => {

            // Dynamically fetch the mentee details using the studentNumber from the booking event
            const menteeId = event.menteeId; // Assuming 'studentNumber' is part of the event data
            if (!menteeId) {
              throw new Error('Mentee ID (studentNumber) not found in the booking data');
            }
            console.log(`Heres the mentee ID ${menteeId}`);
            const menteeResponse = await fetch(`https://localhost:7163/api/DigitalPlusUser/GetMentee/${menteeId}`);
            if (!menteeResponse.ok) throw new Error('Failed to fetch mentee details');
            const menteeData = await menteeResponse.json(); 
            console.log(menteeData);
            // Map the booking data with mentee name and other fields
            return {
              id: event.bookingId,
              name: menteeData.firstName || 'Unknown Name', // Ensure name is not undefined
              surname: menteeData.lastName || 'Unknown Name', // Ensure surname is not undefined
              date: new Date(event.bookingDateTime).toLocaleDateString(),
              time: new Date(event.bookingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sessionType: event.sessionType,
              module: modules[event.moduleId] || 'Internet programming', // Ensure the module name is available
              start: new Date(event.bookingDateTime),
              end: new Date(new Date(event.bookingDateTime).getTime() + 60 * 60 * 1000), // Assuming 1-hour duration
            };
          }));
          
          // Set the formatted bookings to state
          setBookings(formattedBookings);
        } else {
          console.log("Response data is not an array!");
        }
      } catch (error) {
        console.log("Problem in the try-catch", error.message);
      } finally {
        //setLoading(false);
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
            const cancelResponse = await fetch(`https://localhost:7163/api/Booking/DeleteBooking/${bookingId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reason: reasonToSend }), // Optional reason
            });
  
            if (!cancelResponse.ok) throw new Error('Failed to cancel booking');
            toast.info(`Booking with ID ${bookingId} has been declined.`);
          }
          break;
  
          case 'Reschedule':
            // Prepare the URL with the bookingId as a query parameter
            const url = new URL('https://localhost:7163/api/Booking/MentorRescheduleRequest');
            url.searchParams.append('bookingId', bookingId);
          
            // Prepare the body if a reason is provided
            const body = reasonToSend ? JSON.stringify({ reason: reasonToSend }) : null;
          
            // Make the fetch request
            const rescheduleResponse = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: body, // Include body only if reason is provided
            });
          
            if (!rescheduleResponse.ok) throw new Error('Failed to reschedule booking');
            
            toast.warning(`Rescheduling booking with ID ${bookingId} for the reason: ${reasonToSend || 'No specific reason provided'}.`);
            console.log(rescheduleResponse);
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
  
  

  //if (loading) return <p>Loading...</p>;

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
                        Decline
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBarNavBar from "./Navigation/SideBarNavBar";
import ScheduleData from "./ScheduleData";
import { FaClock, FaCalendarAlt, FaUser } from "react-icons/fa"; // Icons

function RosterPage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7163/api/DigitalPlusCrud/GetAllSchedules"
        );
        if (response.data && Array.isArray(response.data.result)) {
          const sortedData = response.data.result.sort((a, b) =>
            compareTime(a.timeSlot, b.timeSlot)
          );
          setScheduleData(sortedData);
          setFilteredData(sortedData);
        } else {
          setScheduleData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
        setScheduleData([]);
        setFilteredData([]);
      }
    };
    fetchScheduleData();
  }, []);

  // Helper function to compare times
  const compareTime = (time1, time2) => {
    const formatTime = (time) =>
      new Date(`1970-01-01T${time.replace(/(AM|PM)/, "")} ${time.includes("PM") ? "PM" : "AM"}`).getTime();
    return formatTime(time1) - formatTime(time2);
  };

  // Filter data based on user selection
  useEffect(() => {
    const filter = () => {
      let data = scheduleData;

      if (selectedDay) {
        data = data.filter((item) =>
          item.daysOfTheWeek.toLowerCase().includes(selectedDay.toLowerCase())
        );
      }

      if (selectedTime) {
        data = data.filter((item) => {
          const slotTime = item.timeSlot;
          return compareTime(slotTime, selectedTime) === 0;
        });
      }

      setFilteredData(data);
    };
    filter();
  }, [selectedDay, selectedTime, scheduleData]);

  return (
    <SideBarNavBar>
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.header}>Mentor's Lab 10-252</h1>

          {/* Filters */}
          <div style={styles.filterContainer}>
            <div style={styles.filterItem}>
              <FaCalendarAlt style={styles.icon} />
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                style={styles.filterDropdown}
              >
                <option value="">Filter by Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div style={styles.filterItem}>
              <FaClock style={styles.icon} />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={styles.filterDropdown}
              >
                <option value="">Filter by Time</option>
                <option value="08:00 AM">08:00 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
              </select>
            </div>
          </div>

          <div style={styles.rosterTable}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>
                    <FaClock style={styles.icon} /> Time Slot
                  </th>
                  <th style={styles.tableHeader}>
                    <FaCalendarAlt style={styles.icon} /> Days of the Week
                  </th>
                  <th style={styles.tableHeader}>
                    <FaUser style={styles.icon} /> Mentor ID
                  </th>
                  <th style={styles.tableHeader}>Module List</th>
                </tr>
              </thead>
              <tbody>
                <ScheduleData scheduleData={filteredData} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SideBarNavBar>
  );
}

const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      width: "100%",
      height: "86vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    content: {
      flex: 1,
      marginLeft: "200px",
      padding: "20px",
    },
    header: {
      fontSize: "28px",
      textAlign: "center",
      marginBottom: "20px",
      color: "#2D3748",
    },
    filterContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
      gap: "20px",
    },
    filterItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    filterDropdown: {
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    icon: {
      fontSize: "20px",
      color: "#2D3748",
    },
    rosterTable: {
      display: "flex",
      justifyContent: "center",
      maxHeight: "300px", // Adjust this height based on your preference
      overflowY: "auto", // Enable vertical scroll for tbody
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      overflow: "hidden",
    },
    tableHeader: {
      borderBottom: "2px solid #000",
      padding: "10px",
      textAlign: "center",
      backgroundColor: "#4A5568",
      color: "#fff",
      fontWeight: "bold",
      position: "sticky", // Make the header sticky
      top: 0,             // Stick the header to the top of the table
      zIndex: 1,          // Ensure it stays on top of the table content when scrolling
    },
    tableHead: {
      position: "sticky", // Make the header row sticky
      top: 0,             // Keep the header at the top
      backgroundColor: "#4A5568", // Ensure the header has a background color
      zIndex: 10,         // Ensure header stays on top of table rows
    },
  };


  export default RosterPage;
  
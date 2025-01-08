import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBarNavBar from "./Navigation/SideBarNavBar";
import { FaClock, FaCalendarAlt } from "react-icons/fa";

function RosterPage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7163/api/DigitalPlusCrud/GetAllSchedules"
        );
        if (response.data && Array.isArray(response.data)) {
          setScheduleData(response.data);
          setFilteredData(response.data);
        } else {
          setScheduleData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };
    fetchScheduleData();
  }, []);

  // Helper function to organize data
  const organizeData = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = [
      ...new Set(scheduleData.map((item) => item.timeSlot)),
    ].sort();

    const tableData = timeSlots.map((time) => {
      const row = { time };
      days.forEach((day) => {
        const entry = scheduleData.find(
          (item) => item.timeSlot === time && item.dayOfTheWeek === day
        );
        row[day] = entry
          ? `${entry.mentorName}\n${entry.moduleList.join(", ")}`
          : "";
      });
      return row;
    });

    return { days, timeSlots, tableData };
  };

  const { days, tableData } = organizeData();

  return (
    <SideBarNavBar>
      <div style={styles.container}>
        <h1 style={styles.header}>Mentor's Lab 10-252</h1>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.headerCell}>
                  <FaClock /> Time
                </th>
                {days.map((day) => (
                  <th key={day} style={styles.headerCell}>
                    <FaCalendarAlt /> {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td style={styles.timeCell}>{row.time}</td>
                  {days.map((day) => (
                    <td key={day} style={styles.dataCell}>
                      {row[day] ? row[day].split("\n").map((line, i) => (
                        <div key={i}>{line}</div>
                      )) : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SideBarNavBar>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  header: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerCell: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
    border: "1px solid #ddd",
  },
  timeCell: {
    backgroundColor: "#fafafa",
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
    border: "1px solid #ddd",
  },
  dataCell: {
    padding: "10px",
    textAlign: "center",
    border: "1px solid #ddd",
    whiteSpace: "pre-wrap",
  },
};

export default RosterPage;

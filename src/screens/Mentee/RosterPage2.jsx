import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBarNavBar from "./Navigation/SideBarNavBar";
import { FaClock, FaCalendarAlt } from "react-icons/fa";

function RosterPage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("");

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

  const organizeData = (data) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = [...new Set(data.map((item) => item.timeSlot))].sort();

    const tableData = timeSlots.map((time) => {
      const row = { time };
      days.forEach((day) => {
        const entry = data.find(
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

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setTimeFilter(filterValue);

    if (filterValue === "") {
      setFilteredData(scheduleData);
    } else {
      const filtered = scheduleData.filter(
        (item) => item.timeSlot.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const { days, tableData } = organizeData(filteredData);

  return (
    <SideBarNavBar>
      <div style={styles.container}>
        <h1 style={styles.header}>Mentor's Lab 10-252</h1>

        <div style={styles.filterContainer}>
          <label htmlFor="timeFilter" style={styles.filterLabel}>
            Filter by Time:
          </label>
          <input
            id="timeFilter"
            type="text"
            value={timeFilter}
            onChange={handleFilterChange}
            placeholder="Enter time (e.g., 10:00 AM)"
            style={styles.filterInput}
          />
        </div>

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
                      {row[day]
                        ? row[day]
                            .split("\n")
                            .map((line, i) => <div key={i}>{line}</div>)
                        : "N/A"}
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  },
  header: {
    textAlign: "center",
    fontSize: "60px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#000C24",
  },
  filterContainer: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  filterLabel: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000C24",
  },
  filterInput: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "250px",
  },
  tableContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "80%",
    borderCollapse: "collapse",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  headerCell: {
    backgroundColor: "#1A1F36",
    color: "#e6e9ef",
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
    border: "1px solid #444857",
  },
  timeCell: {
    backgroundColor: "#F3F4F6",
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
    border: "1px solid #ccc",
    color: "#000C24",
  },
  dataCell: {
    padding: "10px",
    textAlign: "center",
    border: "1px solid #ccc",
    whiteSpace: "pre-wrap",
    fontSize: "16px",
    color: "#1A1F36",
    backgroundColor: "#f9fafb",
  },
};

export default RosterPage;

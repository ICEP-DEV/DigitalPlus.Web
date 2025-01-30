import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import NavBar from "./Navigation/NavBar";
import SideBar from "./Navigation/SideBar";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaClock, FaCalendarAlt, FaDownload } from "react-icons/fa";

function RosterPage() {
  const navigate = useNavigate(); // Initialize navigate function
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("");

  //FETCHING DATA FROM API
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

  //ORGANIZING DATA
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
          : "N/A";
      });
      return row;
    });

    return { days, tableData };
  };

  //HANDLE FILTER CHANGE
  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setTimeFilter(filterValue);

    if (filterValue === "") {
      setFilteredData(scheduleData);
    } else {
      const filtered = scheduleData.filter((item) =>
        item.timeSlot.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  //DOWNLOAD PDF
  const downloadPDF = () => {
    const { days, tableData } = organizeData(filteredData);

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Mentor's Lab 10-252 Roster", 14, 15);

    const tableBody = tableData.map((row) => [
      row.time,
      ...days.map((day) => row[day]?.replace(/\n/g, " | ") || "N/A"),
    ]);

    doc.autoTable({
      head: [["Time", ...days]],
      body: tableBody,
      startY: 25,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [26, 31, 54], textColor: [230, 233, 239] },
    });

    doc.save("Mentors_Lab_Roster.pdf");
  };

  const { days, tableData } = organizeData(filteredData);

  return (
    <div style={styles.container}>
      <NavBar />
      <SideBar />
      <div style={styles.content}>
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

        <div style={styles.rosterTable}>
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
        <div style={styles.sidebarContainer}></div>
                <button onClick={downloadPDF} style={styles.downloadButton}>
                  <FaDownload style={styles.icon} />
                  Download PDF
                </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    width: "100%",
    height: "100vh",
    backgroundColor: "#D9D9D9",
    overflow: "hidden", // Prevents unintended overflow on the main container
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    overflow: "auto", // Allows vertical scrolling for the main content
    marginLeft: "70px",
    padding: "20px",
    marginTop: '50px',
  },
  header: {
    fontSize: "30px",
    textAlign: "center",
    marginBottom: "20px",
  },
  buttonContainer: {
    position: "absolute",
    bottom: "100px",
    right: "20px",
    display: "flex",
    justifyContent: "flex-end",
    width: "calc(100% - 250px)", // Adjust for the sidebar width
    padding: "0 20px",
  },
  backButton: {
    position: "absolute",
    backgroundColor: "#000C24",
    display: "flex",
    color: "#fff",
    border: "none",
    padding: "10px 30px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "4px",
    bottom: "100px",
    right: "20px",
    fontSize: "20px",
    width: "fit-content",
  },
  rosterTable: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "-40px",
    borderRadius: "10px",
    padding: "10px", // Added padding for better spacing
    "@media (max-width: 768px)": {
      marginTop: "0px", // Adjust margin for smaller screens
      padding: "5px",   // Reduce padding
    },
    "@media (max-width: 480px)": {
      flexDirection: "column", // Stack content vertically on small screens
      alignItems: "stretch",   // Ensure the table fits smaller widths
      padding: "0px",
    },
    
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    borderRadius: "6px",
  },
  tableHeader: {
    borderBottom: "2px solid #000",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#000C24",
    color: "#fff",
  },
  tableRow: {
    borderBottom: "1px solid #ccc",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    whiteSpace: "pre-line", // Preserves line breaks within cells
    border: "1px solid #ccc",
  },
  sidebarContainer: {
    zIndex: "1",
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
  downloadButton: {
    width: "150px",
    padding: "10px 20px",
    backgroundColor: "#28507b",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  icon: {
    marginRight: "8px",
  },
  downloadButtonHover: {
    backgroundColor: "#1c3a61",
  },
};


export default RosterPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBarNavBar from "./Navigation/SideBarNavBar";
import { FaClock, FaCalendarAlt, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

function RosterPage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("");
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
          : "N/A";
      });
      return row;
    });

    return { days, tableData };
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
    <SideBarNavBar>
      <div style={styles.container}>
        <h1 style={styles.header}>Mentor's Lab 10-252</h1>
        <h3>Weekly Roster</h3>
        {loading ? (
          <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p style={styles.loadingMessage}>Loading Roster Data...</p>
          </div>
        ) : (
          <>
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

            <button onClick={downloadPDF} style={styles.downloadButton}>
              <FaDownload style={styles.icon} />
              Download PDF
            </button>
          </>
        )}
      </div>
    </SideBarNavBar>
  );
}


const styles = {
  container: {
    marginBottom: "-80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    textAlign: "center",
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#1A1F36",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30px",
    gap: "10px",
    width: "100%",
    maxWidth: "600px",
  },
  filterLabel: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1A1F36",
  },
  filterInput: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "300px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  downloadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "180px",
    padding: "12px",
    backgroundColor: "#28507b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  icon: {
    marginRight: "8px",
  },
  downloadButtonHover: {
    backgroundColor: "#1c3a61",
  },
  tableContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    overflowX: "auto",
    marginTop: "-60px",
  },
  table: {
    width: "90%",
    maxWidth: "1300px",
    borderCollapse: "collapse",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  headerCell: {
    backgroundColor: "#1A1F36",
    color: "#ffffff",
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "2px solid #444857",
  },
  timeCell: {
    backgroundColor: "#F3F4F6",
    padding: "12px",
    fontWeight: "bold",
    textAlign: "center",
    border: "1px solid #ccc",
    color: "#1A1F36",
  },
  dataCell: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #ccc",
    fontSize: "14px",
    color: "#333333",
    backgroundColor: "#f9fafb",
    whiteSpace: "pre-wrap",
  },
};



export default RosterPage;

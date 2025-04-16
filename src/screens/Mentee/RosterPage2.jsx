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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
  },
  headerContainer: {
    width: "100%",
    maxWidth: "1400px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    position: "relative",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1e293b",
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    padding: "0 20px",
    margin: 0,
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "-30px",
    gap: "15px",
    width: "100%",
    maxWidth: "800px",
    flexWrap: "wrap",
  },
  filterLabel: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#334155",
    marginRight: "10px",
  },
  filterInput: {
    padding: "12px 15px",
    fontSize: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    width: "300px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
  },
  filterInputFocus: {
    outline: "none",
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)",
  },
  downloadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    width: "200px",
    padding: "14px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    magginBottom:"-30px",
    borderRadius: "5px",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(59, 130, 246, 0.3)",
    position: "absolute",
    right: "200px",
    top: "0",
  },
  downloadButtonHover: {
    backgroundColor: "#2563eb",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(59, 130, 246, 0.4)",
  },
  icon: {
    fontSize: "1.2rem",
  },
  tableContainer: {
    width: "100%",
    maxWidth: "1400px",
    overflowX: "auto",
    marginTop: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  headerCell: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    padding: "16px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "0.95rem",
    position: "sticky",
    top: "0",
    zIndex: "10",
  },
  timeCell: {
    backgroundColor: "#f1f5f9",
    padding: "14px",
    fontWeight: "600",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    color: "#1e293b",
    fontSize: "0.9rem",
  },
  dataCell: {
    padding: "14px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    fontSize: "0.9rem",
    color: "#334155",
    backgroundColor: "#ffffff",
    whiteSpace: "nowrap",
    transition: "background-color 0.2s ease",
  },
  dataCellHover: {
    backgroundColor: "#f8fafc",
  },
  // Responsive styles
  "@media (max-width: 768px)": {
    container: {
      padding: "30px 15px",
    },
    headerContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: "20px",
    },
    header: {
      fontSize: "2rem",
      marginBottom: "20px",
      width: "100%",
      textAlign: "left",
    },
    downloadButton: {
      position: "relative",
      right: "auto",
      top: "auto",
      width: "100%",
      marginBottom: "20px",
    },
    filterContainer: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "10px",
    },
    filterInput: {
      width: "100%",
    },
    headerCell: {
      padding: "12px 8px",
      fontSize: "0.85rem",
    },
    timeCell: {
      padding: "10px 8px",
    },
    dataCell: {
      padding: "10px 8px",
    },
  },

  

};



export default RosterPage;

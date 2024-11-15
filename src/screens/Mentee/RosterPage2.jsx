import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to import axios
import SideBarNavBar from "./Navigation/SideBarNavBar";

function RosterPage() {
  const [rosterData, setRosterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchScheduleData = async () => {
          try {
              const response = await axios.get('https://localhost:7163/api/DigitalPlusCrud/GetAllSchedules');
              console.log(response.data); // Check if response.data is an array
              if (response.data && Array.isArray(response.data)) {
                  setRosterData(response.data);
              } else {
                  console.warn('Expected an array but received:', response.data);
                  setRosterData([]); // Set to an empty array as a fallback
              }
          } catch (error) {
              console.error('Error fetching schedule data:', error);
              setRosterData([]); // Handle errors gracefully by setting an empty array
          } finally {
              setLoading(false);
          }
      };
      fetchScheduleData();
  }, []);


  const times = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SideBarNavBar>
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.header}>Mentor's Lab 10-252</h1>
          <div style={styles.rosterTable}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Time</th>
                  <th style={styles.tableHeader}>Monday</th>
                  <th style={styles.tableHeader}>Tuesday</th>
                  <th style={styles.tableHeader}>Wednesday</th>
                  <th style={styles.tableHeader}>Thursday</th>
                  <th style={styles.tableHeader}>Friday</th>
                </tr>
              </thead>
              <tbody>
                {times.map((time, index) => (
                  <tr key={index}>
                    <td>{time}</td>
                    <td>{rosterData[index]?.Monday || "No data"}</td>
                    <td>{rosterData[index]?.Tuesday || "No data"}</td>
                    <td>{rosterData[index]?.Wednesday || "No data"}</td>
                    <td>{rosterData[index]?.Thursday || "No data"}</td>
                    <td>{rosterData[index]?.Friday || "No data"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.sidebarContainer}></div>
        </div>
      </div>
    </SideBarNavBar>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    width: "100%",
    height: "100vh",
    backgroundColor: "#D9D9D9",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    overflow: "hidden",
    marginLeft: "200px",
    padding: "20px",
  },
  header: {
    fontSize: "24px",
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
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
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
    whiteSpace: "pre-line",
    border: "1px solid #ccc",
  },
  sidebarContainer: {
    zIndex: "1",
  },
};

export default RosterPage;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import styles from "./ReportContent.module.css";
import { BsFillPersonCheckFill, BsFileEarmarkTextFill } from "react-icons/bs";
import { RiShareFill, RiDownload2Fill } from "react-icons/ri";
import { FaArrowLeft } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import PropTypes from "prop-types";
import { Typography, CircularProgress } from "@mui/material";

const ReportContent = () => {
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewType, setViewType] = useState("main");
  const [tabView, setTabView] = useState("register");
  const reportRef = useRef(null);
  const [mentors, setMentors] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorsWithModules = async () => {
      try {
        // Fetch mentors list
        const mentorResponse = await axios.get(
          `https://localhost:7163/api/DigitalPlusUser/GetAllMentors`
        );

        if (mentorResponse.data && Array.isArray(mentorResponse.data)) {
          const mentorsWithModules = await Promise.all(
            mentorResponse.data.map(async (mentor) => {
              try {
                // Fetch modules assigned to each mentor
                const moduleResponse = await axios.get(
                  `https://localhost:7163/api/AssignMod/getmodulesBy_MentorId/${mentor.mentorId}`
                );

                return {
                  ...mentor,
                  modules: moduleResponse.data || [], // Add modules data to mentor
                };
              } catch (moduleError) {
                console.error(
                  `Error fetching modules for mentor ${mentor.mentorId}:`,
                  moduleError
                );
                return {
                  ...mentor,
                  modules: [], // Fallback to empty array if error occurs
                };
              }
            })
          );

          setMentors(mentorsWithModules);
          setFilteredReports(mentorsWithModules);
          setLoading(false);
        } else {
          console.error(
            "Unexpected mentor response structure:",
            mentorResponse.data
          );
          setMentors([]);
          setFilteredReports([]);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setMentors([]);
        setFilteredReports([]);
      }
    };

    fetchMentorsWithModules();
  }, []);


  //Handling the search bar when searching for mentor using the name or mento ID
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    const filtered = mentors.filter((mentor) => {
      const mentorName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
      const moduleMatch = mentor.modules.some((module) =>
        module.moduleName.toLowerCase().includes(searchValue)
      );

      return (
        String(mentor.mentorId).toLowerCase().includes(searchValue) ||
        mentor.firstName.toLowerCase().includes(searchValue) ||
        mentor.lastName.toLowerCase().includes(searchValue) ||
        mentorName.includes(searchValue) ||
        moduleMatch // Check if any module name matches the search value
      );
    });

    setFilteredReports(filtered); // Update the filtered reports with the search result
  };

  //Handling the register and report of the mentor
  const viewRegister = (mentorId) => {
    setSelectedReport(`${mentorId}`);
    setViewType("details");
    setTabView("register");
  };

  const viewMentorReport = (mentorId) => {
    setSelectedReport(`${mentorId}`);
    setViewType("details");
    setTabView("mentorReport");
  };

  const goBack = () => {
    setViewType("main");
  };

  //For when you want to download Both the register and the report
  const handleDownload = () => {
    html2pdf(reportRef.current, {
      margin: 1,
      filename: `${selectedReport}_Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    });
  };

  const handleShare = async () => {
    const element = reportRef.current;
    const options = {
      margin: 1,
      filename: `${selectedReport}_Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    try {
      const pdfBlob = await html2pdf()
        .from(element)
        .set(options)
        .output("blob");
      const file = new File([pdfBlob], `${selectedReport}_Report.pdf`, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Mentor Report",
          text: `Here is the mentor report for student ${selectedReport}.`,
        });
      } else {
        alert("Web Share API is not supported in your browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className={styles.reportsContainer}>
      {viewType === "main" && (
        <div className={styles.mainView}>
          <h2 className={styles.header}>
            <GoReport /> Reports
          </h2>
          <div className={styles.filterContainer}>
            <input
              type="text"
              placeholder="Search Student Report"
              onChange={handleSearch}
              className={styles.searchInput}
            />

          </div>

          {isLoading ? (
            // Show loading spinner while fetching data
            <div className={styles.loadingContainer}>
              <CircularProgress />
              <Typography variant="h6">Loading Reports...</Typography>
            </div>
          ) : (
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>Student Number</th>
                  <th>Mentor Name & Surname</th>
                  <th>Modules</th>
                  <th className={styles.actionCol}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className={styles.noResultMessage}>
                      {isLoading}
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((mentor, index) => (
                    <tr key={index}>
                      <td>{mentor.mentorId}</td>
                      <td>{`${mentor.firstName} ${mentor.lastName}`}</td>
                      <td>
                        {mentor.modules && mentor.modules.length > 0
                          ? mentor.modules
                              .map((mod) => mod.moduleName)
                              .join(", ")
                          : "No module assigned"}
                      </td>
                      <td className={styles.actionCell}>
                        <button
                          className={styles.registerIconBtn}
                          onClick={() => viewRegister(mentor.mentorId)}
                          title="Register"
                        >
                          <BsFillPersonCheckFill />
                        </button>
                        <button
                          className={styles.reportIconBtn}
                          onClick={() => viewMentorReport(mentor.mentorId)}
                          title="Mentor Report"
                        >
                          <BsFileEarmarkTextFill />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {viewType === "details" && (
        <div ref={reportRef} className={styles.detailsView}>
          <div className={styles.tabSwitcher}>
            <button
              className={`${styles.tabBtn} ${
                tabView === "register" ? styles.activeTab : ""
              }`}
              onClick={() => setTabView("register")}
            >
              <BsFillPersonCheckFill /> Register
            </button>
            <button
              className={`${styles.tabBtn} ${
                tabView === "mentorReport" ? styles.activeTab : ""
              }`}
              onClick={() => setTabView("mentorReport")}
            >
              <BsFileEarmarkTextFill /> Mentor Report
            </button>
          </div>

          {tabView === "register" && (
            <RegisterComponent mentorId={selectedReport} goBack={goBack} />
          )}

          {tabView === "mentorReport" && (
            <MentorReportComponent mentorId={selectedReport} goBack={goBack} />
          )}

          <div className={styles.actionButtons}>
            <button
              className={styles.shareBtn}
              onClick={handleShare}
              title="Share"
            >
              <RiShareFill />
            </button>
            <button
              className={styles.downloadBtn}
              onClick={handleDownload}
              title="Download"
            >
              <RiDownload2Fill />
            </button>
            <button className={styles.backBtn} onClick={goBack} title="Back">
              <FaArrowLeft />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RegisterComponent = ({ mentorId, goBack }) => {
  const [registerData, setRegisterData] = useState([]);
  const [mentorData, setMentor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menteeregister, setMenteeregister] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // Stores selected month

  // Function to group register data by module
  const groupByModule = (data) => {
    return data.reduce((acc, item) => {
      const moduleCode = item.moduleCode || "Unknown Module";
      if (!acc[moduleCode]) {
        acc[moduleCode] = [];
      }
      acc[moduleCode].push(item);
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch register data and mentor details
        const [registerResponse, mentorResponse, menteeregisterResponse] = await Promise.all([
          axios.get(
            `https://localhost:7163/api/MenteeAndMentorRegister/GetMentorRegister/ByMentorId/${mentorId}`
          ),
          axios.get(
            `https://localhost:7163/api/DigitalPlusUser/GetMentor/${mentorId}`
          ),
          axios.get(
            `https://localhost:7163/api/MenteeAndMentorRegister/GetAllMenteesRegisters`
          ),
        ]);

        setRegisterData(registerResponse.data || []); // Ensure data is always an array
        setMentor(mentorResponse.data || {}); // Ensure mentorData is an object
        setMenteeregister(menteeregisterResponse.data || []);
        setError(null); // Clear previous errors
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mentorId]);

  // Filter register data based on the selected month
  const filteredMenteeRegister = menteeregister
    .filter((item) => registerData.some((register) => register.moduleId === item.moduleId))
    .filter((item) => {
      if (!selectedMonth) return true; // Show all if no month is selected
      const itemMonth = new Date(item.date).getMonth() + 1; // JS Months are 0-based, so add 1
      return itemMonth === parseInt(selectedMonth, 10);
    });

  // Group filtered data by module
  const groupedData = groupByModule(filteredMenteeRegister);
  console.log("Filtered Register Data:", filteredMenteeRegister);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div>
      <h2>Register for Mentor: {mentorData?.mentorName || mentorId}</h2>

      {/* Month Filter */}
      <label htmlFor="monthFilter">Filter by Month: </label>
      <select
        id="monthFilter"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">All Months</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      {/* Render a table for each module */}
      {Object.keys(groupedData).length > 0 ? (
        Object.keys(groupedData).map((moduleCode) => (
          <div key={moduleCode} className={styles.moduleSection}>
            <h3>Module: {moduleCode}</h3>
            <table className={styles.mentorReportTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Module Name</th>
                  <th>Mentee Name</th>
                  <th>Mentor Name</th>
                  <th>Comment</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {groupedData[moduleCode].map((menteeregister, index) => (
                  <tr key={index}>
                    <td>{new Date(menteeregister.date).toLocaleDateString()}</td>
                    <td>{menteeregister.moduleCode || " Module Unknown"}</td>
                    <td>{menteeregister.menteeName || menteeregister.menteeId || "Unknown Mentee"}</td>
                    <td>{menteeregister.mentorId || "Unknown Mentor"}</td>
                    <td>{menteeregister.comment || "No Comment"}</td>
                    <td>{menteeregister.rating || "No Rating"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No register data available for this mentor in the selected month.</p>
      )}

      <button onClick={goBack} className={styles.backButton}>
        Back
      </button>
    </div>
  );
};

RegisterComponent.propTypes = {
  mentorId: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
};


const MentorReportComponent = ({ mentorId, goBack }) => {
  const [reports, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(""); // Stores selected month

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7163/api/MentorReport/add_Report/reports/${mentorId}`
        );
        console.log("Report Response:", response.data);

        if (response.data && Array.isArray(response.data.reports)) {
          setReportData(response.data.reports || []);
        } else {
          setReportData([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [mentorId]);

  // Filter reports based on the selected month
  const filteredReports = reports.filter((report) => {
    if (!selectedMonth) return true; // Show all if no month is selected

    const reportMonth = new Date(report.date).getMonth() + 1; // JS Months are 0-based, so add 1
    return reportMonth === parseInt(selectedMonth, 10);
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.mentorReportView}>
      <h2>Mentor Report for Student: {`${mentorId}`}</h2>

      {/* Month Filter */}
      <label htmlFor="monthFilter">Filter by Month: </label>
      <select
        id="monthFilter"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">All Months</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      <table className={styles.mentorReportTable}>
        <thead>
          <tr>
            <th>Mentor ID</th>
            <th>Date of Session</th>
            <th>Students Present</th>
            <th>Challenges</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.length > 0 ? (
            filteredReports.map((mentorreports, index) => (
              <tr key={index}>
                <td>{mentorreports.mentorId}</td>
                <td>{new Date(mentorreports.date).toLocaleDateString()}</td>
                <td>{mentorreports.noOfStudents}</td>
                <td>{mentorreports.challenges}</td>
                <td>{mentorreports.remarks}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No mentor reports available for this month.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={goBack}>Back</button>
    </div>
  );
};

MentorReportComponent.propTypes = {
  mentorId: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
};

export { RegisterComponent, MentorReportComponent };

export default ReportContent;

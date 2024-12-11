import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import styles from "./ReportContent.module.css";
import { BsFillPersonCheckFill, BsFileEarmarkTextFill } from "react-icons/bs";
import { RiShareFill, RiDownload2Fill } from "react-icons/ri";
import { FaArrowLeft } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { IoFilter } from "react-icons/io5";
import PropTypes from "prop-types";

const ReportContent = () => {
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewType, setViewType] = useState("main");
  const [tabView, setTabView] = useState("register");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const reportRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [mentors, setMentors] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7163/api/DigitalPlusUser/GetAllMentors"
        );
        const data = response.data.map((mentor) => ({
          ...mentor,
          courses: mentor.courses || "No course assigned", // Fallback value
        }));
        console.log("Mentor Data with Courses:", data);
        setMentors(data);
        setFilteredReports(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7163/api/DigitalPlusCrud/GetAllCourses"
        );
        console.log("Full API Response:", response);
    
        if (response.data && response.data.success && Array.isArray(response.data.result)) {
          setCourses(response.data.result);
        } else {
          console.error("Expected an array in response.data.result but received:", response.data);
          setCourses([]); // Fallback to an empty array if data is not in the expected format
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]); // Fallback to an empty array on error
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    const filtered = mentors.filter((mentor) =>
      mentor.mentorId.includes(searchValue)
    );
    setFilteredReports(filtered);
  };

  const handleFilter = () => {
    const filtered = mentors.filter((mentor) => {
      const matchCourse = selectedCourse
        ? mentor.Courses === selectedCourse
        : true;
      const matchMonth = selectedMonth ? mentor.month === selectedMonth : true;
      return matchCourse && matchMonth;
    });
    setFilteredReports(filtered);
  };

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
              placeholder="Search by student number"
              onChange={handleSearch}
              className={styles.searchInput}
            />
            <select
              className={styles.dropdown}
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <option key={course.course_Id} value={course.course_name}>
                    {course.course_Name}
                  </option>
                ))
              ) : (
                <option disabled>No courses available</option>
              )}
            </select>

            <select
              className={styles.dropdown}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <button className={styles.filterBtn} onClick={handleFilter}>
              <IoFilter /> Filter
            </button>
          </div>

          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Student Number</th>
                <th>Mentor Name & Surname</th>
                <th>Course</th>
                <th className={styles.actionCol}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((mentor, index) => (
                <tr key={index}>
                  <td>{mentor.mentorId}</td>
                  <td>{`${mentor.firstName} ${mentor.lastName}`}</td>
                  <td>{mentor.courses || "No course assigned"}</td>
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
              ))}
            </tbody>
          </table>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegisterData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7163/api/MenteeAndMentorRegister`
        );
        console.log("Register Response:", response.data); // Log response data
        setRegisterData(response.data);
      } catch (err) {
        console.error("Error fetching register data:", err.response || err); // Log error details
        setError(
          err.response?.data?.message || "Failed to load register data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegisterData();
  }, [mentorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Register for Student: {`${mentorId}`}</h2>
      <table className={styles.mentorReportTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Mentee Name </th>
            <th>Mentor Name</th>
            <th>Module Name</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {registerData.length > 0 ? (
            registerData.map((menteeregister, index) => (
              <tr key={index}>
                <td>{new Date(menteeregister.date).toLocaleDateString()}</td>
                <td>{menteeregister.menteeId}</td>
                <td>{menteeregister.mentorName}</td>
                <td>{menteeregister.moduleCode}</td>
                <td>{menteeregister.comment}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No register data available for this mentor.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={goBack}>Back</button>
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7163/api/MentorReport/add_Report/reports/${mentorId}`
        );
        console.log("Report Response:", response.data);

        if (response.data && Array.isArray(response.data.reports)) {
          setReportData(response.data.reports);
        } else {
          setReportData([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Failed to load mentor report data.");
        setLoading(false);
      }
    };

    fetchReportData();
  }, [mentorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.mentorReportView}>
      <h2>Mentor Report for Student: {`${mentorId}`}</h2>
      <table className={styles.mentorReportTable}>
        <thead>
          <tr>
            <th>Mentor ID </th>
            <th>Date of Session</th>
            <th>Students Present</th>
            <th>Challenges</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((mentorreports, index) => (
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
              <td colSpan="3">No mentor reports available for this student.</td>
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

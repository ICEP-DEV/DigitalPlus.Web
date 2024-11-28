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
        const response = await axios.get('https://localhost:7163/api/DigitalPlusUser/GetAllMentors');
        const data = response.data.map((mentor) => ({
          ...mentor,
        }));
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
          'https://localhost:7163/api/DigitalPlusCrud/GetAllCourses'
        ); // Replace with your actual API endpoint
        const data =  response.data.map((courses) => ({
          ...courses,
        }));;
        setCourses(data); // Assuming the API returns an array of course objects
      } catch (error) {
        console.error("Error fetching courses:", error);
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
                courses.map((courses) => (
                  <option key={courses.course_Id} value={courses.course_name}>
                    {courses.course_name}
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
                  <td>{mentor.firstName}</td>
                  <td>{mentor.courses}</td>
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
            <MentorReportComponent
              mentorId={selectedReport}
              goBack={goBack}
            />
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

const RegisterComponent = ({ mentorId, goBack }) => (
  <div>
    <h2>Register for Student: {`${mentorId}`}</h2>
    <button onClick={goBack}>Back</button>
  </div>
);

RegisterComponent.propTypes = {
  mentorId: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
};

const MentorReportComponent = ({ mentorId, goBack }) => (
  <div className={styles.mentorReportView}>
    <h2>Mentor Report for Student: {`${mentorId}`}</h2>
    <table className={styles.mentorReportTable}>
      <thead>
        <tr>
          <th>Date of Session</th>
          <th>Students Present / Total Risk Students</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>02/05/2024</td>
          <td>10</td>
          <td>Mentees are attending more lessons.</td>
        </tr>
      </tbody>
    </table>
    <button onClick={goBack}>Back</button>
  </div>
);

MentorReportComponent.propTypes = {
  mentor_Id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
};

export default ReportContent;

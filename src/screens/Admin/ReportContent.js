import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import styles from './ReportContent.module.css';
import { BsFillPersonCheckFill, BsFileEarmarkTextFill } from 'react-icons/bs';
import { RiShareFill, RiDownload2Fill } from 'react-icons/ri';
import { FaArrowLeft } from 'react-icons/fa';
import { GoReport } from "react-icons/go";
import { IoFilter } from "react-icons/io5";

const ReportContent = () => {
  const [reportsData, setReportsData] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewType, setViewType] = useState('main');
  const [tabView, setTabView] = useState('register');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const reportRef = useRef(null);

  // Fetch data from the backend
  useEffect(() => {
    axios.get('/api/reports')
      .then(response => {
        setReportsData(response.data);
        setFilteredReports(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    const filtered = reportsData.filter(report =>
      report.studentNumber.includes(searchValue)
    );
    setFilteredReports(filtered);
  };

  const handleFilter = () => {
    const filtered = reportsData.filter(report => {
      const matchCourse = selectedCourse ? report.course === selectedCourse : true;
      const matchMonth = selectedMonth ? report.month === selectedMonth : true;
      return matchCourse && matchMonth;
    });
    setFilteredReports(filtered);
  };

  const viewRegister = (studentNumber) => {
    setSelectedReport(studentNumber);
    setViewType('details');
    setTabView('register');
  };

  const viewMentorReport = (studentNumber) => {
    setSelectedReport(studentNumber);
    setViewType('details');
    setTabView('mentorReport');
  };

  const goBack = () => {
    setViewType('main');
  };

  const handleDownload = () => {
    html2pdf(reportRef.current, {
      margin: 1,
      filename: `${selectedReport}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    });
  };

  const handleShare = async () => {
    const element = reportRef.current;
    const options = {
      margin: 1,
      filename: `${selectedReport}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      const pdfBlob = await html2pdf().from(element).set(options).output('blob');
      const file = new File([pdfBlob], `${selectedReport}_Report.pdf`, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mentor Report',
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
      {viewType === 'main' && (
        <div className={styles.mainView}>
          <h2 className={styles.header}><GoReport /> Reports</h2>
          <div className={styles.filterContainer}>
            <input
              type="text"
              placeholder="Search by student number"
              onChange={handleSearch}
              className={styles.searchInput}
            />
            <select className={styles.dropdown} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Informatics">Informatics</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Multimedia Computing">Multimedia Computing</option>
            </select>
            <select className={styles.dropdown} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">Month</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
            </select>
            <button className={styles.filterBtn} onClick={handleFilter}><IoFilter /> Filter</button>
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
              {filteredReports.map((report) => (
                <tr key={report.studentNumber}>
                  <td>{report.studentNumber}</td>
                  <td>{report.mentor}</td>
                  <td>{report.course}</td>
                  <td className={styles.actionCell}>
                    <button className={styles.registerIconBtn} onClick={() => viewRegister(report.studentNumber)} title="Register">
                      <BsFillPersonCheckFill />
                    </button>
                    <button className={styles.reportIconBtn} onClick={() => viewMentorReport(report.studentNumber)} title="Mentor Report">
                      <BsFileEarmarkTextFill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewType === 'details' && (
        <div ref={reportRef} className={styles.detailsView}>
          <div className={styles.tabSwitcher}>
            <button
              className={`${styles.tabBtn} ${tabView === 'register' ? styles.activeTab : ''}`}
              onClick={() => setTabView('register')}
            >
              <BsFillPersonCheckFill /> Register
            </button>
            <button
              className={`${styles.tabBtn} ${tabView === 'mentorReport' ? styles.activeTab : ''}`}
              onClick={() => setTabView('mentorReport')}
            >
              <BsFileEarmarkTextFill /> Mentor Report
            </button>
          </div>

          {tabView === 'register' && (
            <RegisterComponent studentNumber={selectedReport} goBack={goBack} />
          )}

          {tabView === 'mentorReport' && (
            <MentorReportComponent studentNumber={selectedReport} goBack={goBack} />
          )}

          <div className={styles.actionButtons}>
            <button className={styles.shareBtn} onClick={handleShare} title="Share">
              <RiShareFill />
            </button>
            <button className={styles.downloadBtn} onClick={handleDownload} title="Download">
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

const RegisterComponent = ({ studentNumber, goBack }) => (
  <div>
    <h2>Register for Student: {studentNumber}</h2>
    <button onClick={goBack}>Back</button>
  </div>
);

const MentorReportComponent = ({ studentNumber, goBack }) => (
  <div className={styles.mentorReportView}>
    <h2>Mentor Report for Student: {studentNumber}</h2>
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

export default ReportContent;

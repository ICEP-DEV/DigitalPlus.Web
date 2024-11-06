import React, { useState } from 'react';
import styles from './ReportContent.module.css';
import { BsFillPersonCheckFill, BsFileEarmarkTextFill } from 'react-icons/bs';
import { RiShareFill, RiDownload2Fill } from 'react-icons/ri';
import { FaArrowLeft } from 'react-icons/fa';
import { GoReport } from "react-icons/go";
import { IoFilter } from "react-icons/io5";

const reportsData = [
  { studentNumber: '22145553', mentor: 'Sfiso Vinjwa', course: 'Computer Science', month: 'May' },
  { studentNumber: '222870097', mentor: 'Karabo Nechicvhangani', course: 'Informatics', month: 'April' },
  { studentNumber: '22456793', mentor: 'Excellent Nambane', course: 'Information Technology', month: 'May' },
  { studentNumber: '221418812', mentor: 'Bathabile Mkhabela', course: 'Multimedia Computing', month: 'June' },
];

const ReportContent = () => {
  const [filteredReports, setFilteredReports] = useState(reportsData);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewType, setViewType] = useState('main');
  const [tabView, setTabView] = useState('register');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

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
        <div className={styles.detailsView}>
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
        </div>
      )}
    </div>
  );
};

const RegisterComponent = ({ studentNumber, goBack }) => {
  const registerData = [
    { studentNumber: '213568452', name: 'Msiza LK', module: 'PPA05D', comments: 'Good session', rating: 8 },
    { studentNumber: '224356789', name: 'Khumal KB', module: 'PPA05D', comments: 'The session was fine', rating: 7 },
    { studentNumber: '222345678', name: 'Stohle FP', module: 'PPA05D', comments: 'Excellent session', rating: 10 },
    { studentNumber: '212345687', name: 'Phala NH', module: 'PPA05D', comments: 'Bad session', rating: 3 },
  ];

  return (
    <div className={styles.registerView}>
      <h2>Register Table for Student: {studentNumber}</h2>
      <table className={styles.registerTable}>
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Surname & Initials</th>
            <th>Module Code</th>
            <th>Comments</th>
            <th>Ratings</th>
          </tr>
        </thead>
        <tbody>
          {registerData.map((entry) => (
            <tr key={entry.studentNumber}>
              <td>{entry.studentNumber}</td>
              <td>{entry.name}</td>
              <td>{entry.module}</td>
              <td>{entry.comments}</td>
              <td>{entry.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.actionButtons}>
        <button className={styles.shareBtn} title="Share">
          <RiShareFill />
        </button>
        <button className={styles.downloadBtn} title="Download">
          <RiDownload2Fill />
        </button>
        <button className={styles.backBtn} onClick={goBack} title="Back">
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

const MentorReportComponent = ({ studentNumber, goBack }) => {
  return (
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

      <div className={styles.extraReport}>
        <h3>Challenges / Recommendations</h3>
        <p>Mentees hesitate to answer questions during sessions.</p>
        <h3>Social Engagement Report</h3>
        <p>Discussion about basic time management skills.</p>
        <h3>Personal Notes</h3>
        <p>Lessons went well, but the attendance was a bit low.</p>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.shareMentorBtn} title="Share">
          <RiShareFill />
        </button>
        <button className={styles.downloadMentorBtn} title="Download">
          <RiDownload2Fill />
        </button>
        <button className={styles.backBtn} onClick={goBack} title="Back">
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default ReportContent;

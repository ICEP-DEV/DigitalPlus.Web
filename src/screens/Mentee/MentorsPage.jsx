import React from 'react';
import './MentorsPage.module.css';

const mentorsData = [
  { surname: 'Dladla', initials: 'T', course: 'PPAF05D', status: 'Not Available', email: 'dladla123@gmail.com' },
  { surname: 'Mkhabela', initials: 'B', course: 'PPAF05D', status: 'Available', email: 'mkhabela46@gmail.com' },
  { surname: 'Nkuna', initials: 'F', course: 'PPAF05D', status: 'Available', email: 'nkuna48@gmail.com' },
  { surname: 'Nkuna', initials: 'F', course: 'PPAF05D', status: 'Available', email: 'nkuna48@gmail.com' }
];

const MentorsPage = () => {
  return (
    <div className="mentorsPage">
      <h1>Assigned Mentors for This Module</h1>
      <table>
        <thead>
          <tr>
            <th>Surname</th>
            <th>Initials</th>
            <th>Course</th>
            <th>Status</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {mentorsData.map((mentor, index) => (
            <tr key={index}>
              <td>{mentor.surname}</td>
              <td>{mentor.initials}</td>
              <td>{mentor.course}</td>
              <td>{mentor.status}</td>
              <td>{mentor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MentorsPage;
 
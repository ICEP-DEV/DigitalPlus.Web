function ScheduleData({ scheduleData }) {
    return scheduleData.map((schedule, index) => (
      <tr key={index}>
        <td>{schedule.timeSlot}</td>
        <td>{schedule.daysOfTheWeek}</td>
        <td>{schedule.mentorId}</td>
        <td>{schedule.moduleList}</td>
      </tr>
    ));
  }
  
  export default ScheduleData;
  
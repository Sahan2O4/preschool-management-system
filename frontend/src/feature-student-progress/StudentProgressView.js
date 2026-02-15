import React from 'react';

const StudentProgressView = ({ progressList }) => {
  return (
    <div className="container">
      <h2>Student Progress (View Only)</h2>

      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {progressList && progressList.length > 0 ? (
            progressList.map((item) => (
              <tr key={item.id}>
                <td>{item.studentName}</td>
                <td>{item.subject}</td>
                <td>{item.progress}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No progress data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentProgressView;

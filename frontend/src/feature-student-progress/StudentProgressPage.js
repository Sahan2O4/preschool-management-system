import React from 'react';
import StudentProgress from './StudentProgress'; // ✅ matches the file

const StudentProgressPage = () => {
  return (
    <div>
      <h1>Student Progress Page</h1>
      <StudentProgress />
    </div>
  );
};

export default StudentProgressPage; // ✅ default export

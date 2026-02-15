import React, { useState } from 'react';
import StudentProgressPage from './feature-student-progress/StudentProgressPage'; // Teacher CRUD
import StudentProgressView from './feature-student-progress/StudentProgressView'; // Read-only

function App() {
  const [userType, setUserType] = useState('teacher'); // 'teacher' or 'parent'

  // Example data (can be replaced with backend)
  const [progressList, setProgressList] = useState([
    { id: 1, studentName: 'Alice', subject: 'Math', progress: 'A' },
    { id: 2, studentName: 'Bob', subject: 'English', progress: 'B+' }
  ]);

  return (
    <div>
      {/* Simple toggle buttons to simulate user login type */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={() => setUserType('teacher')}>Teacher</button>
        <button onClick={() => setUserType('parent')}>Parent</button>
      </div>

      {/* Render based on user type */}
      {userType === 'teacher' ? (
        <StudentProgressPage progressList={progressList} setProgressList={setProgressList} />
      ) : (
        <StudentProgressView progressList={progressList} />
      )}
    </div>
  );
}

export default App;

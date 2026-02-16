import React, { useState } from 'react';
import StudentProgressPage from './feature-student-progress/StudentProgressPage';
import StudentProgressView from './feature-student-progress/StudentProgressView'; // you can create later

function App() {
  const [userType, setUserType] = useState('teacher'); // toggle between teacher/parent

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setUserType('teacher')}>Teacher</button>
        <button onClick={() => setUserType('parent')}>Parent</button>
      </div>

      {userType === 'teacher' ? <StudentProgressPage /> : <StudentProgressView />}
    </div>
  );
}

export default App;

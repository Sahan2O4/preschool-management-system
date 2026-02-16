import React, { useState, useEffect } from 'react';
import { students as dummyStudents } from './dummyData';
import childrenImg from '../assets/children-playing.jpg';
import confetti from 'canvas-confetti';

const StudentProgressPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState(dummyStudents);
  const [notFound, setNotFound] = useState(false); // Added state for not found message

  // Floating animation for children image
  useEffect(() => {
    const floatStyle = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      @keyframes hoverBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    const styleTag = document.createElement('style');
    styleTag.innerHTML = floatStyle;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  const handleSearch = () => {
    const student = students.find(
      s => s.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (student) {
      setSelectedStudent(student);
      setNotFound(false);
      // 🎉 Trigger confetti when student found
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#00CED1', '#FFD700', '#87CEFA'],
      });
    } else {
      setSelectedStudent(null);
      setNotFound(true); // Show not found message
    }
  };

  const handleAddProgress = () => {
    const subject = prompt("Enter subject name:");
    const progress = prompt("Enter progress (e.g., A, B+):");
    if (subject && progress) {
      const updatedStudent = {
        ...selectedStudent,
        subjects: [...selectedStudent.subjects, { subject, progress }]
      };
      updateStudent(updatedStudent);

      // 🎉 Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#00CED1', '#FFD700', '#87CEFA'],
      });
    }
  };

  const handleUpdateProgress = (index) => {
    const newProgress = prompt(
      `Update progress for ${selectedStudent.subjects[index].subject}:`,
      selectedStudent.subjects[index].progress
    );
    if (newProgress) {
      const updatedSubjects = [...selectedStudent.subjects];
      updatedSubjects[index].progress = newProgress;
      const updatedStudent = { ...selectedStudent, subjects: updatedSubjects };
      updateStudent(updatedStudent);
    }
  };

  const handleDeleteProgress = (index) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      const updatedSubjects = [...selectedStudent.subjects];
      updatedSubjects.splice(index, 1);
      const updatedStudent = { ...selectedStudent, subjects: updatedSubjects };
      updateStudent(updatedStudent);
    }
  };

  const updateStudent = (updatedStudent) => {
    const updatedStudents = students.map(s =>
      s.id === updatedStudent.id ? updatedStudent : s
    );
    setStudents(updatedStudents);
    setSelectedStudent(updatedStudent);
  };

  return (
    <div style={{
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFD1DC, #87CEFA)",
      padding: "40px 20px"
    }}>
      <h1 style={{
        textAlign: "center",
        color: "#333",
        marginBottom: "40px",
        fontSize: "2.8rem",
        textShadow: "2px 2px 4px #fff"
      }}>
        🎓 Student Progress
      </h1>

      {/* Search bar */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <input
          type="text"
          placeholder="Enter student name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            padding: "14px",
            width: "60%",
            borderRadius: "30px",
            border: "2px solid #87CEFA",
            outline: "none",
            fontSize: "18px",
            textAlign: "center",
            boxShadow: "0 6px 10px rgba(0,0,0,0.15)"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: "15px",
            padding: "14px 30px",
            borderRadius: "30px",
            border: "none",
            backgroundColor: "#FF69B4",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "18px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
            transition: "all 0.2s",
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.35)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.25)";
          }}
        >
          Search
        </button>
      </div>

      {/* Student not found message */}
      {notFound && (
        <p style={{ textAlign: "center", color: "red", fontSize: "1.3rem", marginTop: "20px" }}>
          Student not found. Please check the name.
        </p>
      )}

      {/* Empty state */}
      {!selectedStudent && !notFound && (
        <div style={{ textAlign: "center", color: "#444", fontSize: "18px", marginTop: "50px" }}>
          <p style={{ fontSize: "1.3rem", marginBottom: "25px" }}>
            Welcome! Search for a student to view and update progress.
          </p>
          <img
            src={childrenImg}
            alt="cartoon children playing"
            width="500"
            style={{
              marginTop: "20px",
              animation: "float 3s ease-in-out infinite",
              borderRadius: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
            }}
          />
        </div>
      )}

      {/* Display selected student */}
      {selectedStudent && (
        <div
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            borderRadius: "25px",
            background: "linear-gradient(145deg, #FFDEE9, #B5FFFC)",
            padding: "50px 30px",
            boxShadow: "0px 14px 30px rgba(0,0,0,0.3)",
            textAlign: "center",
            transition: "transform 0.3s",
          }}
          onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <div style={{ marginBottom: "30px" }}>
            <img
              src={selectedStudent.photo}
              alt={selectedStudent.name}
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                border: "6px solid #FF69B4",
                objectFit: "cover",
                boxShadow: "0 6px 14px rgba(0,0,0,0.25)"
              }}
            />
            <h2 style={{ marginTop: "25px", color: "#333", fontSize: "2.2rem" }}>{selectedStudent.name}</h2>
            <p style={{ color: "#666", fontSize: "1.2rem" }}>Class: {selectedStudent.class}</p>
          </div>

          <h3 style={{ color: "#333", fontSize: "1.6rem", marginBottom: "20px" }}>Subjects:</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {selectedStudent.subjects.map((sub, index) => (
              <li key={index} style={{
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 18px",
                backgroundColor: "#fff4f9",
                borderRadius: "18px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.3s"
              }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <span style={{ fontWeight: "bold", fontSize: "1.15rem" }}>{sub.subject}: {sub.progress}</span>
                <div>
                  <button
                    onClick={() => handleUpdateProgress(index)}
                    style={{
                      marginRight: "10px",
                      padding: "8px 16px",
                      borderRadius: "14px",
                      border: "none",
                      backgroundColor: "#87CEFA",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.3)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteProgress(index)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "14px",
                      border: "none",
                      backgroundColor: "#FF69B4",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.3)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "30px" }}>
            <button
              onClick={handleAddProgress}
              style={{
                padding: "14px 30px",
                borderRadius: "30px",
                border: "none",
                backgroundColor: "#00CED1",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "18px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.35)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.25)";
              }}
            >
              Add Subject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProgressPage;

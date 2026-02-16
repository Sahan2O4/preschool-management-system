import React, { useState } from 'react';
import { students as dummyStudents } from './dummyData'; // same data as teacher view
import childrenImg from '../assets/children-playing.jpg';
import confetti from 'canvas-confetti';

const ParentProgressView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notFound, setNotFound] = useState(false); // new state for student not found

  const handleSearch = () => {
    const student = dummyStudents.find(
      s => s.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (student) {
      setSelectedStudent(student);
      setNotFound(false);

      // 🎉 trigger confetti if student found
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#00CED1', '#FFD700', '#87CEFA'],
      });
    } else {
      setSelectedStudent(null);
      setNotFound(true);
    }
  };

  return (
    <div style={{
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFD1DC, #87CEFA)",
      padding: "40px 20px",
      textAlign: "center"
    }}>
      <h1 style={{
        fontSize: "2.8rem",
        color: "#333",
        textShadow: "2px 2px 4px #fff",
        marginBottom: "40px"
      }}>
        🏠 View Your Child's Progress
      </h1>

      {/* Search bar */}
      <div style={{ marginBottom: "50px" }}>
        <input
          type="text"
          placeholder="Enter child’s name"
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
        <p style={{ color: "red", fontSize: "1.3rem", marginTop: "20px" }}>
          Student not found. Please check the name.
        </p>
      )}

      {/* Empty state */}
      {!selectedStudent && !notFound && (
        <div style={{ color: "#444", fontSize: "18px", marginTop: "50px" }}>
          <p style={{ fontSize: "1.3rem", marginBottom: "25px" }}>
            Welcome! Search for your child to view their progress.
          </p>
          <img
            src={childrenImg}
            alt="cartoon children playing"
            width="500"
            style={{
              marginTop: "20px",
              borderRadius: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
            }}
          />
        </div>
      )}

      {/* Display student progress */}
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
          <img
            src={selectedStudent.photo}
            alt={selectedStudent.name}
            style={{
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              border: "6px solid #FF69B4",
              objectFit: "cover",
              boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
              marginBottom: "25px"
            }}
          />
          <h2 style={{ marginBottom: "10px", fontSize: "2.2rem", color: "#333" }}>
            {selectedStudent.name}
          </h2>
          <p style={{ color: "#666", fontSize: "1.2rem", marginBottom: "30px" }}>
            Class: {selectedStudent.class}
          </p>

          <h3 style={{ fontSize: "1.6rem", marginBottom: "20px", color: "#333" }}>Subjects:</h3>
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
                <span style={{ fontWeight: "bold", fontSize: "1.15rem" }}>
                  {sub.subject}: {sub.progress}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParentProgressView;

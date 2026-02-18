import React, { useEffect, useState } from "react";

export default function AdminDashboard({ setIsAdminLoggedIn }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbacks(stored);
  }, []);

  return (
    <div className="container">
      <div className="glass-card large">
        <div className="dashboard-header">
          <h2 className="title">Admin Dashboard</h2>
          <button
            className="logout-btn"
            onClick={() => setIsAdminLoggedIn(false)}
          >
            Logout
          </button>
        </div>

        {feedbacks.length === 0 ? (
          <p>No feedback available.</p>
        ) : (
          feedbacks.map((fb, index) => (
            <div key={index} className="feedback-card">
              <h3>{fb.parentName}</h3>
              <p>
                <strong>Child:</strong> {fb.childName}
              </p>
              <p>
                <strong>Email:</strong> {fb.email}
              </p>
              <p>
                <strong>Rating:</strong> {fb.rating} ⭐
              </p>
              <p>{fb.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

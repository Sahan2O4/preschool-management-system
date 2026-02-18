import React, { useState } from "react";
import FeedbackPage from "./FeedbackPage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import logo from "./assets/logo.png"; // Import logo
import "./styles.css";

function App() {
  const [page, setPage] = useState("feedback");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Montessori Logo" className="nav-logo" />
          <h2 className="school-name">Merry Kids International</h2>
        </div>

        <div className="nav-right">
          <button onClick={() => setPage("feedback")}>Feedback</button>
          <button onClick={() => setPage("admin")}>Admin</button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      {page === "feedback" && <FeedbackPage />}

      {page === "admin" &&
        (isAdminLoggedIn ? (
          <AdminDashboard setIsAdminLoggedIn={setIsAdminLoggedIn} />
        ) : (
          <AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />
        ))}
    </div>
  );
}

export default App;

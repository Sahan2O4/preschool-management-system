import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import FinancialManagement from "./pages/FinancialManagement/FinancialManagement";

/* temporary pages */
function Dashboard() {
  return <div style={{ padding: 30 }}>Dashboard Page</div>;
}
function Students() {
  return <div style={{ padding: 30 }}>Students Page</div>;
}
function Events() {
  return <div style={{ padding: 30 }}>Events Page</div>;
}
function Feedback() {
  return <div style={{ padding: 30 }}>Feedback Page</div>;
}

export default function App() {
  // 🔴 change to "user" to test user view
  const [role, setRole] = useState("admin");

  return (
    <>
      {/* Navbar gets role switch */}
      <Navbar role={role} setRole={setRole} />

      <Routes>
        <Route path="/" element={<Navigate to="/financial" />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/events" element={<Events />} />
        
        {/* financial page role-based */}
        <Route
          path="/financial"
          element={<FinancialManagement role={role} />}
        />

        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </>
  );
}
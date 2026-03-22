import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public Pages
import Homepage from "./pages/Homepage";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Events from "./pages/Events";
import InteractiveSessions from "./pages/InteractiveSessions";
import Feedback from "./pages/Feedback";

// Student / Parent Page
import StudentProfile from "./pages/StudentProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentManagement from "./pages/admin/StudentManagement";
import AttendanceManagement from "./pages/admin/AttendanceManagement";
import ProgressTracking from "./pages/admin/ProgressTracking";
import EventManagement from "./pages/admin/EventManagement";
import FeedbackManagement from "./pages/admin/FeedbackManagement";
import FinancialManagement from "./pages/admin/FinancialManagement";
import SessionManagement from "./pages/admin/SessionManagement";

// ─── Protected Route wrapper ───────────────────────────────────────────────
const RequireAuth = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;
  return children;
};

// ─── App Routes ────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Homepage />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/login" element={<Login />} />
    <Route path="/events" element={<Events />} />
    <Route path="/interactive-sessions" element={<InteractiveSessions />} />
    <Route path="/feedback" element={<Feedback />} />

    {/* Parent / Teacher profile */}
    <Route
      path="/profile"
      element={
        <RequireAuth allowedRoles={["parent", "teacher"]}>
          <StudentProfile />
        </RequireAuth>
      }
    />

    {/* Admin */}
    <Route path="/admin" element={<RequireAuth allowedRoles={["admin"]}><AdminDashboard /></RequireAuth>} />
    <Route path="/admin/students" element={<RequireAuth allowedRoles={["admin"]}><StudentManagement /></RequireAuth>} />
    <Route path="/admin/attendance" element={<RequireAuth allowedRoles={["admin"]}><AttendanceManagement /></RequireAuth>} />
    <Route path="/admin/progress" element={<RequireAuth allowedRoles={["admin"]}><ProgressTracking /></RequireAuth>} />
    <Route path="/admin/events" element={<RequireAuth allowedRoles={["admin"]}><EventManagement /></RequireAuth>} />
    <Route path="/admin/feedback" element={<RequireAuth allowedRoles={["admin"]}><FeedbackManagement /></RequireAuth>} />
    <Route path="/admin/financial" element={<RequireAuth allowedRoles={["admin"]}><FinancialManagement /></RequireAuth>} />
    <Route path="/admin/sessions" element={<RequireAuth allowedRoles={["admin"]}><SessionManagement /></RequireAuth>} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;

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
import TeacherManagement from "./pages/admin/TeacherManagement";

// Teacher Pages (reuse admin components, teacher-mode navbar)
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherProgress from "./pages/teacher/TeacherProgress";
import TeacherEvents from "./pages/teacher/TeacherEvents";
import TeacherFeedback from "./pages/teacher/TeacherFeedback";
import TeacherSessions from "./pages/teacher/TeacherSessions";

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

    {/* Parent profile */}
    <Route path="/profile" element={<RequireAuth allowedRoles={["parent"]}><StudentProfile /></RequireAuth>} />

    {/* Admin */}
    <Route path="/admin"              element={<RequireAuth allowedRoles={["admin"]}><AdminDashboard /></RequireAuth>} />
    <Route path="/admin/students"     element={<RequireAuth allowedRoles={["admin"]}><StudentManagement /></RequireAuth>} />
    <Route path="/admin/attendance"   element={<RequireAuth allowedRoles={["admin"]}><AttendanceManagement /></RequireAuth>} />
    <Route path="/admin/progress"     element={<RequireAuth allowedRoles={["admin"]}><ProgressTracking /></RequireAuth>} />
    <Route path="/admin/events"       element={<RequireAuth allowedRoles={["admin"]}><EventManagement /></RequireAuth>} />
    <Route path="/admin/feedback"     element={<RequireAuth allowedRoles={["admin"]}><FeedbackManagement /></RequireAuth>} />
    <Route path="/admin/financial"    element={<RequireAuth allowedRoles={["admin"]}><FinancialManagement /></RequireAuth>} />
    <Route path="/admin/sessions"     element={<RequireAuth allowedRoles={["admin"]}><SessionManagement /></RequireAuth>} />
    <Route path="/admin/teachers"     element={<RequireAuth allowedRoles={["admin"]}><TeacherManagement /></RequireAuth>} />

    {/* Teacher */}
    <Route path="/teacher"            element={<RequireAuth allowedRoles={["teacher"]}><TeacherDashboard /></RequireAuth>} />
    <Route path="/teacher/students"   element={<RequireAuth allowedRoles={["teacher"]}><TeacherStudents /></RequireAuth>} />
    <Route path="/teacher/attendance" element={<RequireAuth allowedRoles={["teacher"]}><TeacherAttendance /></RequireAuth>} />
    <Route path="/teacher/progress"   element={<RequireAuth allowedRoles={["teacher"]}><TeacherProgress /></RequireAuth>} />
    <Route path="/teacher/events"     element={<RequireAuth allowedRoles={["teacher"]}><TeacherEvents /></RequireAuth>} />
    <Route path="/teacher/feedback"   element={<RequireAuth allowedRoles={["teacher"]}><TeacherFeedback /></RequireAuth>} />
    <Route path="/teacher/sessions"   element={<RequireAuth allowedRoles={["teacher"]}><TeacherSessions /></RequireAuth>} />

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

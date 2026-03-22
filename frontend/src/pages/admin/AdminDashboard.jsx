import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const stats = [
  { label: "Total Students", value: "48", icon: "🎒", color: "#4facfe" },
  { label: "Staff Members", value: "7", icon: "👩‍🏫", color: "#ff7eb3" },
  { label: "Events This Month", value: "3", icon: "📅", color: "#a78bfa" },
  { label: "Pending Feedback", value: "5", icon: "💬", color: "#f59e0b" },
  { label: "Monthly Income", value: "LKR 285,000", icon: "💰", color: "#34d399" },
  { label: "Sessions This Week", value: "6", icon: "🎓", color: "#f87171" },
];

const quickLinks = [
  { label: "Student Management", path: "/admin/students", icon: "🎒", desc: "Add, view and manage student profiles" },
  { label: "Attendance", path: "/admin/attendance", icon: "✅", desc: "Mark and track daily attendance" },
  { label: "Progress Tracking", path: "/admin/progress", icon: "📈", desc: "Record and monitor student progress" },
  { label: "Event Management", path: "/admin/events", icon: "📅", desc: "Create and manage school events" },
  { label: "Feedback", path: "/admin/feedback", icon: "💬", desc: "View and respond to inquiries" },
  { label: "Financial Management", path: "/admin/financial", icon: "💰", desc: "Track income, expenses and salaries" },
  { label: "Sessions", path: "/admin/sessions", icon: "🎓", desc: "Manage interactive learning sessions" },
];

const recentActivity = [
  { text: "New student enrolled: Sithara Perera", time: "2 hours ago", icon: "🎒" },
  { text: "Attendance marked for Class A", time: "3 hours ago", icon: "✅" },
  { text: "Feedback received from parent: K. Jayawardena", time: "5 hours ago", icon: "💬" },
  { text: "Event 'Sports Day' updated", time: "Yesterday", icon: "📅" },
  { text: "Progress report added for Nimasha Dilrukshi", time: "Yesterday", icon: "📈" },
  { text: "Salary payments processed for April 2026", time: "2 days ago", icon: "💰" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <Navbar currentPage="Dashboard" mode="admin" />

      <div className="admin-body">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening at Merry Kids today.</p>
          </div>
          <div className="date-badge">
            📆 {new Date().toLocaleDateString("en-LK", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
              <span className="stat-icon">{s.icon}</span>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-row">
          {/* Quick Links */}
          <div className="quick-section">
            <h2>Quick Access</h2>
            <div className="quick-grid">
              {quickLinks.map((q, i) => (
                <div key={i} className="quick-card" onClick={() => navigate(q.path)}>
                  <span className="quick-icon">{q.icon}</span>
                  <div>
                    <p className="quick-label">{q.label}</p>
                    <p className="quick-desc">{q.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((a, i) => (
                <div key={i} className="activity-item">
                  <span className="act-icon">{a.icon}</span>
                  <div>
                    <p className="act-text">{a.text}</p>
                    <p className="act-time">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .admin-page { background:#f4f6f9; min-height:100vh; }
        .admin-body { padding:40px; max-width:1400px; margin:auto; }
        .admin-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:36px; flex-wrap:wrap; gap:16px; }
        .admin-header h1 { font-size:34px; color:#ff4fa3; margin-bottom:6px; }
        .admin-header p { color:#777; font-size:16px; }
        .date-badge { background:white; padding:12px 20px; border-radius:12px; font-weight:600; color:#555; box-shadow:0 2px 10px rgba(0,0,0,0.08); font-size:14px; }

        .stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; margin-bottom:36px; }
        .stat-card { background:white; border-radius:14px; padding:24px; display:flex; align-items:center; gap:18px; box-shadow:0 4px 14px rgba(0,0,0,0.08); transition:transform 0.2s; }
        .stat-card:hover { transform:translateY(-4px); }
        .stat-icon { font-size:32px; }
        .stat-value { font-size:26px; font-weight:700; color:#333; }
        .stat-label { font-size:13px; color:#888; margin-top:2px; }

        .dash-row { display:flex; gap:30px; flex-wrap:wrap; }
        .quick-section { flex:2; min-width:300px; }
        .activity-section { flex:1; min-width:280px; }
        .quick-section h2, .activity-section h2 { font-size:22px; color:#ff4fa3; margin-bottom:18px; }

        .quick-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; }
        .quick-card { background:white; border-radius:14px; padding:20px; display:flex; align-items:center; gap:16px; box-shadow:0 4px 12px rgba(0,0,0,0.08); cursor:pointer; transition:all 0.25s; border-left:4px solid transparent; }
        .quick-card:hover { transform:translateX(6px); border-left-color:#ff4fa3; }
        .quick-icon { font-size:26px; }
        .quick-label { font-weight:700; font-size:15px; color:#333; margin-bottom:4px; }
        .quick-desc { font-size:12px; color:#888; }

        .activity-list { background:white; border-radius:14px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.08); display:flex; flex-direction:column; gap:18px; }
        .activity-item { display:flex; gap:14px; align-items:flex-start; }
        .act-icon { font-size:20px; margin-top:2px; }
        .act-text { font-size:14px; color:#333; font-weight:500; }
        .act-time { font-size:12px; color:#aaa; margin-top:3px; }

        @media(max-width:768px){ .admin-body{padding:20px;} .dash-row{flex-direction:column;} }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

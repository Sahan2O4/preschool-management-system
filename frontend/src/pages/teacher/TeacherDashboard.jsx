import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { studentAPI, eventAPI, feedbackAPI, sessionAPI } from "../../services/api";

const quickLinks = [
  { label: "Student Management", path: "/teacher/students", icon: "🎒", desc: "View and manage student profiles" },
  { label: "Attendance", path: "/teacher/attendance", icon: "✅", desc: "Mark and track daily attendance" },
  { label: "Progress Tracking", path: "/teacher/progress", icon: "📈", desc: "Record and monitor student progress" },
  { label: "Event Management", path: "/teacher/events", icon: "📅", desc: "Create and manage school events" },
  { label: "Feedback", path: "/teacher/feedback", icon: "💬", desc: "View and respond to inquiries" },
  { label: "Sessions", path: "/teacher/sessions", icon: "🎓", desc: "Manage interactive learning sessions" },
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Students", value: "—", icon: "🎒", color: "#4facfe" },
    { label: "Pending Feedback", value: "—", icon: "💬", color: "#f59e0b" },
    { label: "Events This Month", value: "—", icon: "📅", color: "#a78bfa" },
    { label: "Sessions This Week", value: "—", icon: "🎓", color: "#f87171" },
    { label: "Active Students", value: "—", icon: "⭐", color: "#34d399" },
    { label: "My Sessions", value: "—", icon: "🧑‍🏫", color: "#ff7eb3" },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [classSummary, setClassSummary] = useState({ "Class A": 0, "Class B": 0, "Class C": 0 });

  useEffect(() => { loadDashboardData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return "Recently";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins || 1} minute${mins !== 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString("en-LK");
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const weekStart  = new Date(now); weekStart.setDate(now.getDate() - now.getDay());

      const [students, events, feedbacks, sessions] = await Promise.allSettled([
        studentAPI.getAll(),
        eventAPI.getAll(),
        feedbackAPI.getAll(),
        sessionAPI.getAll(),
      ]);

      const stuData  = students.status  === "fulfilled" ? students.value  : [];
      const evData   = events.status    === "fulfilled" ? events.value    : [];
      const fbData   = feedbacks.status === "fulfilled" ? feedbacks.value : [];
      const sessData = sessions.status  === "fulfilled" ? sessions.value  : [];

      const totalStudents   = stuData.length;
      const activeStudents  = stuData.filter(s => s.status === "Active").length;
      const pendingFeedback = fbData.filter(f => f.status === "Pending").length;
      const eventsThisMonth = evData.filter(e => new Date(e.date) >= monthStart).length;
      const sessionsThisWeek= sessData.filter(s => new Date(s.date) >= weekStart).length;
      // Sessions taught by this teacher
      const mySessions = sessData.filter(s => s.teacher && user?.name && s.teacher.includes(user.name.split(" ")[0])).length;

      // Class breakdown
      const counts = { "Class A": 0, "Class B": 0, "Class C": 0 };
      stuData.forEach(s => { if (counts[s.className] !== undefined) counts[s.className]++; });
      setClassSummary(counts);

      setStats([
        { label: "Total Students",   value: String(totalStudents),   icon: "🎒", color: "#4facfe" },
        { label: "Pending Feedback", value: String(pendingFeedback), icon: "💬", color: "#f59e0b" },
        { label: "Events This Month",value: String(eventsThisMonth), icon: "📅", color: "#a78bfa" },
        { label: "Sessions This Week",value:String(sessionsThisWeek),icon: "🎓", color: "#f87171" },
        { label: "Active Students",  value: String(activeStudents),  icon: "⭐", color: "#34d399" },
        { label: "My Sessions",      value: String(mySessions || sessionsThisWeek), icon: "🧑‍🏫", color: "#ff7eb3" },
      ]);

      // Recent activity
      const activity = [];
      stuData.slice(-2).reverse().forEach(s => {
        activity.push({ text: `Student: ${s.name} (${s.className || ""})`, time: getRelativeTime(s.createdAt), icon: "🎒" });
      });
      fbData.filter(f => f.status === "Pending").slice(-2).reverse().forEach(f => {
        activity.push({ text: `Feedback from ${f.name}: ${f.type}`, time: getRelativeTime(f.createdAt), icon: "💬" });
      });
      evData.slice(-2).reverse().forEach(e => {
        activity.push({ text: `Event: "${e.title}" — ${new Date(e.date).toLocaleDateString("en-LK")}`, time: getRelativeTime(e.createdAt), icon: "📅" });
      });
      sessData.slice(-1).reverse().forEach(s => {
        activity.push({ text: `Session: "${s.title}" by ${s.teacher}`, time: getRelativeTime(s.createdAt), icon: "🎓" });
      });

      setRecentActivity(activity.slice(0, 6));
    } catch (err) {
      console.error("Teacher dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Navbar currentPage="Dashboard" mode="teacher" />
      <div className="admin-body">
        <div className="admin-header">
          <div>
            <h1>👩‍🏫 Teacher Dashboard</h1>
            <p>Welcome, {user?.name}! Here's what's happening at Merry Kids today.</p>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
            <button className="refresh-btn" onClick={loadDashboardData} disabled={loading}>
              {loading ? "⏳ Loading..." : "🔄 Refresh"}
            </button>
            <div className="date-badge">
              📆 {new Date().toLocaleDateString("en-LK", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
              <span className="stat-icon">{s.icon}</span>
              <div>
                <p className="stat-value">{loading ? <span className="skeleton">———</span> : s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Class breakdown */}
        <div className="class-overview">
          <h2>👩‍🏫 Students by Class</h2>
          <div className="class-cards">
            {Object.entries(classSummary).map(([cls, count]) => (
              <div key={cls} className="class-card"
                style={{borderLeft:`5px solid ${cls==="Class A"?"#4facfe":cls==="Class B"?"#a78bfa":"#34d399"}`}}>
                <div className="class-icon">{cls==="Class A"?"🔵":cls==="Class B"?"🟣":"🟢"}</div>
                <div>
                  <p className="class-name">{cls}</p>
                  <p className="class-count">{count} student{count!==1?"s":""}</p>
                </div>
              </div>
            ))}
          </div>
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
              {recentActivity.length === 0
                ? <div className="no-activity">No recent activity.</div>
                : recentActivity.map((a, i) => (
                  <div key={i} className="activity-item">
                    <span className="act-icon">{a.icon}</span>
                    <div>
                      <p className="act-text">{a.text}</p>
                      <p className="act-time">{a.time}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .admin-page{background:#f4f6f9;min-height:100vh;}
        .admin-body{padding:40px;max-width:1400px;margin:auto;}
        .admin-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;flex-wrap:wrap;gap:16px;}
        .admin-header h1{font-size:34px;color:#ff4fa3;margin-bottom:6px;}
        .admin-header p{color:#777;font-size:16px;}
        .date-badge{background:white;padding:12px 20px;border-radius:12px;font-weight:600;color:#555;box-shadow:0 2px 10px rgba(0,0,0,0.08);font-size:14px;}
        .refresh-btn{padding:10px 20px;border-radius:20px;border:2px solid #4facfe;background:white;color:#4facfe;font-weight:600;cursor:pointer;font-size:14px;transition:all 0.2s;}
        .refresh-btn:hover:not(:disabled){background:#4facfe;color:white;}
        .refresh-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;margin-bottom:30px;}
        .stat-card{background:white;border-radius:14px;padding:24px;display:flex;align-items:center;gap:18px;box-shadow:0 4px 14px rgba(0,0,0,0.08);transition:transform 0.2s;}
        .stat-card:hover{transform:translateY(-4px);}
        .stat-icon{font-size:32px;}
        .stat-value{font-size:26px;font-weight:700;color:#333;}
        .stat-label{font-size:13px;color:#888;margin-top:2px;}
        .skeleton{display:inline-block;background:#eee;border-radius:4px;animation:pulse 1.4s ease infinite;color:transparent;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .class-overview{background:white;border-radius:16px;padding:24px;margin-bottom:28px;box-shadow:0 4px 14px rgba(0,0,0,0.08);}
        .class-overview h2{font-size:20px;color:#ff4fa3;margin-bottom:16px;}
        .class-cards{display:flex;gap:16px;flex-wrap:wrap;}
        .class-card{display:flex;align-items:center;gap:14px;padding:16px 24px;border-radius:12px;background:#f9f9f9;flex:1;min-width:160px;}
        .class-icon{font-size:28px;}
        .class-name{font-weight:700;font-size:16px;color:#333;}
        .class-count{font-size:13px;color:#888;margin-top:3px;}
        .dash-row{display:flex;gap:30px;flex-wrap:wrap;}
        .quick-section{flex:2;min-width:300px;}
        .activity-section{flex:1;min-width:280px;}
        .quick-section h2,.activity-section h2{font-size:22px;color:#ff4fa3;margin-bottom:18px;}
        .quick-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;}
        .quick-card{background:white;border-radius:14px;padding:20px;display:flex;align-items:center;gap:16px;box-shadow:0 4px 12px rgba(0,0,0,0.08);cursor:pointer;transition:all 0.25s;border-left:4px solid transparent;}
        .quick-card:hover{transform:translateX(6px);border-left-color:#ff4fa3;}
        .quick-icon{font-size:26px;}
        .quick-label{font-weight:700;font-size:15px;color:#333;margin-bottom:4px;}
        .quick-desc{font-size:12px;color:#888;}
        .activity-list{background:white;border-radius:14px;padding:20px;box-shadow:0 4px 12px rgba(0,0,0,0.08);display:flex;flex-direction:column;gap:18px;}
        .activity-item{display:flex;gap:14px;align-items:flex-start;}
        .act-icon{font-size:20px;margin-top:2px;}
        .act-text{font-size:14px;color:#333;font-weight:500;}
        .act-time{font-size:12px;color:#aaa;margin-top:3px;}
        .no-activity{text-align:center;color:#aaa;padding:24px;font-size:14px;}
        @media(max-width:768px){.admin-body{padding:20px;}.dash-row{flex-direction:column;}}
      `}</style>
    </div>
  );
};

export default TeacherDashboard;

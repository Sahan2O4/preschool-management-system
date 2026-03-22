import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { studentAPI, attendanceAPI, progressAPI, sessionAPI } from "../services/api";

const gradeColors = {
  "A+":"#16a34a","A":"#22c55e","A-":"#4ade80",
  "B+":"#4facfe","B":"#60a5fa","B-":"#93c5fd",
  "C":"#f59e0b","D":"#f87171",
};
const subjectColors = {
  English:"#4facfe", Mathematics:"#ff7eb3", Science:"#34d399",
  "Arts & Crafts":"#f59e0b", Music:"#a78bfa", "Physical Education":"#f87171",
};

// ─── Teacher view (simple) ─────────────────────────────────────────────────
const TeacherView = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div>
      <Navbar currentPage="" mode="public" />
      <section className="profile-hero">
        <div className="profile-avatar">👩‍🏫</div>
        <h1>{user.name}</h1>
        <p className="profile-role-tag">Teacher — Merry Kids International</p>
      </section>
      <section className="profile-body">
        <div className="tab-content" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="info-card">
            <h2>My Details</h2>
            <div className="info-grid">
              <div><strong>Full Name</strong><p>{user.name}</p></div>
              <div><strong>Email</strong><p>{user.email}</p></div>
              <div><strong>Phone</strong><p>{user.phone || "—"}</p></div>
              <div><strong>Role</strong><p>Teacher</p></div>
            </div>
          </div>
          <div className="ql-grid" style={{ marginTop: 24 }}>
            <div className="ql-btn" onClick={() => navigate("/events")}>📅 View Events</div>
            <div className="ql-btn" onClick={() => navigate("/interactive-sessions")}>🎓 Sessions</div>
            <div className="ql-btn" onClick={() => navigate("/feedback")}>💬 Feedback</div>
            <div className="ql-btn logout" onClick={() => { logout(); navigate("/"); }}>🚪 Logout</div>
          </div>
        </div>
      </section>
      <Footer />
      <style>{sharedStyles}</style>
    </div>
  );
};

// ─── Parent / Student view ─────────────────────────────────────────────────
const ParentView = ({ user }) => {
  const navigate   = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Data from MongoDB
  const [student,    setStudent]    = useState(null);
  const [progress,   setProgress]   = useState([]);
  const [attendance, setAttendance] = useState([]);  // all attendance docs
  const [sessions,   setSessions]   = useState([]);

  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [loadingAtt, setLoadingAtt] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: fetch student by parent email ─────────────────────────────
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoadingStudent(true);
        const data = await studentAPI.byParentEmail(user.email);
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStudent(false);
      }
    };
    fetchStudent();
  }, [user.email]);

  // ── Step 2: once student is loaded, fetch progress + attendance ───────
  useEffect(() => {
    if (!student) return;

    const fetchProgress = async () => {
      try {
        setLoadingProgress(true);
        const data = await progressAPI.getByStudent(student._id);
        setProgress(data);
      } catch {} finally { setLoadingProgress(false); }
    };

    const fetchAttendance = async () => {
      try {
        setLoadingAtt(true);
        // Get all attendance records and filter for this student
        const data = await attendanceAPI.getAll();
        setAttendance(data);
      } catch {} finally { setLoadingAtt(false); }
    };

    const fetchSessions = async () => {
      try {
        const data = await sessionAPI.getAll();
        setSessions(data);
      } catch {}
    };

    fetchProgress();
    fetchAttendance();
    fetchSessions();
  }, [student]);

  // ── Calculate attendance stats for this student ───────────────────────
  const attStats = (() => {
    if (!student) return { present: 0, absent: 0, late: 0, total: 0 };
    let present = 0, absent = 0, late = 0;
    attendance.forEach(doc => {
      doc.records?.forEach(r => {
        const sid = r.studentId?._id || r.studentId;
        if (String(sid) === String(student._id)) {
          if (r.status === "Present") present++;
          else if (r.status === "Absent") absent++;
          else if (r.status === "Late")   late++;
        }
      });
    });
    const total = present + absent + late;
    return { present, absent, late, total };
  })();

  const attPct = attStats.total > 0
    ? Math.round((attStats.present / attStats.total) * 100) : 0;

  const gradePoints = { "A+":4.0,"A":4.0,"A-":3.7,"B+":3.3,"B":3.0,"B-":2.7,"C":2.0,"D":1.0 };
  const avgGP = progress.length
    ? (progress.reduce((s,r) => s + (gradePoints[r.grade]||0), 0) / progress.length).toFixed(2)
    : "N/A";

  // ── Loading / error states ────────────────────────────────────────────
  if (loadingStudent) {
    return (
      <div>
        <Navbar currentPage="" mode="public" />
        <div className="loading-screen">⏳ Loading your profile from database...</div>
        <Footer />
        <style>{sharedStyles}</style>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div>
        <Navbar currentPage="" mode="public" />
        <div className="profile-hero">
          <div className="profile-avatar">👤</div>
          <h1>{user.name}</h1>
          <p className="profile-role-tag">Parent / Guardian</p>
        </div>
        <section className="profile-body">
          <div className="tab-content" style={{ maxWidth: 700, margin: "0 auto" }}>
            <div className="no-student-card">
              <span className="no-student-icon">🔍</span>
              <h2>No Student Linked Yet</h2>
              <p>
                Your account (<strong>{user.email}</strong>) is not linked to any
                student record in the system yet.
              </p>
              <p>
                Please contact the school and ask the admin to add your child's
                profile with your email address (<strong>{user.email}</strong>) as
                the parent email.
              </p>
              <div className="ql-grid" style={{ justifyContent: "center", marginTop: 24 }}>
                <div className="ql-btn" onClick={() => navigate("/feedback")}>💬 Contact School</div>
                <div className="ql-btn logout" onClick={() => { logout(); navigate("/"); }}>🚪 Logout</div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <style>{sharedStyles}</style>
      </div>
    );
  }

  // ── Full profile ──────────────────────────────────────────────────────
  return (
    <div>
      <Navbar currentPage="" mode="public" />

      {/* Hero */}
      <section className="profile-hero">
        <div className="profile-avatar">🎒</div>
        <h1>{student.name}</h1>
        <p className="profile-role-tag">
          {student.studentId} &nbsp;·&nbsp;
          <span className={student.status === "Active" ? "status-active" : "status-inactive"}>
            {student.status}
          </span>
        </p>
        <p className="profile-parent-tag">Parent / Guardian: {user.name}</p>
      </section>

      {/* Tabs */}
      <div className="profile-tabs">
        {["overview","progress","attendance","sessions"].map(t => (
          <button
            key={t}
            className={`ptab-btn ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t === "overview" ? "👤 Overview"
              : t === "progress" ? "📈 Progress"
              : t === "attendance" ? "✅ Attendance"
              : "🎓 Sessions"}
          </button>
        ))}
      </div>

      <div className="profile-body">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <div className="overview-grid">
              <div className="info-card">
                <h2>🎒 Student Information</h2>
                <div className="info-grid">
                  <div><strong>Student ID</strong><p>{student.studentId}</p></div>
                  <div><strong>Full Name</strong><p>{student.name}</p></div>
                  <div><strong>Date of Birth</strong><p>{new Date(student.dateOfBirth).toLocaleDateString("en-LK")}</p></div>
                  <div><strong>Enrolled</strong><p>{new Date(student.enrolledDate).toLocaleDateString("en-LK")}</p></div>
                  <div><strong>Status</strong><p>
                    <span className={`pill ${student.status === "Active" ? "pill-green" : "pill-red"}`}>{student.status}</span>
                  </p></div>
                  <div className="full"><strong>Address</strong><p>{student.address}</p></div>
                </div>
              </div>

              <div className="info-card">
                <h2>👨‍👩‍👧 Parent / Guardian</h2>
                <div className="info-grid">
                  <div><strong>Name</strong><p>{student.parentName}</p></div>
                  <div><strong>Email</strong><p>{student.parentEmail}</p></div>
                  <div><strong>Phone</strong><p>{student.parentPhone}</p></div>
                </div>
              </div>

              <div className="stat-card" style={{ borderTop:"4px solid #4facfe" }}>
                <span className="stat-ico">✅</span>
                <p className="stat-val">{attStats.total > 0 ? `${attPct}%` : "—"}</p>
                <p className="stat-lbl">Attendance Rate</p>
              </div>
              <div className="stat-card" style={{ borderTop:"4px solid #ff7eb3" }}>
                <span className="stat-ico">📚</span>
                <p className="stat-val">{loadingProgress ? "..." : progress.length}</p>
                <p className="stat-lbl">Progress Records</p>
              </div>
              <div className="stat-card" style={{ borderTop:"4px solid #34d399" }}>
                <span className="stat-ico">⭐</span>
                <p className="stat-val">{avgGP}</p>
                <p className="stat-lbl">Average GPA</p>
              </div>
              <div className="stat-card" style={{ borderTop:"4px solid #a78bfa" }}>
                <span className="stat-ico">🎓</span>
                <p className="stat-val">{sessions.length}</p>
                <p className="stat-lbl">Sessions Available</p>
              </div>
            </div>

            <div className="ql-grid" style={{ marginTop: 8 }}>
              <div className="ql-btn" onClick={() => navigate("/events")}>📅 View Events</div>
              <div className="ql-btn" onClick={() => navigate("/interactive-sessions")}>🎓 Enrol Sessions</div>
              <div className="ql-btn" onClick={() => navigate("/feedback")}>💬 Send Feedback</div>
              <div className="ql-btn logout" onClick={() => { logout(); navigate("/"); }}>🚪 Logout</div>
            </div>
          </div>
        )}

        {/* ── PROGRESS ── */}
        {activeTab === "progress" && (
          <div className="tab-content">
            <h2 className="section-title">📈 Academic Progress</h2>
            {loadingProgress ? (
              <p className="loading-msg">⏳ Loading progress records...</p>
            ) : progress.length === 0 ? (
              <div className="empty-card">
                <p>📋 No progress records yet.</p>
                <p>The school will add progress reports here once they are available.</p>
              </div>
            ) : (
              <div className="progress-grid">
                {progress.map((r, i) => (
                  <div key={i} className="prog-card">
                    <div className="prog-top">
                      <div>
                        <div className="subj-tag" style={{ background: subjectColors[r.subject]||"#aaa" }}>
                          {r.subject}
                        </div>
                      </div>
                      <div className="grade-circle" style={{ background: gradeColors[r.grade]||"#aaa" }}>
                        {r.grade}
                      </div>
                    </div>
                    <p className="prog-date">📅 {new Date(r.date).toLocaleDateString("en-LK")}</p>
                    <p className="prog-desc">{r.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ATTENDANCE ── */}
        {activeTab === "attendance" && (
          <div className="tab-content">
            <h2 className="section-title">✅ Attendance Summary</h2>
            {loadingAtt ? (
              <p className="loading-msg">⏳ Loading attendance records...</p>
            ) : attStats.total === 0 ? (
              <div className="empty-card">
                <p>📋 No attendance records yet.</p>
                <p>Attendance will appear here once the school starts marking daily attendance.</p>
              </div>
            ) : (
              <>
                <div className="att-stats">
                  <div className="att-stat green"><p className="att-num">{attStats.present}</p><p>Present</p></div>
                  <div className="att-stat red">  <p className="att-num">{attStats.absent}</p> <p>Absent</p></div>
                  <div className="att-stat amber"><p className="att-num">{attStats.late}</p>   <p>Late</p></div>
                  <div className="att-stat blue"> <p className="att-num">{attStats.total}</p>  <p>Total Days</p></div>
                </div>
                <div className="att-bar-section">
                  <div className="att-bar-label">
                    <span>Attendance Rate</span>
                    <strong>{attPct}%</strong>
                  </div>
                  <div className="att-bar-wrap">
                    <div className="att-bar-fill" style={{
                      width: `${attPct}%`,
                      background: attPct >= 90
                        ? "linear-gradient(90deg,#34d399,#059669)"
                        : attPct >= 75
                        ? "linear-gradient(90deg,#4facfe,#3b82f6)"
                        : "linear-gradient(90deg,#f87171,#dc2626)",
                    }}/>
                  </div>
                  <p className="att-note">
                    {attPct >= 90 ? "🌟 Excellent attendance! Keep it up."
                      : attPct >= 75 ? "👍 Good attendance. Aim for 90%+."
                      : "⚠️ Attendance needs improvement. Please contact the school."}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SESSIONS ── */}
        {activeTab === "sessions" && (
          <div className="tab-content">
            <h2 className="section-title">🎓 Upcoming Sessions</h2>
            {sessions.length === 0 ? (
              <div className="empty-card">
                <p>📋 No sessions available yet.</p>
                <p>Check back soon for upcoming interactive learning sessions.</p>
              </div>
            ) : (
              <>
                <div className="sess-list">
                  {sessions.slice(0, 6).map((s, i) => (
                    <div key={i} className="sess-row">
                      <div className="sess-subj-dot" style={{ background: subjectColors[s.subject]||"#aaa" }}/>
                      <div className="sess-info">
                        <p className="sess-title">{s.title}</p>
                        <p className="sess-meta">
                          👩‍🏫 {s.teacher} &nbsp;·&nbsp;
                          📅 {new Date(s.date).toLocaleDateString("en-LK")} &nbsp;·&nbsp;
                          ⏰ {s.time}
                        </p>
                      </div>
                      <span className="sess-subj-tag" style={{ background: subjectColors[s.subject]||"#aaa" }}>
                        {s.subject}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="enrol-link" onClick={() => navigate("/interactive-sessions")}>
                  View All Sessions & Enrol →
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
      <style>{sharedStyles}</style>
    </div>
  );
};

// ─── Shared styles ─────────────────────────────────────────────────────────
const sharedStyles = `
  .profile-hero { padding:70px 20px 50px; text-align:center; background:linear-gradient(135deg,#e0f0ff,#ffe0f0); }
  .profile-avatar { font-size:72px; margin-bottom:16px; }
  .profile-hero h1 { font-size:34px; color:#ff4fa3; font-weight:700; margin-bottom:10px; }
  .profile-role-tag { display:inline-block; background:white; padding:6px 20px; border-radius:20px; font-weight:600; color:#555; font-size:14px; box-shadow:0 2px 10px rgba(0,0,0,0.08); margin-bottom:8px; }
  .profile-parent-tag { color:#888; font-size:14px; margin-top:6px; }
  .status-active { color:#16a34a; font-weight:700; }
  .status-inactive { color:#dc2626; font-weight:700; }

  .profile-tabs { display:flex; background:white; border-bottom:2px solid #eee; position:sticky; top:72px; z-index:100; overflow-x:auto; padding:0 30px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
  .ptab-btn { padding:16px 24px; border:none; background:transparent; font-weight:600; font-size:14px; color:#888; cursor:pointer; border-bottom:3px solid transparent; white-space:nowrap; transition:all 0.2s; margin-bottom:-2px; }
  .ptab-btn.active { color:#ff4fa3; border-bottom-color:#ff4fa3; }
  .ptab-btn:hover { color:#ff4fa3; }

  .profile-body { padding:40px 30px; background:#f5f7fb; min-height:400px; }
  .tab-content { max-width:1100px; margin:0 auto; }

  .loading-screen { text-align:center; padding:100px; font-size:20px; color:#888; }
  .loading-msg { color:#888; font-size:16px; padding:40px 0; text-align:center; }

  .no-student-card { background:white; border-radius:20px; padding:50px 40px; text-align:center; box-shadow:0 6px 24px rgba(0,0,0,0.08); }
  .no-student-icon { font-size:60px; display:block; margin-bottom:20px; }
  .no-student-card h2 { font-size:24px; color:#ff4fa3; margin-bottom:16px; }
  .no-student-card p { color:#666; font-size:15px; line-height:1.7; margin-bottom:10px; }

  .overview-grid { display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-bottom:24px; }
  .info-card { background:white; border-radius:18px; padding:26px; box-shadow:0 4px 16px rgba(0,0,0,0.07); }
  .info-card h2 { font-size:18px; color:#ff4fa3; margin-bottom:18px; font-weight:700; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .info-grid .full { grid-column:1/-1; }
  .info-grid strong { display:block; font-size:11px; color:#aaa; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px; }
  .info-grid p { font-size:15px; color:#333; margin:0; }
  .pill { padding:3px 12px; border-radius:20px; font-size:12px; font-weight:700; }
  .pill-green { background:#dcfce7; color:#16a34a; }
  .pill-red { background:#fee2e2; color:#dc2626; }

  .stat-card { background:white; border-radius:16px; padding:22px; box-shadow:0 4px 14px rgba(0,0,0,0.07); text-align:center; display:flex; flex-direction:column; align-items:center; gap:6px; transition:transform 0.2s; }
  .stat-card:hover { transform:translateY(-4px); }
  .stat-ico { font-size:28px; } .stat-val { font-size:26px; font-weight:800; color:#333; } .stat-lbl { font-size:13px; color:#888; }

  .ql-grid { display:flex; gap:14px; flex-wrap:wrap; }
  .ql-btn { padding:13px 22px; border-radius:25px; background:linear-gradient(90deg,#4facfe,#ff7eb3); color:white; font-weight:700; font-size:14px; cursor:pointer; transition:all 0.2s; }
  .ql-btn:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(255,126,179,0.3); }
  .ql-btn.logout { background:white; color:#dc2626; border:2px solid #fca5a5; }
  .ql-btn.logout:hover { background:#fff0f0; }

  .section-title { font-size:22px; color:#ff4fa3; margin-bottom:24px; font-weight:700; }
  .empty-card { background:white; border-radius:16px; padding:50px 30px; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,0.07); }
  .empty-card p { color:#888; font-size:15px; line-height:1.8; }

  .progress-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px; }
  .prog-card { background:white; border-radius:16px; padding:22px; box-shadow:0 4px 14px rgba(0,0,0,0.07); transition:transform 0.2s; }
  .prog-card:hover { transform:translateY(-4px); }
  .prog-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
  .subj-tag { display:inline-block; padding:4px 14px; border-radius:20px; color:white; font-size:12px; font-weight:700; }
  .grade-circle { width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:15px; flex-shrink:0; }
  .prog-date { font-size:12px; color:#aaa; margin-bottom:8px; }
  .prog-desc { font-size:14px; color:#555; line-height:1.6; }

  .att-stats { display:flex; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
  .att-stat { flex:1; min-width:100px; background:white; border-radius:14px; padding:20px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.07); font-size:13px; color:#888; font-weight:600; }
  .att-stat.green{border-top:4px solid #34d399;} .att-stat.red{border-top:4px solid #f87171;} .att-stat.amber{border-top:4px solid #f59e0b;} .att-stat.blue{border-top:4px solid #4facfe;}
  .att-num { font-size:30px; font-weight:800; color:#333; margin-bottom:5px; }
  .att-bar-section { background:white; border-radius:16px; padding:28px; box-shadow:0 4px 14px rgba(0,0,0,0.07); }
  .att-bar-label { display:flex; justify-content:space-between; margin-bottom:12px; font-size:15px; color:#555; }
  .att-bar-label strong { color:#333; font-size:18px; }
  .att-bar-wrap { height:14px; background:#eee; border-radius:10px; overflow:hidden; margin-bottom:14px; }
  .att-bar-fill { height:100%; border-radius:10px; transition:width 0.6s ease; }
  .att-note { font-size:14px; color:#666; font-weight:500; }

  .sess-list { display:flex; flex-direction:column; gap:14px; margin-bottom:24px; }
  .sess-row { display:flex; align-items:center; gap:16px; background:white; border-radius:14px; padding:18px 22px; box-shadow:0 4px 12px rgba(0,0,0,0.07); transition:transform 0.2s; }
  .sess-row:hover { transform:translateX(6px); }
  .sess-subj-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; }
  .sess-info { flex:1; }
  .sess-title { font-size:15px; font-weight:700; color:#333; margin-bottom:4px; }
  .sess-meta { font-size:13px; color:#888; }
  .sess-subj-tag { padding:4px 12px; border-radius:20px; color:white; font-size:11px; font-weight:700; white-space:nowrap; }
  .enrol-link { display:inline-block; padding:13px 28px; border-radius:25px; border:none; background:linear-gradient(90deg,#4facfe,#ff7eb3); color:white; font-weight:700; font-size:15px; cursor:pointer; transition:all 0.2s; }
  .enrol-link:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(255,126,179,0.3); }

  @media(max-width:768px){
    .profile-body{padding:24px 16px;}
    .overview-grid{grid-template-columns:1fr;}
    .profile-tabs{padding:0 12px; top:60px;}
    .att-stats{gap:10px;}
  }
`;

// ─── Main export ────────────────────────────────────────────────────────────
const StudentProfile = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "teacher") return <TeacherView user={user} />;
  return <ParentView user={user} />;
};

export default StudentProfile;

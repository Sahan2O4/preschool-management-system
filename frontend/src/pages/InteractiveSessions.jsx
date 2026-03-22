import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { sessionAPI } from "../services/api";

const subjectColors = { English:"#4facfe", Mathematics:"#ff7eb3", "Arts & Crafts":"#f59e0b", Science:"#34d399", Music:"#a78bfa", "Physical Education":"#f87171" };

const InteractiveSessions = () => {
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [enrolledIds, setEnrolledIds] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await sessionAPI.getAll();
        setSessions(data);
      } catch (err) {
        setError("Could not load sessions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleEnrol = (id, spots, enrolled) => {
    if (enrolled >= spots) return;
    setEnrolledIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <Navbar currentPage="Interactive Sessions" mode="public" />

      <section className="sess-hero">
        <h1>🎓 Interactive Learning Sessions</h1>
        <p>Enrol your child in our engaging Montessori learning sessions</p>
      </section>

      <section className="sess-body">
        {loading && <div className="state-box">⏳ Loading sessions...</div>}
        {error   && <div className="state-box error">{error}</div>}

        {!loading && !error && (
          <div className="sess-grid">
            {sessions.length === 0 ? (
              <div className="state-box">No sessions available right now. Check back soon!</div>
            ) : sessions.map(s => {
              const isFull    = s.enrolled >= s.spots;
              const isEnrolled = enrolledIds.includes(s._id);
              const spotsLeft  = s.spots - s.enrolled;
              const pct = Math.round((s.enrolled / s.spots) * 100);

              return (
                <div key={s._id} className={`sess-card ${isFull ? "full" : ""}`}>
                  <div className="sess-subject" style={{ background: subjectColors[s.subject] || "#aaa" }}>{s.subject}</div>
                  <h3>{s.title}</h3>
                  <p className="sess-teacher">👩‍🏫 {s.teacher}</p>
                  <p className="sess-meta">📅 {new Date(s.date).toLocaleDateString("en-LK", { weekday:"short", month:"short", day:"numeric" })} &nbsp; ⏰ {s.time} &nbsp; ⏱ {s.duration} min</p>
                  <p className="sess-meta">🎯 {s.level}</p>
                  <p className="sess-desc">{s.description}</p>
                  <div className="prog-wrap">
                    <div className="prog-fill" style={{ width:`${pct}%`, background: isFull ? "#f87171" : "linear-gradient(90deg,#4facfe,#ff7eb3)" }} />
                  </div>
                  <p className="spots-txt">{isFull ? "🔴 Session Full" : `🟢 ${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}</p>
                  <button
                    className={`enroll-btn ${isEnrolled ? "enrolled" : ""} ${isFull && !isEnrolled ? "disabled" : ""}`}
                    onClick={() => handleEnrol(s._id, s.spots, s.enrolled)}
                    disabled={isFull && !isEnrolled}
                  >
                    {isEnrolled ? "✓ Enrolled — Click to Cancel" : isFull ? "Session Full" : "Enrol Now"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />

      <style>{`
        .sess-hero { padding:80px 20px; text-align:center; background:linear-gradient(135deg,#f4f9ff,#ffe0f0); }
        .sess-hero h1 { font-size:42px; color:#ff4fa3; margin-bottom:14px; }
        .sess-hero p  { font-size:18px; color:#555; }
        .sess-body    { padding:60px 40px; background:#f8f8f8; }
        .sess-grid    { display:flex; flex-wrap:wrap; gap:26px; justify-content:center; }
        .sess-card    { background:white; border-radius:18px; padding:26px; width:340px; box-shadow:0 6px 22px rgba(0,0,0,0.09); transition:transform 0.3s; display:flex; flex-direction:column; gap:8px; }
        .sess-card:hover { transform:translateY(-6px); }
        .sess-card.full  { opacity:0.85; }
        .sess-subject { display:inline-block; padding:4px 14px; border-radius:20px; color:white; font-size:12px; font-weight:700; width:fit-content; }
        .sess-card h3 { font-size:18px; color:#333; font-weight:700; }
        .sess-teacher { font-size:13px; color:#ff4fa3; font-weight:600; }
        .sess-meta    { font-size:13px; color:#777; }
        .sess-desc    { font-size:14px; color:#555; line-height:1.6; }
        .prog-wrap    { height:8px; background:#eee; border-radius:10px; overflow:hidden; margin-top:4px; }
        .prog-fill    { height:100%; border-radius:10px; transition:width 0.4s; }
        .spots-txt    { font-size:12px; font-weight:600; color:#666; }
        .enroll-btn   { margin-top:auto; padding:12px; border-radius:25px; border:none; background:linear-gradient(90deg,#4facfe,#ff7eb3); color:white; font-weight:700; cursor:pointer; font-size:14px; transition:all 0.2s; }
        .enroll-btn.enrolled { background:linear-gradient(90deg,#34d399,#059669); }
        .enroll-btn.disabled { background:#ddd; color:#aaa; cursor:not-allowed; }
        .enroll-btn:hover:not(.disabled) { transform:translateY(-2px); }
        .state-box    { text-align:center; padding:60px; color:#888; font-size:17px; width:100%; background:white; border-radius:16px; }
        .state-box.error { color:#dc2626; background:#fff0f0; }
        @media(max-width:768px){ .sess-body{padding:40px 20px;} .sess-card{width:90%;} }
      `}</style>
    </div>
  );
};

export default InteractiveSessions;

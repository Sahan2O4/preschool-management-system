import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { eventAPI } from "../services/api";

const categoryColors = { Sports:"#4facfe", Arts:"#ff7eb3", Academic:"#a78bfa", Cultural:"#34d399", Other:"#f59e0b" };
const categories = ["All", "Sports", "Arts", "Academic", "Cultural", "Other"];

const Events = () => {
  const [events, setEvents]   = useState([]);
  const [filter, setFilter]   = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventAPI.getAll();
        setEvents(data);
      } catch (err) {
        setError("Could not load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = filter === "All" ? events : events.filter(e => e.category === filter);

  return (
    <div>
      <Navbar currentPage="Events" mode="public" />

      <section className="events-hero">
        <h1>🎉 Upcoming Events</h1>
        <p>Stay up to date with all the exciting activities at Merry Kids International</p>
      </section>

      <section className="events-body">
        {/* Filter buttons */}
        <div className="filter-row">
          {categories.map(c => (
            <button key={c} className={`filter-btn ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>

        {loading && <div className="state-box">⏳ Loading events...</div>}
        {error   && <div className="state-box error">{error}</div>}

        {!loading && !error && (
          <div className="events-grid">
            {filtered.length === 0 ? (
              <div className="state-box">No events found{filter !== "All" ? ` in "${filter}"` : ""}.</div>
            ) : filtered.map(ev => (
              <div key={ev._id} className="event-card">
                <div className="event-cat" style={{ background: categoryColors[ev.category] || "#aaa" }}>{ev.category}</div>
                <h3>{ev.title}</h3>
                <p className="event-meta">📅 {new Date(ev.date).toLocaleDateString("en-LK", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
                <p className="event-meta">⏰ {ev.time} &nbsp;&nbsp; 📍 {ev.location}</p>
                <p className="event-meta">👤 {ev.organizer}</p>
                <p className="event-desc">{ev.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />

      <style>{`
        .events-hero { padding:80px 20px; text-align:center; background:linear-gradient(135deg,#f4f9ff,#ffe0f0); }
        .events-hero h1 { font-size:44px; color:#ff4fa3; margin-bottom:14px; }
        .events-hero p  { font-size:18px; color:#555; }
        .events-body { padding:60px 40px; background:#f8f8f8; }
        .filter-row  { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-bottom:36px; }
        .filter-btn  { padding:10px 24px; border-radius:25px; border:2px solid #ff4fa3; background:white; color:#ff4fa3; font-weight:600; cursor:pointer; transition:all 0.2s; font-size:14px; }
        .filter-btn.active, .filter-btn:hover { background:linear-gradient(90deg,#4facfe,#ff7eb3); color:white; border-color:transparent; }
        .events-grid { display:flex; flex-wrap:wrap; gap:26px; justify-content:center; }
        .event-card  { background:white; border-radius:18px; padding:26px; width:340px; box-shadow:0 6px 22px rgba(0,0,0,0.09); transition:transform 0.3s; display:flex; flex-direction:column; gap:8px; }
        .event-card:hover { transform:translateY(-8px); }
        .event-cat   { display:inline-block; padding:4px 14px; border-radius:20px; color:white; font-size:12px; font-weight:700; width:fit-content; }
        .event-card h3 { font-size:19px; color:#333; font-weight:700; }
        .event-meta  { font-size:13px; color:#777; }
        .event-desc  { font-size:14px; color:#555; line-height:1.6; }
        .state-box   { text-align:center; padding:60px; color:#888; font-size:17px; width:100%; background:white; border-radius:16px; }
        .state-box.error { color:#dc2626; background:#fff0f0; }
        @media(max-width:768px){ .events-body{padding:40px 20px;} .event-card{width:90%;} }
      `}</style>
    </div>
  );
};

export default Events;

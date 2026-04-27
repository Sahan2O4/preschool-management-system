import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import director from "../assets/director.jpeg";
import slide1 from "../assets/about1.jpeg";
import slide2 from "../assets/about2.jpeg";

const AboutUs = () => {
  const slideshowImages = [slide1, slide2];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="about-page">
      <Navbar currentPage="About Us" mode="public" />

      {/* ── MISSION HERO ─────────────────────────── */}
      <section className="mission">
        {/* bubbles matching homepage */}
        <div className="bubble b1" />
        <div className="bubble b2" />
        <div className="bubble b3" />
        <div className="bubble b4" />

        <div className="mission-inner">
          <div className="section-tag">🌸 Our Purpose</div>
          <h1>Our Mission</h1>
          <div className="mission-divider" />
          <p>
            Our mission is to improve the fluency in English of kids, to build intelligent &amp;
            well-mannered children with kind hearts, who make society better in the future and
            take their first step into society in a meaningful way.
          </p>
        </div>

        {/* wavy bottom */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── MANAGING DIRECTOR ────────────────────── */}
      <section className="director-section">
        <div className="section-tag">👑 Leadership</div>
        <h2>Managing Director</h2>
        <div className="director-container">
          <div className="director-img-wrap">
            <img src={director} alt="Managing Director" className="director-img" />
            <div className="director-img-border" />
            <div className="director-tag">Managing Director</div>
          </div>
          <div className="director-text">
            <h3>Mr. Mahinda Kariyawasam</h3>
            <div className="director-accent-line" />
            <p>
              Mr. Mahinda Kariyawasam is the Managing Director of Merry Kids International
              Montessori School, a leading Montessori preschool in the Southern Province
              of Sri Lanka known for its English-medium AMI-based early childhood education.
            </p>
            <p>
              Under his leadership, the school established in 2002 has grown from a small
              group of students into a committed learning community focused on nurturing
              young children's intellectual, social, and emotional development in a safe,
              supportive environment.
            </p>
            {/* stat bubbles matching homepage stats-strip */}
            <div className="director-stats">
              <div className="dir-stat-bubble">
                <span className="dir-emoji">🏫</span>
                <span className="dir-stat-num">2002</span>
                <span className="dir-stat-lbl">Founded</span>
              </div>
              <div className="dir-stat-bubble">
                <span className="dir-emoji">⭐</span>
                <span className="dir-stat-num">20+</span>
                <span className="dir-stat-lbl">Years Leading</span>
              </div>
              <div className="dir-stat-bubble">
                <span className="dir-emoji">🎓</span>
                <span className="dir-stat-num">AMI</span>
                <span className="dir-stat-lbl">Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────── */}
      <div className="wave-divider-down">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,0 C480,60 960,0 1440,0 L1440,60 L0,60 Z" fill="#f4f9ff" />
        </svg>
      </div>

      {/* ── STAFF ────────────────────────────────── */}
      <section className="staff-section">
        <div className="section-tag">👩‍🏫 The Team</div>
        <h2>Our Academic Team</h2>
        <div className="staff-list">
          {/* Head teacher — big card */}
          <div className="staff-card head-card">
            <div className="staff-avatar-wrap head-avatar">👑</div>
            <div>
              <p className="staff-role">Teacher-in-Charge</p>
              <p className="staff-name">Mrs. Sumithra Sajeewanee</p>
            </div>
          </div>

          {/* Teacher grid — matching homepage card hover style */}
          <div className="staff-grid">
            {[
              { name: "Mrs. Rasika Dulmini",      subject: "English",       emoji: "📖" },
              { name: "Miss Nirusha Subhashinie",  subject: "Mathematics",   emoji: "🔢" },
              { name: "Mrs. Lasanthi Lakmali",     subject: "Arts & Crafts", emoji: "🎨" },
              { name: "Mrs. Diana Lakmali",        subject: "English Drama", emoji: "🎭" },
              { name: "Mrs. Thushari Samanthika",  subject: "Science",       emoji: "🔬" },
            ].map((t, i) => (
              <div key={i} className="staff-card teacher-card">
                <div className="staff-avatar-wrap">{t.emoji}</div>
                <div>
                  <p className="staff-role">{t.subject}</p>
                  <p className="staff-name">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────── */}
      <div className="wave-divider-up">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,60 C480,0 960,60 1440,60 L1440,0 L0,0 Z" fill="#f4f9ff" />
        </svg>
      </div>

      {/* ── FACILITIES ───────────────────────────── */}
      <section className="facilities">
        <div className="section-tag">✨ What We Offer</div>
        <h2>Our Facilities</h2>
        <div className="facilities-grid">
          {[
            {
              icon: "🏛️", title: "Auditorium",
              text: "We provide your child luxurious and comfortable facilities, along with a nurturing environment. Our auditorium allows children to perform their talents.",
              color: "#e0f4ff", accent: "#4facfe",
            },
            {
              icon: "🛝", title: "Playground",
              text: "Our playground encourages playful learning and exploration, giving children space to grow, move, and develop physically.",
              color: "#f0fff4", accent: "#34d399",
            },
            {
              icon: "🛡️", title: "Safe Environment",
              text: "We guarantee a safe and supportive environment where every child feels protected and inspired to learn every day.",
              color: "#fff0f8", accent: "#ff7eb3",
            },
          ].map((f, i) => (
            <div key={i} className="fac-card" style={{ "--accent": f.accent, "--bg": f.color }}>
              <div className="fac-icon-wrap">
                <span className="fac-icon">{f.icon}</span>
              </div>
              <div className="fac-top-bar" style={{ background: f.accent }} />
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SLIDESHOW ────────────────────────────── */}
      <section className="about-slideshow">
        <div className="section-tag">📸 Gallery</div>
        <h2>Our Staff</h2>
        <div className="slideshow-frame">
          <div className="slideshow">
            {slideshowImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="School"
                className={index === currentSlide ? "active" : ""}
              />
            ))}
            <div className="slide-overlay-grad" />
            <button className="prev" onClick={() => setCurrentSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length)}>&#10094;</button>
            <button className="next" onClick={() => setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)}>&#10095;</button>
            <div className="slide-dots">
              {slideshowImages.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .about-page { font-family: "Segoe UI", sans-serif; overflow-x: hidden; }

        /* ── SECTION TAG (matches homepage section-tag) ── */
        .section-tag {
          display: inline-block;
          background: linear-gradient(90deg, rgba(79,172,254,0.12), rgba(255,126,179,0.12));
          border: 1px solid rgba(255,79,163,0.2);
          color: #ff4fa3;
          font-size: 13px; font-weight: 700;
          letter-spacing: 1px;
          padding: 6px 18px; border-radius: 20px;
          margin-bottom: 16px;
        }

        /* ── MISSION ── */
        .mission {
          position: relative; overflow: hidden;
          padding: 110px 20px 130px;
          text-align: center;
          background: linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(255,79,163,0.3) 100%),
                      linear-gradient(135deg, #4facfe 0%, #ff7eb3 100%);
        }

        /* bubbles — same as homepage */
        .bubble {
          position: absolute; border-radius: 50%;
          opacity: 0.18; pointer-events: none;
          animation: floatBubble 6s ease-in-out infinite alternate;
        }
        .b1 { width:180px; height:180px; background:#4facfe; top:-60px; left:-40px; animation-delay:0s; }
        .b2 { width:120px; height:120px; background:#ff7eb3; top:30px; right:60px; animation-delay:1s; }
        .b3 { width:90px;  height:90px;  background:#ffd6a5; bottom:80px; left:120px; animation-delay:2s; }
        .b4 { width:140px; height:140px; background:#a5f3fc; bottom:40px; right:20px; animation-delay:0.5s; }
        @keyframes floatBubble {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-20px) scale(1.08); }
        }

        .mission-inner {
          position: relative; z-index: 1;
          max-width: 820px; margin: auto;
        }
        .mission h1 {
          font-size: clamp(36px, 6vw, 62px);
          color: white; font-weight: 800;
          margin-bottom: 22px;
          text-shadow: 0 3px 14px rgba(0,0,0,0.25);
          line-height: 1.2;
        }
        .mission-divider {
          width: 70px; height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.6);
          margin: 0 auto 26px;
        }
        .mission p {
          max-width: 820px; margin: auto;
          font-size: 19px; line-height: 1.85;
          color: rgba(255,255,255,0.92); font-weight: 500;
        }
        /* override section-tag colour inside mission */
        .mission .section-tag {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.4);
          color: white;
        }

        .hero-wave {
          position: absolute; bottom: -2px; left: 0; width: 100%;
        }
        .hero-wave svg { display: block; width: 100%; height: 60px; }

        /* ── DIRECTOR ── */
        .director-section {
          padding: 90px 40px;
          background: white;
          text-align: center;
        }
        .director-section h2 {
          font-size: clamp(26px, 4vw, 38px);
          color: #ff4fa3; margin-bottom: 54px;
          font-weight: 800;
        }
        .director-container {
          display: flex; flex-wrap: wrap;
          justify-content: center; align-items: center;
          gap: 54px; text-align: left;
          max-width: 1100px; margin: auto;
        }
        .director-img-wrap { position: relative; flex-shrink: 0; }
        .director-img {
          width: 380px; height: 290px;
          object-fit: cover; border-radius: 24px; display: block;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          transition: transform 0.4s ease;
          position: relative; z-index: 1;
        }
        .director-img:hover { transform: translateY(-10px); }
        .director-img-border {
          position: absolute; top: 14px; left: 14px;
          width: 380px; height: 290px;
          border: 3px solid transparent; border-radius: 24px;
          background: linear-gradient(135deg,#4facfe,#ff7eb3) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude; z-index: 0;
        }
        .director-tag {
          position: absolute; bottom: -16px; left: 24px; z-index: 2;
          background: linear-gradient(90deg,#4facfe,#ff7eb3);
          color: white; font-weight: 700; font-size: 13px;
          padding: 8px 20px; border-radius: 20px;
          box-shadow: 0 6px 20px rgba(255,79,163,0.35);
        }
        .director-text { max-width: 540px; }
        .director-text h3 {
          font-size: 26px; color: #ff4fa3;
          margin-bottom: 12px; font-weight: 800;
        }
        .director-accent-line {
          width: 50px; height: 3px; border-radius: 2px;
          background: linear-gradient(90deg,#4facfe,#ff7eb3);
          margin-bottom: 20px;
        }
        .director-text p {
          font-size: 16px; line-height: 1.8; color: #666;
          margin-bottom: 14px; font-weight: 500;
        }

        /* stat bubbles — match homepage stat-bubble */
        .director-stats {
          display: flex; gap: 14px; flex-wrap: wrap; margin-top: 26px;
        }
        .dir-stat-bubble {
          background: white;
          border-radius: 18px;
          padding: 16px 22px;
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          flex: 1; min-width: 90px;
          transition: transform 0.25s; border: 1px solid #eee;
        }
        .dir-stat-bubble:hover { transform: translateY(-5px); }
        .dir-emoji  { font-size: 22px; }
        .dir-stat-num {
          font-size: 20px; font-weight: 800; color: #ff4fa3;
        }
        .dir-stat-lbl { font-size: 12px; color: #888; font-weight: 600; }

        /* ── WAVE DIVIDERS ── */
        .wave-divider-down svg,
        .wave-divider-up svg {
          display: block; width: 100%; height: 50px;
          background: white;
        }

        /* ── STAFF ── */
        .staff-section {
          padding: 80px 40px;
          text-align: center;
          background: #f4f9ff;
        }
        .staff-section h2 {
          font-size: clamp(26px, 4vw, 38px);
          color: #ff4fa3; margin-bottom: 42px; font-weight: 800;
        }
        .staff-list { max-width: 900px; margin: auto; }

        .head-card {
          background: linear-gradient(135deg, #fff8fc, #f0f8ff);
          border: 2px solid rgba(255,79,163,0.18);
          margin-bottom: 22px;
          display: flex; align-items: center; gap: 20px;
          padding: 22px 28px; border-radius: 22px;
          box-shadow: 0 8px 28px rgba(255,79,163,0.1);
          transition: transform 0.3s; cursor: default;
        }
        .head-card:hover { transform: translateY(-5px); }

        .staff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .teacher-card {
          background: white; border: 2px solid transparent;
          display: flex; align-items: center; gap: 16px;
          padding: 18px 22px; border-radius: 20px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.07);
          transition: all 0.3s; text-align: left; cursor: default;
        }
        .teacher-card:hover {
          transform: translateY(-6px) rotate(-0.5deg);
          border-color: rgba(255,79,163,0.25);
          box-shadow: 0 14px 36px rgba(255,79,163,0.12);
        }
        .staff-avatar-wrap {
          font-size: 26px;
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #f0f8ff, #fff0f8);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 2px solid rgba(255,79,163,0.12);
        }
        .head-avatar {
          background: linear-gradient(135deg, #fff8e7, #fff0f8);
          font-size: 28px;
          border-color: rgba(255,79,163,0.2);
        }
        .staff-role { font-size: 12px; color: #ff4fa3; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 4px; }
        .staff-name { font-size: 15px; color: #333; font-weight: 700; }

        /* ── FACILITIES ── */
        .facilities {
          padding: 90px 40px;
          background: white;
          text-align: center;
        }
        .facilities h2 {
          font-size: clamp(26px, 4vw, 38px);
          color: #ff4fa3; margin-bottom: 46px; font-weight: 800;
        }
        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 26px; max-width: 1100px; margin: auto;
        }
        /* card matches homepage card style */
        .fac-card {
          border-radius: 24px; overflow: hidden;
          box-shadow: 0 8px 28px rgba(0,0,0,0.09);
          background: white;
          border: 2px solid transparent;
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: default;
        }
        .fac-card:hover {
          transform: translateY(-14px) rotate(-0.5deg);
          box-shadow: 0 22px 52px rgba(0,0,0,0.13);
          border-color: var(--accent);
        }
        .fac-icon-wrap {
          padding: 30px 20px 0;
          display: flex; justify-content: center;
        }
        .fac-icon {
          font-size: 52px;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
        }
        .fac-top-bar {
          height: 5px; border-radius: 0 0 4px 4px;
          margin: 20px 20px 0;
        }
        .fac-card h4 {
          font-size: 20px; color: #ff4fa3;
          margin: 14px 20px 10px; font-weight: 800;
        }
        .fac-card p {
          font-size: 15px; color: #666; line-height: 1.75;
          padding: 0 20px 28px;
        }

        /* ── SLIDESHOW ── */
        .about-slideshow {
          padding: 90px 20px;
          text-align: center;
          background: #f0f0f0;
        }
        .about-slideshow h2 {
          font-size: clamp(28px, 4vw, 42px);
          color: #ff4fa3; margin-bottom: 28px; font-weight: bold;
        }
        .slideshow-frame { display: flex; justify-content: center; }
        .slideshow {
          position: relative; width: 85%; max-width: 860px;
          height: 430px; overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 16px 50px rgba(255,79,163,0.18);
          border: 5px solid white;
        }
        .slideshow img {
          width: 100%; height: 100%; object-fit: cover;
          position: absolute; left: 0; top: 0;
          opacity: 0; transition: opacity 1.2s ease-in-out;
          border-radius: 22px;
        }
        .slideshow img.active { opacity: 1; }
        .slide-overlay-grad {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 55%);
          border-radius: 22px; pointer-events: none;
        }
        .prev, .next {
          position: absolute; top: 50%; z-index: 2;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(8px);
          border: 2px solid rgba(255,255,255,0.5);
          color: white; border-radius: 50%;
          width: 46px; height: 46px;
          cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s;
        }
        .prev:hover, .next:hover {
          background: rgba(255,255,255,0.42);
          transform: translateY(-50%) scale(1.1);
        }
        .prev { left: 16px; }
        .next { right: 16px; }
        .slide-dots {
          position: absolute; bottom: 16px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 2;
        }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.5); cursor: pointer;
          transition: all 0.3s;
        }
        .dot.active { background: white; width: 24px; border-radius: 4px; }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .mission { padding: 80px 20px 110px; }
          .mission h1 { font-size: 28px; }
          .mission p { font-size: 16px; }
          .director-section { padding: 70px 20px; }
          .director-container { flex-direction: column; align-items: center; text-align: center; gap: 50px; }
          .director-img-wrap { width: 100%; }
          .director-img { width: 100%; height: 240px; }
          .director-img-border { width: 100%; height: 240px; }
          .director-accent-line { margin: 0 auto 20px; }
          .director-stats { justify-content: center; }
          .staff-section { padding: 70px 20px; }
          .facilities { padding: 70px 20px; }
          .about-slideshow { padding: 70px 20px; }
          .slideshow { width: 95%; height: 260px; }
          .facilities-grid { grid-template-columns: 1fr; }
          .staff-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;

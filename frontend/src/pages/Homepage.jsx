import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import schoolImg from "../assets/school.jpeg";
import student1 from "../assets/student1.jpg";
import student2 from "../assets/student2.jpg";
import student3 from "../assets/student3.jpg";
import happy1 from "../assets/happy1.jpeg";
import happy2 from "../assets/happy2.jpeg";
import happy3 from "../assets/happy3.jpg";

const Homepage = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Safe Environment",
      text: "We provide a secure, loving, and caring environment where children feel protected and confident every day.",
      image: student1,
      emoji: "🛡️",
      color: "#e0f4ff",
      accent: "#4facfe",
    },
    {
      title: "Qualified Teachers",
      text: "Our trained and experienced teachers guide each child with patience, passion, and personal attention.",
      image: student2,
      emoji: "👩‍🏫",
      color: "#fff0f8",
      accent: "#ff7eb3",
    },
    {
      title: "Fun & Interactive Learning",
      text: "We combine fun activities with education to develop creativity, intelligence, and social skills.",
      image: student3,
      emoji: "🎨",
      color: "#f0fff4",
      accent: "#34d399",
    },
  ];

  const slideshowImages = [happy1, happy2, happy3];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="homepage">
      <Navbar currentPage="Home" mode="public" />

      {/* ── HERO ── */}
      <section className="hero">
        <img src={schoolImg} alt="school" className="hero-img" />
        <div className="overlay" />

        {/* floating bubbles decoration */}
        <div className="bubble b1" />
        <div className="bubble b2" />
        <div className="bubble b3" />
        <div className="bubble b4" />

        <div className="hero-text">
          <div className="hero-badge">✨ Welcome to Merry Kids International</div>
          <h1>Kids are beautiful little blossoms</h1>
          <p>They bloom and grow under the care, love, and guidance of Merry Kids International Montessori</p>
          <div className="hero-btns">
            <button className="hero-btn-primary" onClick={() => navigate("/about")}>Discover More 🌸</button>
            <button className="hero-btn-outline" onClick={() => navigate("/login")}>Parent Portal →</button>
          </div>
        </div>

        {/* wavy bottom */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f4f9ff" />
          </svg>
        </div>
      </section>

      {/* ── FUN STATS STRIP ── */}
      <section className="stats-strip">
        {[
          { emoji:"🏫", num:"20+", label:"Years of Joy" },
          { emoji:"👨‍👩‍👧", num:"200+", label:"Happy Families" },
          { emoji:"👩‍🏫", num:"7",   label:"Expert Teachers" },
          { emoji:"⭐", num:"100%", label:"Love & Care" },
        ].map((s, i) => (
          <div key={i} className="stat-bubble">
            <span className="stat-emoji">{s.emoji}</span>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── WHY US ── */}
      <section className="why-us">
        {/* decorative stars */}
        <span className="deco-star s1">⭐</span>
        <span className="deco-star s2">🌟</span>
        <span className="deco-star s3">✨</span>
        <h2>Why Choose Merry Kids?</h2>
        <p>
          We focus on building confident, creative, and happy children by providing
          a safe, nurturing, and engaging learning environment. Our goal is to help
          every child reach their full potential academically and socially.
        </p>
      </section>

      {/* ── CARDS ── */}
      <section className="cards">
        {cardData.map((card, idx) => (
          <div key={idx} className="card" style={{ "--accent": card.accent, "--bg": card.color }}>
            <div className="card-img-wrap">
              <img src={card.image} alt={card.title} />
              <div className="card-emoji-badge">{card.emoji}</div>
            </div>
            <div className="card-text">
              <div className="card-top-bar" style={{ background: card.accent }} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── WAVY DIVIDER ── */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#f8f9fa" />
        </svg>
      </div>

      {/* ── GOOGLE MAP ── */}
      <section className="map-section">
        <div className="section-tag">📍 Find Us</div>
        <h2>Visit Our School</h2>
        <div className="map-container">
          <iframe
            title="School Location"
            src="https://www.google.com/maps?q=Merry+Kids+International+Montessori+School,+Elpitiya,+Sri+Lanka&output=embed"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="map-address">
          🏠 Pituwala Road, Elpitiya, Sri Lanka &nbsp;|&nbsp; 📞 077 739 3040
        </div>
      </section>

      {/* ── SLIDESHOW ── */}
      <section className="slideshow-section">
        <div className="section-tag">📸 Gallery</div>
        <h2>Our Happy Moments</h2>
        <div className="slideshow-frame">
          <div className="slideshow">
            {slideshowImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`slide ${i + 1}`}
                className={`slide ${i === currentSlide ? "active" : ""}`}
              />
            ))}
            <div className="slide-gradient" />
            <button className="prev" onClick={prevSlide}>&#10094;</button>
            <button className="next" onClick={nextSlide}>&#10095;</button>
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
        .homepage { font-family: "Segoe UI", sans-serif; overflow-x: hidden; }

        /* ── HERO ─────────────────────────────── */
        .hero {
          position: relative;
          height: 540px;
          overflow: hidden;
        }
        .hero-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(255,79,163,0.25) 100%);
        }

        /* bubbles */
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

        .hero-text {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -55%);
          text-align: center; color: white;
          padding: 20px; max-width: 85%; width: 100%;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          padding: 7px 22px; font-size: 14px; font-weight: 600;
          margin-bottom: 18px; color: white;
        }
        .hero-text h1 {
          font-size: 42px; font-weight: bold; margin-bottom: 15px;
          text-shadow: 0 3px 12px rgba(0,0,0,0.3);
          line-height: 1.2;
        }
        .hero-text p {
          font-size: 20px; margin-top: 10px; opacity: 0.92;
          line-height: 1.6;
        }
        .hero-btns {
          display: flex; gap: 14px; justify-content: center;
          flex-wrap: wrap; margin-top: 28px;
        }
        .hero-btn-primary {
          padding: 13px 30px; border-radius: 50px; border: none;
          background: linear-gradient(90deg, #ff7eb3, #ff4fa3);
          color: white; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all 0.3s;
          box-shadow: 0 6px 20px rgba(255,79,163,0.4);
          font-family: "Segoe UI", sans-serif;
        }
        .hero-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(255,79,163,0.5); }
        .hero-btn-outline {
          padding: 13px 30px; border-radius: 50px;
          border: 2px solid rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(6px);
          color: white; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all 0.3s;
          font-family: "Segoe UI", sans-serif;
        }
        .hero-btn-outline:hover { background: rgba(255,255,255,0.25); transform: translateY(-3px); }

        .hero-wave {
          position: absolute; bottom: -2px; left: 0; width: 100%;
        }
        .hero-wave svg { display: block; width: 100%; height: 60px; }

        /* ── STATS STRIP ──────────────────────── */
        .stats-strip {
          background: #f4f9ff;
          padding: 36px 40px;
          display: flex; justify-content: center;
          gap: 20px; flex-wrap: wrap;
        }
        .stat-bubble {
          background: white;
          border-radius: 20px;
          padding: 20px 32px;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          min-width: 120px;
          transition: transform 0.25s;
        }
        .stat-bubble:hover { transform: translateY(-5px); }
        .stat-emoji { font-size: 28px; }
        .stat-num   { font-size: 26px; font-weight: 800; color: #ff4fa3; }
        .stat-label { font-size: 13px; color: #888; font-weight: 600; }

        /* ── WHY US ───────────────────────────── */
        .why-us {
          padding: 90px 20px;
          text-align: center;
          background: #f4f9ff;
          position: relative;
          overflow: hidden;
        }
        .deco-star {
          position: absolute;
          font-size: 48px;
          opacity: 0.15;
          animation: spinStar 8s linear infinite;
        }
        .s1 { top: 20px; left: 5%; animation-delay: 0s; }
        .s2 { top: 60px; right: 8%; animation-delay: 2s; }
        .s3 { bottom: 20px; left: 50%; animation-delay: 4s; }
        @keyframes spinStar {
          from { transform: rotate(0deg) scale(1); }
          to   { transform: rotate(360deg) scale(1.2); }
        }
        .why-us h2 { font-size: 36px; margin-bottom: 20px; color: #ff4fa3; }
        .why-us p  { font-size: 18px; max-width: 900px; margin: auto; line-height: 1.6; }

        /* ── CARDS ────────────────────────────── */
        .cards {
          padding: 20px 40px 80px;
          display: flex; justify-content: center;
          gap: 30px; flex-wrap: wrap;
          background: #f4f9ff;
        }
        .card {
          width: 320px; border-radius: 24px; overflow: hidden;
          box-shadow: 0 8px 28px rgba(0,0,0,0.1);
          background: white;
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          border: 2px solid transparent;
        }
        .card:hover {
          transform: translateY(-14px) rotate(-1deg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.14);
          border-color: var(--accent);
        }
        .card-img-wrap { position: relative; height: 210px; overflow: hidden; }
        .card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }
        .card:hover .card-img-wrap img { transform: scale(1.07); }
        .card-emoji-badge {
          position: absolute; bottom: 14px; right: 14px;
          background: white; border-radius: 50%;
          width: 46px; height: 46px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .card-top-bar { height: 5px; border-radius: 0 0 4px 4px; margin-bottom: 16px; }
        .card-text { padding: 0 20px 22px; }
        .card-text h3 { margin-bottom: 10px; font-size: 20px; color: #ff4fa3; }
        .card-text p  { font-size: 16px; line-height: 1.5; color: #555; }

        /* ── WAVE DIVIDER ─────────────────────── */
        .wave-divider svg { display: block; width: 100%; height: 50px; background: #f4f9ff; }

        /* ── MAP ──────────────────────────────── */
        .map-section {
          padding: 70px 20px;
          text-align: center;
          background: #f8f9fa;
        }
        .section-tag {
          display: inline-block;
          background: linear-gradient(90deg, rgba(79,172,254,0.12), rgba(255,126,179,0.12));
          border: 1px solid rgba(255,79,163,0.2);
          color: #ff4fa3; font-size: 13px; font-weight: 700;
          letter-spacing: 1px; padding: 6px 18px; border-radius: 20px;
          margin-bottom: 14px;
        }
        .map-section h2 { color: #ff4fa3; font-size: 42px; margin-bottom: 28px; font-weight: bold; }
        .map-container {
          width: 90%; max-width: 900px; margin: auto;
          height: 450px; border-radius: 24px; overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          border: 4px solid white;
        }
        .map-container iframe { width: 100%; height: 100%; border: 0; }
        .map-address {
          margin-top: 18px; font-size: 15px; color: #888; font-weight: 500;
        }

        /* ── SLIDESHOW ────────────────────────── */
        .slideshow-section {
          padding: 70px 20px;
          text-align: center;
          background: #f0f0f0;
        }
        .slideshow-section h2 { color: #ff4fa3; font-size: 42px; margin-bottom: 28px; font-weight: bold; }
        .slideshow-frame {
          display: flex; justify-content: center;
        }
        .slideshow {
          position: relative; width: 85%; max-width: 820px;
          height: 420px; overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 16px 50px rgba(255,79,163,0.18);
          border: 5px solid white;
        }
        .slideshow img {
          width: 100%; height: 100%; object-fit: cover;
          position: absolute; left: 0; top: 0;
          opacity: 0; transition: opacity 1s ease-in-out;
          border-radius: 22px;
        }
        .slideshow img.active { opacity: 1; }
        .slide-gradient {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%);
          border-radius: 22px; pointer-events: none;
        }
        .prev, .next {
          position: absolute; top: 50%; z-index: 2;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(8px);
          border: 2px solid rgba(255,255,255,0.5);
          color: white; border-radius: 50%;
          width: 44px; height: 44px;
          cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s;
        }
        .prev:hover, .next:hover { background: rgba(255,255,255,0.45); transform: translateY(-50%) scale(1.1); }
        .prev { left: 14px; }
        .next { right: 14px; }
        .slide-dots {
          position: absolute; bottom: 16px; left: 50%;
          transform: translateX(-50%); z-index: 2;
          display: flex; gap: 8px;
        }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.5); cursor: pointer;
          transition: all 0.3s;
        }
        .dot.active { background: white; width: 22px; border-radius: 4px; }

        /* ── MOBILE ───────────────────────────── */
        @media (max-width: 768px) {
          .hero { height: auto; min-height: 480px; }
          .hero-text { top: 48%; }
          .hero-text h1 { font-size: 28px; }
          .hero-text p  { font-size: 16px; }
          .hero-btns { flex-direction: column; align-items: center; gap: 12px; }
          .hero-btn-primary, .hero-btn-outline { width: 220px; text-align: center; }

          .stats-strip { padding: 28px 20px; gap: 14px; }
          .stat-bubble { padding: 16px 20px; min-width: 100px; }

          .cards { flex-direction: column; align-items: center; padding: 20px 20px 60px; }
          .card  { width: 92%; }
          .card:hover { transform: translateY(-8px) rotate(0deg); }

          .map-section h2 { font-size: 30px; }
          .map-container  { height: 260px; }
          .slideshow-section h2 { font-size: 30px; }
          .slideshow { width: 95%; height: 260px; }
        }
      `}</style>
    </div>
  );
};

export default Homepage;

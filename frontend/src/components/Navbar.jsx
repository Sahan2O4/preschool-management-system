import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

const Navbar = ({ currentPage, mode = "public" }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const publicNav = [
    { label: "Home",                 path: "/" },
    { label: "About Us",             path: "/about" },
    { label: "Events",               path: "/events" },
    { label: "Interactive Sessions", path: "/interactive-sessions" },
    { label: "Feedback",             path: "/feedback" },
  ];

  const adminNav = [
    { label: "Dashboard",  path: "/admin" },
    { label: "Students",   path: "/admin/students" },
    { label: "Attendance", path: "/admin/attendance" },
    { label: "Progress",   path: "/admin/progress" },
    { label: "Events",     path: "/admin/events" },
    { label: "Feedback",   path: "/admin/feedback" },
    { label: "Financial",  path: "/admin/financial" },
    { label: "Sessions",   path: "/admin/sessions" },
  ];

  const navItems = mode === "admin" ? adminNav : publicNav;

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Right-side button(s)
  const renderRight = () => {
    if (mode === "admin") {
      return (
        <div className="nav-right">
          <span className="nav-user">👤 {user?.name?.split(" ")[0]}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      );
    }
    if (user) {
      return (
        <div className="nav-right">
          <span className="nav-user">
            👤 {user.name?.split(" ")[0]}
            <span className="role-tag">{user.role}</span>
          </span>
          {user.role === "admin" || user.role === "teacher"
            ? <button className="login-btn" onClick={() => goTo("/admin")}>Dashboard</button>
            : <button className="login-btn" onClick={() => goTo("/profile")}>My Profile</button>
          }
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      );
    }
    return (
      <button className="login-btn" onClick={() => goTo("/login")}>
        Login / Register
      </button>
    );
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo-container" onClick={() => goTo("/")} style={{ cursor:"pointer" }}>
          <img src={logo} alt="logo" className="logo" />
          <h2>Merry Kids International</h2>
        </div>

        {/* Desktop nav links */}
        <div className="nav-links desktop-nav">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className={`nav-btn ${item.label === currentPage ? "active" : ""}`}
              onClick={() => goTo(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right section: desktop shows user/login, mobile shows hamburger */}
        <div className="nav-end">
          {/* Desktop right */}
          <div className="desktop-right">
            {renderRight()}
          </div>

          {/* Mobile hamburger — always on far right */}
          <div className="mobile-menu">
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? "✕" : "☰"}
            </button>

            {menuOpen && (
              <div className="mobile-dropdown">
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    className={`mobile-nav-btn ${item.label === currentPage ? "mobile-active" : ""}`}
                    onClick={() => goTo(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="mobile-divider" />
                {user ? (
                  <>
                    <div className="mobile-user-info">
                      👤 {user.name?.split(" ")[0]}
                      <span className="role-tag">{user.role}</span>
                    </div>
                    {user.role === "admin" || user.role === "teacher" ? (
                      <button className="mobile-nav-btn" onClick={() => goTo("/admin")}>📊 Dashboard</button>
                    ) : (
                      <button className="mobile-nav-btn" onClick={() => goTo("/profile")}>👤 My Profile</button>
                    )}
                    <button className="mobile-nav-btn mobile-logout" onClick={handleLogout}>🚪 Logout</button>
                  </>
                ) : (
                  <button className="mobile-nav-btn" onClick={() => goTo("/login")}>🔑 Login / Register</button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { font-family: "Segoe UI", sans-serif; }

        .navbar {
          background: linear-gradient(90deg, #4facfe, #ff7eb3);
          padding: 12px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          gap: 12px;
        }

        /* Logo */
        .logo-container { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .logo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid white; }
        .logo-container h2 { color: white; font-size: 18px; font-weight: 700; white-space: nowrap; }

        /* Desktop nav */
        .nav-links { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; justify-content: center; }
        .nav-btn {
          padding: 9px 16px; border-radius: 25px;
          border: 2px solid rgba(255,255,255,0.7);
          background: transparent; color: white;
          font-weight: 600; cursor: pointer; font-size: 13px;
          transition: all 0.25s; white-space: nowrap;
        }
        .nav-btn:hover, .nav-btn.active {
          background: white; color: #ff4fa3;
          border-color: white; transform: translateY(-2px);
        }

        /* Right end — wraps desktop buttons + hamburger */
        .nav-end {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* Desktop right */
        .desktop-right { display: flex; align-items: center; gap: 10px; }
        .nav-right { display: flex; align-items: center; gap: 10px; flex-wrap: nowrap; }
        .nav-user {
          color: white; font-weight: 600; font-size: 13px;
          display: flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .role-tag {
          background: rgba(255,255,255,0.22); border-radius: 20px;
          padding: 2px 8px; font-size: 11px; text-transform: capitalize;
        }
        .login-btn {
          padding: 9px 18px; border-radius: 25px; border: none;
          background: white; color: #ff4fa3; font-weight: 700;
          cursor: pointer; font-size: 13px; white-space: nowrap;
          transition: transform 0.2s;
        }
        .login-btn:hover { transform: translateY(-2px); }
        .logout-btn {
          padding: 9px 18px; border-radius: 25px;
          border: 2px solid rgba(255,255,255,0.7);
          background: transparent; color: white;
          font-weight: 600; cursor: pointer; font-size: 13px;
          white-space: nowrap; transition: all 0.2s;
        }
        .logout-btn:hover { background: white; color: #ff4fa3; border-color: white; }

        /* Mobile hamburger */
        .mobile-menu { display: none; position: relative; }
        .hamburger {
          font-size: 24px; color: white; background: rgba(255,255,255,0.15);
          border: 2px solid rgba(255,255,255,0.5); border-radius: 10px;
          width: 42px; height: 42px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .hamburger:hover { background: rgba(255,255,255,0.28); }

        /* Dropdown */
        .mobile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.18);
          display: flex; flex-direction: column;
          min-width: 210px; z-index: 2000;
          overflow: hidden;
          border: 1px solid rgba(255,79,163,0.1);
        }
        .mobile-nav-btn {
          padding: 13px 20px; border: none; background: transparent;
          cursor: pointer; text-align: left; font-weight: 600;
          color: #444; font-size: 14px; transition: background 0.15s;
          font-family: "Segoe UI", sans-serif;
        }
        .mobile-nav-btn:hover { background: #fff0f8; color: #ff4fa3; }
        .mobile-active { color: #ff4fa3; background: #fff8fc; }
        .mobile-divider { height: 1px; background: #f0f0f0; margin: 4px 0; }
        .mobile-user-info {
          padding: 10px 20px; font-size: 13px; color: #888;
          font-weight: 600; display: flex; align-items: center; gap: 8px;
        }
        .mobile-logout { color: #dc2626 !important; }
        .mobile-logout:hover { background: #fff0f0 !important; color: #dc2626 !important; }

        /* ── Breakpoint ── */
        @media (max-width: 960px) {
          .nav-links    { display: none; }
          .desktop-right { display: none; }
          .mobile-menu  { display: block; }
        }

        @media (max-width: 480px) {
          .navbar { padding: 10px 16px; }
          .logo-container h2 { font-size: 15px; }
          .logo { width: 40px; height: 40px; }
        }
      `}</style>
    </>
  );
};

export default Navbar;

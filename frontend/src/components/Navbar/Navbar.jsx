import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import logo from "../../assets/mk-logo.png"; // make sure this file exists

export default function Navbar({ role, setRole }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Students", path: "/students" },
    { name: "Events", path: "/events" },
    { name: "Financial", path: "/financial" },
    { name: "Feedback", path: "/feedback" },
  ];

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
        <h2>Merry Kids International</h2>
      </div>

      {/* Desktop Navigation */}
      <div className="nav-links desktop-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-btn ${isActive ? "active" : ""}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile Menu */}
      <div className="mobile-menu">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </button>

        {menuOpen && (
          <div className="mobile-dropdown">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="mobile-nav-btn"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Role Switch Button (Admin/User toggle) */}
      <button
        className="login-btn"
        onClick={() => setRole(role === "admin" ? "user" : "admin")}
      >
        {role === "admin" ? "Admin Mode" : "User Mode"}
      </button>
    </nav>
  );
}
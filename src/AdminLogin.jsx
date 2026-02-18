import React, { useState } from "react";

export default function AdminLogin({ setIsAdminLoggedIn }) {
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === "admin123") {
      setIsAdminLoggedIn(true);
    } else {
      alert("Incorrect Password");
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h2 className="title">Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

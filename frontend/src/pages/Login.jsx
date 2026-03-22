import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [tab, setTab]       = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [regData, setRegData]     = useState({
    name: "", email: "", phone: "", password: "", confirm: "", role: "parent",
  });

  // Already logged in → redirect
  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "teacher") navigate("/admin");
      else navigate("/profile");
    }
  }, [user, navigate]);

  // ── LOGIN ──────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    if (result.success) {
      if (result.role === "admin" || result.role === "teacher") navigate("/admin");
      else navigate("/profile");
    } else {
      setError(result.message || "Invalid email or password.");
    }
  };

  // ── REGISTER ───────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (regData.password !== regData.confirm) {
      setError("Passwords do not match."); return;
    }
    setLoading(true);
    const result = await register({
      name: regData.name, email: regData.email,
      phone: regData.phone, password: regData.password, role: regData.role,
    });
    setLoading(false);
    if (result.success) {
      setSuccess("✅ Account created! You can now log in.");
      setTimeout(() => { setTab("login"); setSuccess(""); setError(""); }, 2000);
    } else {
      setError(result.message || "Registration failed.");
    }
  };

  const switchTab = (t) => { setTab(t); setError(""); setSuccess(""); };

  return (
    <div>
      <Navbar currentPage="" mode="public" />

      <section className="login-hero">
        <h1>Welcome to Merry Kids 👋</h1>
        <p>Login or create an account to access the school portal</p>
      </section>

      <section className="auth-section">
        {/* Demo hint */}
        <div className="demo-panel">
          <h3>🔑 Demo Credentials</h3>
          <div className="demo-list">
            <div className="demo-item">
              <span className="demo-role admin-role">Admin</span>
              <div>
                <p><strong>admin@merrykids.lk</strong></p>
                <p className="demo-pass">admin123</p>
              </div>
            </div>
            <div className="demo-item">
              <span className="demo-role parent-role">Parent</span>
              <div>
                <p><strong>kumari@email.com</strong></p>
                <p className="demo-pass">parent123</p>
              </div>
            </div>
          </div>
          <p className="demo-note">Or register a new account using the Register tab.</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="tab-row">
            <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => switchTab("login")}>Login</button>
            <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => switchTab("register")}>Register</button>
          </div>

          {error   && <div className="msg-box error">{error}</div>}
          {success && <div className="msg-box success">{success}</div>}

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="your@email.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="••••••••"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login →"}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="Your full name"
                  value={regData.name}
                  onChange={e => setRegData({ ...regData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={regData.role} onChange={e => setRegData({ ...regData, role: e.target.value })}>
                  <option value="parent">Parent / Guardian</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="your@email.com"
                  value={regData.email}
                  onChange={e => setRegData({ ...regData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" required placeholder="07X XXX XXXX"
                  value={regData.phone}
                  onChange={e => setRegData({ ...regData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="••••••••"
                  value={regData.password}
                  onChange={e => setRegData({ ...regData, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" required placeholder="••••••••"
                  value={regData.confirm}
                  onChange={e => setRegData({ ...regData, confirm: e.target.value })} />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        .login-hero { padding:80px 20px; text-align:center; background:linear-gradient(135deg,#e0f0ff,#ffe0f0); }
        .login-hero h1 { font-size:42px; color:#ff4fa3; margin-bottom:14px; font-weight:700; }
        .login-hero p  { font-size:18px; color:#666; }

        .auth-section { padding:60px 30px; background:#f5f7fb; display:flex; gap:32px; justify-content:center; align-items:flex-start; flex-wrap:wrap; }

        .demo-panel { background:white; border-radius:20px; padding:28px; width:280px; box-shadow:0 6px 24px rgba(0,0,0,0.08); flex-shrink:0; }
        .demo-panel h3 { font-size:16px; color:#ff4fa3; margin-bottom:18px; font-weight:700; }
        .demo-list  { display:flex; flex-direction:column; gap:14px; }
        .demo-item  { display:flex; align-items:flex-start; gap:12px; padding:12px; background:#fafafa; border-radius:12px; border:1px solid #f0f0f0; }
        .demo-role  { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; flex-shrink:0; margin-top:2px; }
        .admin-role  { background:#fef3c7; color:#b45309; }
        .parent-role { background:#dcfce7; color:#15803d; }
        .demo-item p  { font-size:13px; color:#555; margin:0; line-height:1.5; }
        .demo-pass    { color:#aaa !important; font-family:monospace; font-size:12px !important; }
        .demo-note    { font-size:12px; color:#aaa; margin-top:16px; line-height:1.5; }

        .auth-card { background:white; border-radius:24px; box-shadow:0 8px 32px rgba(0,0,0,0.1); padding:40px; width:100%; max-width:460px; }
        .tab-row   { display:flex; border-radius:14px; overflow:hidden; border:2px solid #ff4fa3; margin-bottom:28px; }
        .tab-btn   { flex:1; padding:13px; border:none; background:white; color:#ff4fa3; font-weight:700; font-size:15px; cursor:pointer; transition:all 0.2s; }
        .tab-btn.active { background:linear-gradient(90deg,#4facfe,#ff7eb3); color:white; }

        .msg-box         { padding:13px 16px; border-radius:12px; font-weight:600; font-size:14px; margin-bottom:20px; text-align:center; }
        .msg-box.error   { background:#fff0f0; border:1px solid #fca5a5; color:#dc2626; }
        .msg-box.success { background:#f0fdf4; border:1px solid #86efac; color:#16a34a; }

        .auth-form { display:flex; flex-direction:column; gap:16px; }
        .form-group { display:flex; flex-direction:column; gap:7px; }
        .form-group label { font-weight:600; color:#444; font-size:13px; }
        .form-group input, .form-group select { padding:13px 16px; border-radius:12px; border:2px solid #eee; font-size:15px; outline:none; transition:border 0.2s; font-family:"Segoe UI",sans-serif; background:#fafafa; }
        .form-group input:focus, .form-group select:focus { border-color:#ff4fa3; background:white; }

        .submit-btn { margin-top:6px; padding:15px; border-radius:30px; border:none; background:linear-gradient(90deg,#4facfe,#ff7eb3); color:white; font-size:16px; font-weight:700; cursor:pointer; transition:all 0.25s; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 20px rgba(255,126,179,0.4); }
        .submit-btn:disabled { opacity:0.7; cursor:not-allowed; }

        @media(max-width:640px){ .auth-section{padding:30px 16px;} .demo-panel{width:100%;} .auth-card{padding:24px 18px;} }
      `}</style>
    </div>
  );
};

export default Login;

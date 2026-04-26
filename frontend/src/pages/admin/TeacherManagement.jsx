import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { authAPI } from "../../services/api";

const today = new Date().toISOString().split("T")[0];

const blank = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

const TeacherManagement = () => {
  const [teachers, setTeachers]   = useState([]);
  const [form, setForm]           = useState(blank);
  const [showForm, setShowForm]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteId, setDeleteId]   = useState(null);
  const [search, setSearch]       = useState("");

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getTeachers();
      setTeachers(data);
    } catch (err) {
      setError("Could not load teachers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3500); };
  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    if (!/^\d{10}$/.test(form.phone)) { setError("Phone must be exactly 10 digits."); return false; }
    if (!form.email.includes("@"))    { setError("Email must contain '@'."); return false; }
    if (form.password.length < 6)     { setError("Password must be at least 6 characters."); return false; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!validate()) return;
    setSaving(true);
    try {
      await authAPI.registerTeacher({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: "teacher" });
      flash("✅ Teacher registered successfully!");
      setForm(blank); setShowForm(false); fetchTeachers();
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await authAPI.deleteTeacher(id);
      flash("✅ Teacher removed.");
      setDeleteId(null); fetchTeachers();
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  const filtered = teachers.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Navbar currentPage="Teachers" mode="admin" />
      <div className="admin-body">

        <div className="page-header">
          <div>
            <h1>👩‍🏫 Teacher Management</h1>
            <p>Register and manage teacher accounts</p>
          </div>
          <button className="add-btn" onClick={() => { setShowForm(!showForm); setForm(blank); setError(""); }}>
            {showForm ? "✕ Cancel" : "+ Register Teacher"}
          </button>
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        {showForm && (
          <div className="form-card">
            <h2>➕ Register New Teacher</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" required placeholder="Teacher's full name" value={form.name} onChange={set("name")} />
              </div>
              <div className="form-group">
                <label>Email * <span className="hint">— used to login</span></label>
                <input type="email" required placeholder="teacher@email.com" value={form.email} onChange={set("email")} />
              </div>
              <div className="form-group">
                <label>Phone * <span className="hint">— exactly 10 digits</span></label>
                <input type="tel" required placeholder="0771234567" maxLength={10}
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))} />
              </div>
              <div className="form-group">
                <label>Password * <span className="hint">— min 6 characters</span></label>
                <input type="password" required placeholder="••••••••" value={form.password} onChange={set("password")} />
              </div>
              <div className="form-group full">
                <label>Confirm Password *</label>
                <input type="password" required placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} />
              </div>
              <div className="form-actions full">
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? "⏳ Registering..." : "Register Teacher"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setError(""); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="search-row">
          <input className="search-input" type="text" placeholder="🔍  Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <span className="count-badge">
            {loading ? "Loading..." : `${filtered.length} teacher${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {loading ? (
          <div className="loading-box">⏳ Loading teachers...</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" className="no-data">
                    {teachers.length === 0 ? "No teachers registered yet." : "No teachers match your search."}
                  </td></tr>
                ) : filtered.map((t, i) => (
                  <tr key={t._id}>
                    <td><span className="num-badge">{i + 1}</span></td>
                    <td><strong>{t.name}</strong></td>
                    <td className="email-cell">{t.email}</td>
                    <td>{t.phone || <span style={{color:"#aaa"}}>—</span>}</td>
                    <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-LK") : "—"}</td>
                    <td>
                      <button className="btn-del" onClick={() => setDeleteId(t._id)}>🗑 Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2>⚠️ Remove Teacher?</h2>
              <p>This will permanently delete this teacher's account. They will no longer be able to log in.</p>
              <div className="modal-actions">
                <button className="btn-del" onClick={() => handleDelete(deleteId)}>Yes, Remove</button>
                <button className="cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .admin-page{background:#f4f6f9;min-height:100vh;}
        .admin-body{padding:40px;max-width:1100px;margin:auto;}
        .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap;gap:16px;}
        .page-header h1{font-size:30px;color:#ff4fa3;margin-bottom:5px;}
        .page-header p{color:#888;font-size:15px;}
        .add-btn{padding:12px 26px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:15px;transition:transform 0.2s;white-space:nowrap;}
        .add-btn:hover{transform:translateY(-2px);}
        .banner{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600;font-size:15px;}
        .success-banner{background:#dcfce7;border:1px solid #86efac;color:#15803d;}
        .error-banner{background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;}
        .form-card{background:white;border-radius:18px;padding:30px;margin-bottom:28px;box-shadow:0 6px 20px rgba(0,0,0,0.1);}
        .form-card h2{font-size:20px;color:#ff4fa3;margin-bottom:20px;}
        .grid-form{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .form-group{display:flex;flex-direction:column;gap:6px;}
        .form-group.full{grid-column:1/-1;}
        .form-group label{font-weight:600;font-size:13px;color:#555;}
        .hint{font-weight:400;color:#aaa;font-size:12px;margin-left:4px;}
        .form-group input{padding:11px 14px;border-radius:10px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;font-family:"Segoe UI",sans-serif;}
        .form-group input:focus{border-color:#ff4fa3;}
        .form-actions{display:flex;gap:14px;}
        .submit-btn{padding:12px 28px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);}
        .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .cancel-btn{padding:12px 28px;border-radius:25px;border:2px solid #ddd;background:white;color:#666;font-weight:600;cursor:pointer;font-size:14px;}
        .search-row{display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap;}
        .search-input{flex:1;min-width:200px;padding:12px 18px;border-radius:12px;border:2px solid #eee;font-size:15px;outline:none;transition:border 0.2s;background:white;}
        .search-input:focus{border-color:#ff4fa3;}
        .count-badge{padding:8px 18px;background:white;border-radius:20px;font-weight:600;color:#555;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
        .loading-box{text-align:center;padding:60px;color:#888;font-size:18px;background:white;border-radius:16px;}
        .table-wrap{background:white;border-radius:18px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;}
        .data-table thead{background:linear-gradient(90deg,#4facfe,#ff7eb3);}
        .data-table th{padding:14px 16px;color:white;font-size:13px;text-align:left;white-space:nowrap;}
        .data-table td{padding:13px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#444;}
        .data-table tr:last-child td{border-bottom:none;}
        .data-table tr:hover td{background:#fdf4f9;}
        .num-badge{background:#f0f4ff;color:#4facfe;padding:3px 10px;border-radius:8px;font-weight:700;font-size:12px;}
        .email-cell{font-size:13px;color:#555;}
        .btn-del{padding:7px 16px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{text-align:center;padding:40px;color:#aaa;font-size:16px;}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card{background:white;border-radius:20px;padding:36px;max-width:420px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
        .modal-card h2{font-size:22px;color:#ff4fa3;margin-bottom:14px;}
        .modal-card p{color:#666;margin-bottom:24px;line-height:1.6;}
        .modal-actions{display:flex;gap:14px;justify-content:center;}
        @media(max-width:768px){.admin-body{padding:20px;}.grid-form{grid-template-columns:1fr;}.form-group.full{grid-column:1;}}
      `}</style>
    </div>
  );
};

export default TeacherManagement;

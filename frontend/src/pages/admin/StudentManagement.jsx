import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PrintButton from "../../components/PrintButton";
import { studentAPI } from "../../services/api";

const today = new Date().toISOString().split("T")[0];

const blankForm = {
  name: "", dateOfBirth: "", address: "", enrolledDate: "",
  status: "Active", className: "Class A",
  parentName: "", parentPhone: "", parentEmail: "",
};

const classColors = { "Class A": "#4facfe", "Class B": "#a78bfa", "Class C": "#34d399" };

const StudentManagement = () => {
  const [students, setStudents]       = useState([]);
  const [form, setForm]               = useState(blankForm);
  const [editId, setEditId]           = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [deleteId, setDeleteId]       = useState(null);
  const [search, setSearch]           = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [successMsg, setSuccessMsg]   = useState("");

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try { setLoading(true); const data = await studentAPI.getAll(); setStudents(data); }
    catch (err) { setError("Could not load students: " + err.message); }
    finally { setLoading(false); }
  };

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };
  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    if (!/^\d{10}$/.test(form.parentPhone)) {
      setError("Phone number must be exactly 10 digits."); return false;
    }
    if (!form.parentEmail.includes("@")) {
      setError("Email must contain '@'."); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!validate()) return;
    setSaving(true);
    try {
      if (editId) { await studentAPI.update(editId, form); flash("✅ Student updated."); setEditId(null); }
      else { await studentAPI.create(form); flash("✅ Student added."); }
      setForm(blankForm); setShowForm(false); fetchStudents();
    } catch (err) { setError("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, dateOfBirth: s.dateOfBirth?.split("T")[0]||"", address: s.address,
      enrolledDate: s.enrolledDate?.split("T")[0]||"", status: s.status, className: s.className || "Class A",
      parentName: s.parentName, parentPhone: s.parentPhone, parentEmail: s.parentEmail||"" });
    setEditId(s._id); setShowForm(true); setViewStudent(null);
  };

  const handleDelete = async (id) => {
    try { await studentAPI.delete(id); flash("✅ Student deleted."); setDeleteId(null); setViewStudent(null); fetchStudents(); }
    catch (err) { setError("Delete failed: " + err.message); }
  };

  const filtered = students.filter(s => {
    const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      s.parentEmail?.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "All" || s.className === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="admin-page">
      <Navbar currentPage="Students" mode="admin" />
      <div className="admin-body">

        <div className="page-header">
          <div><h1>🎒 Student Management</h1><p>Add and manage student profiles — connected to MongoDB</p></div>
          <div className="header-btns">
            <PrintButton printAreaId="print-area" title="Student Management Report" />
            <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(blankForm); setError(""); }}>
              {showForm ? "✕ Cancel" : "+ Add Student"}
            </button>
          </div>
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        {showForm && (
          <div className="form-card">
            <h2>{editId ? "✏️ Edit Student" : "➕ Add New Student"}</h2>
            <div className="info-tip">💡 <strong>Parent Email</strong> must match the email the parent used to register.</div>
            <form onSubmit={handleSubmit} className="grid-form">
              <div className="form-group"><label>Full Name *</label><input type="text" required placeholder="Student's full name" value={form.name} onChange={set("name")} /></div>
              <div className="form-group"><label>Date of Birth *</label><input type="date" required max={today} value={form.dateOfBirth} onChange={set("dateOfBirth")} /></div>
              <div className="form-group full"><label>Address *</label><input type="text" required placeholder="Home address" value={form.address} onChange={set("address")} /></div>
              <div className="form-group"><label>Enrolled Date *</label><input type="date" required max={today} value={form.enrolledDate} onChange={set("enrolledDate")} /></div>
              <div className="form-group"><label>Class *</label>
                <select value={form.className} onChange={set("className")}>
                  <option>Class A</option><option>Class B</option><option>Class C</option>
                </select>
              </div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={set("status")}><option>Active</option><option>Inactive</option></select></div>
              <div className="section-divider full"><span>👨‍👩‍👧 Parent / Guardian Details</span></div>
              <div className="form-group"><label>Parent Name *</label><input type="text" required placeholder="Parent's full name" value={form.parentName} onChange={set("parentName")} /></div>
              <div className="form-group">
                <label>Parent Phone * <span className="email-hint">— exactly 10 digits</span></label>
                <input type="tel" required placeholder="0771234567" maxLength={10}
                  pattern="\d{10}" title="Must be exactly 10 digits"
                  value={form.parentPhone} onChange={e => setForm(p => ({...p, parentPhone: e.target.value.replace(/\D/g,"")}))} />
              </div>
              <div className="form-group full email-group">
                <label>Parent Email * <span className="email-hint">— must match the parent's login email</span></label>
                <input type="email" required placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} />
              </div>
              <div className="form-actions full">
                <button type="submit" className="submit-btn" disabled={saving}>{saving ? "⏳ Saving..." : editId ? "Update Student" : "Add Student"}</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="search-row">
          <input className="search-input" type="text" placeholder="🔍  Search by name, ID or parent email..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="class-filter" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
            <option value="All">All Classes</option>
            <option>Class A</option><option>Class B</option><option>Class C</option>
          </select>
          <span className="count-badge">{loading ? "Loading..." : `${filtered.length} student${filtered.length !== 1 ? "s" : ""}`}</span>
        </div>

        <div id="print-area">
          <p style={{marginBottom:12, color:"#888", fontSize:13}}>Total students: <strong>{filtered.length}</strong> &nbsp;|&nbsp; Date: <strong>{new Date().toLocaleDateString("en-LK")}</strong></p>
          {loading ? <div className="loading-box">⏳ Loading students from database...</div> : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Class</th><th>Date of Birth</th><th>Enrolled</th><th>Status</th><th>Parent</th><th>Parent Email</th><th className="no-print">Actions</th></tr></thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="9" className="no-data">{students.length === 0 ? "No students yet." : "No students match your search."}</td></tr>
                  ) : filtered.map(s => (
                    <tr key={s._id}>
                      <td><span className="id-badge">{s.studentId}</span></td>
                      <td><strong>{s.name}</strong></td>
                      <td><span className="class-pill" style={{background:classColors[s.className]||"#aaa"}}>{s.className || "—"}</span></td>
                      <td>{s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString("en-LK") : "—"}</td>
                      <td>{s.enrolledDate ? new Date(s.enrolledDate).toLocaleDateString("en-LK") : "—"}</td>
                      <td><span className={`status-pill ${s.status === "Active" ? "active" : "inactive"}`}>{s.status}</span></td>
                      <td>{s.parentName}</td>
                      <td className="email-cell">{s.parentEmail || <span className="no-email">⚠️ Not set</span>}</td>
                      <td className="no-print">
                        <div className="action-row">
                          <button className="btn-view" onClick={() => { setViewStudent(s); setShowForm(false); }}>View</button>
                          <button className="btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                          <button className="btn-del"  onClick={() => setDeleteId(s._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {viewStudent && (
          <div className="modal-overlay" onClick={() => setViewStudent(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setViewStudent(null)}>✕</button>
              <h2>🎒 {viewStudent.name}</h2>
              <div className="modal-grid">
                <div><strong>Student ID</strong><p>{viewStudent.studentId}</p></div>
                <div><strong>Class</strong><p><span className="class-pill" style={{background:classColors[viewStudent.className]||"#aaa"}}>{viewStudent.className || "—"}</span></p></div>
                <div><strong>Date of Birth</strong><p>{viewStudent.dateOfBirth ? new Date(viewStudent.dateOfBirth).toLocaleDateString("en-LK") : "—"}</p></div>
                <div><strong>Enrolled</strong><p>{viewStudent.enrolledDate ? new Date(viewStudent.enrolledDate).toLocaleDateString("en-LK") : "—"}</p></div>
                <div><strong>Status</strong><p><span className={`status-pill ${viewStudent.status === "Active" ? "active" : "inactive"}`}>{viewStudent.status}</span></p></div>
                <div className="full"><strong>Address</strong><p>{viewStudent.address}</p></div>
                <div><strong>Parent Name</strong><p>{viewStudent.parentName}</p></div>
                <div><strong>Parent Phone</strong><p>{viewStudent.parentPhone}</p></div>
                <div className="full"><strong>Parent Email</strong><p>{viewStudent.parentEmail || "⚠️ Not set"}</p></div>
              </div>
              <div className="modal-actions">
                <button className="btn-edit" onClick={() => handleEdit(viewStudent)}>Edit</button>
                <button className="btn-del"  onClick={() => setDeleteId(viewStudent._id)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card small" onClick={e => e.stopPropagation()}>
              <h2>⚠️ Delete Student?</h2><p>This will permanently remove this student.</p>
              <div className="modal-actions">
                <button className="btn-del" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
                <button className="cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .admin-page{background:#f4f6f9;min-height:100vh;} .admin-body{padding:40px;max-width:1300px;margin:auto;}
        .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap;gap:16px;}
        .page-header h1{font-size:30px;color:#ff4fa3;margin-bottom:5px;} .page-header p{color:#888;font-size:15px;}
        .header-btns{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
        .add-btn{padding:12px 26px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:15px;transition:transform 0.2s;}
        .add-btn:hover{transform:translateY(-2px);}
        .banner{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600;font-size:15px;}
        .success-banner{background:#dcfce7;border:1px solid #86efac;color:#15803d;} .error-banner{background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;}
        .loading-box{text-align:center;padding:60px;color:#888;font-size:18px;background:white;border-radius:16px;}
        .form-card{background:white;border-radius:18px;padding:30px;margin-bottom:28px;box-shadow:0 6px 20px rgba(0,0,0,0.1);}
        .form-card h2{font-size:20px;color:#ff4fa3;margin-bottom:16px;}
        .info-tip{background:#f0f8ff;border:1px solid #bfdbfe;border-radius:12px;padding:12px 16px;font-size:13px;color:#1e40af;line-height:1.6;margin-bottom:20px;}
        .grid-form{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .form-group{display:flex;flex-direction:column;gap:6px;} .form-group.full{grid-column:1/-1;}
        .form-group label{font-weight:600;font-size:13px;color:#555;}
        .form-group input,.form-group select{padding:11px 14px;border-radius:10px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;font-family:"Segoe UI",sans-serif;}
        .form-group input:focus,.form-group select:focus{border-color:#ff4fa3;}
        .section-divider{display:flex;align-items:center;gap:12px;margin:8px 0 4px;}
        .section-divider span{font-weight:700;font-size:14px;color:#ff4fa3;background:#fff0f8;padding:6px 16px;border-radius:20px;border:1px solid rgba(255,79,163,0.2);}
        .email-group input{border-color:#bfdbfe;background:#f0f8ff;} .email-group input:focus{border-color:#3b82f6;}
        .email-hint{font-weight:400;color:#888;font-size:12px;margin-left:4px;}
        .form-actions{display:flex;gap:14px;}
        .submit-btn{padding:12px 28px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);} .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .cancel-btn{padding:12px 28px;border-radius:25px;border:2px solid #ddd;background:white;color:#666;font-weight:600;cursor:pointer;font-size:14px;}
        .search-row{display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap;}
        .search-input{flex:1;min-width:200px;padding:12px 18px;border-radius:12px;border:2px solid #eee;font-size:15px;outline:none;transition:border 0.2s;background:white;}
        .search-input:focus{border-color:#ff4fa3;}
        .class-filter{padding:12px 16px;border-radius:12px;border:2px solid #eee;font-size:14px;outline:none;background:white;cursor:pointer;}
        .class-filter:focus{border-color:#ff4fa3;}
        .count-badge{padding:8px 18px;background:white;border-radius:20px;font-weight:600;color:#555;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
        .table-wrap{background:white;border-radius:18px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;} .data-table thead{background:linear-gradient(90deg,#4facfe,#ff7eb3);}
        .data-table th{padding:14px 16px;color:white;font-size:13px;text-align:left;white-space:nowrap;}
        .data-table td{padding:13px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#444;}
        .data-table tr:last-child td{border-bottom:none;} .data-table tr:hover td{background:#fdf4f9;}
        .id-badge{background:#f0f4ff;color:#4facfe;padding:3px 10px;border-radius:8px;font-weight:700;font-size:12px;}
        .class-pill{padding:3px 12px;border-radius:20px;color:white;font-size:12px;font-weight:700;}
        .status-pill{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
        .status-pill.active{background:#dcfce7;color:#16a34a;} .status-pill.inactive{background:#fee2e2;color:#dc2626;}
        .email-cell{font-size:13px;color:#555;} .no-email{color:#f59e0b;font-size:12px;font-weight:600;}
        .action-row{display:flex;gap:8px;}
        .btn-view{padding:6px 14px;border-radius:20px;border:2px solid #4facfe;background:white;color:#4facfe;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-edit{padding:6px 14px;border-radius:20px;border:2px solid #ff7eb3;background:white;color:#ff4fa3;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-del{padding:6px 14px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{text-align:center;padding:40px;color:#aaa;font-size:16px;}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card{background:white;border-radius:20px;padding:36px;max-width:600px;width:100%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:90vh;overflow-y:auto;}
        .modal-card.small{max-width:380px;text-align:center;} .modal-card.small p{color:#666;margin:14px 0 24px;line-height:1.6;}
        .modal-close{position:absolute;top:16px;right:20px;border:none;background:none;font-size:20px;cursor:pointer;color:#aaa;}
        .modal-card h2{font-size:22px;color:#ff4fa3;margin-bottom:20px;}
        .modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;}
        .modal-grid .full{grid-column:1/-1;} .modal-grid strong{display:block;font-size:12px;color:#aaa;margin-bottom:4px;} .modal-grid p{font-size:15px;color:#333;}
        .modal-actions{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;}
        @media(max-width:768px){.admin-body{padding:20px;}.grid-form{grid-template-columns:1fr;}.form-group.full{grid-column:1;}.modal-grid{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
};
export default StudentManagement;

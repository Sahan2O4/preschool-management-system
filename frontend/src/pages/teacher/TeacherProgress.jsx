import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PrintButton from "../../components/PrintButton";
import { progressAPI, studentAPI } from "../../services/api";

const today = new Date().toISOString().split("T")[0];
const subjects = ["English","Mathematics","Science","Arts & Crafts","Music","Physical Education"];
const grades   = ["A+","A","A-","B+","B","B-","C","D"];
const gradeColors = { "A+":"#16a34a","A":"#22c55e","A-":"#4ade80","B+":"#4facfe","B":"#60a5fa","B-":"#93c5fd","C":"#f59e0b","D":"#f87171" };
const subjectColors = { English:"#4facfe",Mathematics:"#ff7eb3",Science:"#34d399","Arts & Crafts":"#f59e0b",Music:"#a78bfa","Physical Education":"#f87171" };
const classColors = { "Class A": "#4facfe", "Class B": "#a78bfa", "Class C": "#34d399" };
const blank = { studentId:"", subject:subjects[0], grade:"A", date:today, description:"" };

const TeacherProgress = () => {
  const [records, setRecords]           = useState([]);
  const [students, setStudents]         = useState([]);
  const [form, setForm]                 = useState(blank);
  const [editId, setEditId]             = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [searchName, setSearchName]     = useState("");
  const [filterClass, setFilterClass]   = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [loading, setLoading]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");
  const [successMsg, setSuccessMsg]     = useState("");
  const [deleteId, setDeleteId]         = useState(null);

  useEffect(() => { fetchStudents(); fetchRecords(); }, []);

  const fetchStudents = async () => { try { const d = await studentAPI.getAll(); setStudents(d); } catch {} };
  const fetchRecords  = async () => {
    try { setLoading(true); const d = await progressAPI.getAll(); setRecords(d); }
    catch (err) { setError("Could not load records: " + err.message); }
    finally { setLoading(false); }
  };

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); if (!form.studentId) { setError("Please select a student."); return; }
    setSaving(true);
    try {
      if (editId) { await progressAPI.update(editId,{...form,date:new Date(form.date)}); flash("✅ Record updated."); setEditId(null); }
      else { await progressAPI.create({...form,date:new Date(form.date)}); flash("✅ Record saved."); }
      setForm(blank); setShowForm(false); fetchRecords();
    } catch (err) { setError("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (r) => {
    setForm({ studentId: r.studentId?._id||r.studentId, subject:r.subject, grade:r.grade,
      date: new Date(r.date).toISOString().split("T")[0], description:r.description });
    setEditId(r._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    try { await progressAPI.delete(id); flash("✅ Record deleted."); setDeleteId(null); fetchRecords(); }
    catch (err) { setError("Delete failed: " + err.message); }
  };

  // Get student object from record
  const getStudentObj = (r) => {
    if (r.studentId && typeof r.studentId === "object") return r.studentId;
    return students.find(s => s._id === r.studentId) || null;
  };

  const filtered = records.filter(r => {
    const stu = getStudentObj(r);
    const matchName = !searchName || (stu?.name || "").toLowerCase().includes(searchName.toLowerCase());
    const matchClass = filterClass === "All" || stu?.className === filterClass;
    const matchSub = filterSubject === "All" || r.subject === filterSubject;
    return matchName && matchClass && matchSub;
  });

  // Students filtered by class for the form dropdown
  const formStudents = filterClass === "All" ? students : students.filter(s => s.className === filterClass);

  return (
    <div className="admin-page">
      <Navbar currentPage="Progress" mode="teacher" />
      <div className="admin-body">
        <div className="page-header">
          <div><h1>📈 Progress Tracking</h1><p>Record and monitor student academic progress</p></div>
          <div className="header-btns">
            <PrintButton printAreaId="print-area" title="Student Progress Report" />
            <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(blank); setError(""); }}>
              {showForm ? "✕ Cancel" : "+ Add Record"}
            </button>
          </div>
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        {showForm && (
          <div className="form-card">
            <h2>{editId ? "✏️ Edit Record" : "➕ Add Progress Record"}</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <div className="form-group">
                <label>Student *</label>
                <select required value={form.studentId} onChange={e => setForm({...form,studentId:e.target.value})}>
                  <option value="">— Select Student —</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.studentId}) — {s.className}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Subject *</label><select value={form.subject} onChange={e => setForm({...form,subject:e.target.value})}>{subjects.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label>Grade *</label><select value={form.grade} onChange={e => setForm({...form,grade:e.target.value})}>{grades.map(g=><option key={g}>{g}</option>)}</select></div>
              <div className="form-group"><label>Date *</label><input required type="date" max={today} value={form.date} onChange={e => setForm({...form,date:e.target.value})} /></div>
              <div className="form-group full"><label>Description / Notes *</label><textarea required rows="3" value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Describe the student's performance..." /></div>
              <div className="form-actions full">
                <button type="submit" className="submit-btn" disabled={saving}>{saving?"⏳ Saving...":editId?"Update Record":"Save Record"}</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="filter-bar no-print">
          <div className="search-box">
            <label>🔍 Search by Student Name</label>
            <input type="text" placeholder="Type student name..." value={searchName}
              onChange={e => setSearchName(e.target.value)} className="search-input" />
          </div>
          <div className="form-group" style={{minWidth:160}}>
            <label>Filter by Class</label>
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}>
              <option value="All">All Classes</option>
              <option>Class A</option><option>Class B</option><option>Class C</option>
            </select>
          </div>
          <div className="form-group" style={{minWidth:180}}>
            <label>Filter by Subject</label>
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
              <option value="All">All Subjects</option>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <span className="count-badge" style={{alignSelf:"flex-end"}}>{loading?"Loading...":`${filtered.length} record${filtered.length!==1?"s":""}`}</span>
        </div>

        {loading ? <div className="loading-box">⏳ Loading records...</div> : (
          <div id="print-area">
            <p style={{marginBottom:14,color:"#888",fontSize:13}}>Total records: <strong>{filtered.length}</strong> &nbsp;|&nbsp; Printed: <strong>{new Date().toLocaleDateString("en-LK")}</strong></p>
            <div className="records-grid">
              {filtered.length === 0 ? <p className="no-data">{records.length===0?"No records yet.":"No records match filters."}</p>
              : filtered.map(r => {
                const stu = getStudentObj(r);
                return (
                  <div key={r._id} className="record-card">
                    <div className="rec-top">
                      <div>
                        <p className="rec-student">{stu?.name||r.studentId?.name||"Unknown"}</p>
                        <p className="rec-student-id">{stu?.studentId||r.studentId?.studentId||""}</p>
                        {stu?.className && (
                          <span className="class-tag" style={{background:classColors[stu.className]||"#aaa"}}>{stu.className}</span>
                        )}
                        <div className="subj-tag" style={{background:subjectColors[r.subject]||"#aaa"}}>{r.subject}</div>
                      </div>
                      <div className="grade-badge" style={{background:gradeColors[r.grade]||"#aaa"}}>{r.grade}</div>
                    </div>
                    <p className="rec-date">📅 {new Date(r.date).toLocaleDateString("en-LK")}</p>
                    <p className="rec-desc">{r.description}</p>
                    <div className="action-row no-print">
                      <button className="btn-edit" onClick={() => handleEdit(r)}>✏️ Edit</button>
                      <button className="btn-del"  onClick={() => setDeleteId(r._id)}>🗑 Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2>⚠️ Delete Record?</h2><p>This will permanently remove this progress record.</p>
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
        .form-card h2{font-size:20px;color:#ff4fa3;margin-bottom:20px;}
        .grid-form{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .form-group{display:flex;flex-direction:column;gap:6px;} .form-group.full{grid-column:1/-1;}
        .form-group label{font-weight:600;font-size:13px;color:#555;}
        .form-group input,.form-group select,.form-group textarea{padding:11px 14px;border-radius:10px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;font-family:"Segoe UI",sans-serif;resize:vertical;}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#ff4fa3;}
        .form-actions{display:flex;gap:14px;}
        .submit-btn{padding:12px 28px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);} .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .cancel-btn{padding:12px 28px;border-radius:25px;border:2px solid #ddd;background:white;color:#666;font-weight:600;cursor:pointer;font-size:14px;}
        .filter-bar{display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap;align-items:flex-end;}
        .search-box{display:flex;flex-direction:column;gap:6px;flex:1;min-width:200px;}
        .search-box label{font-weight:600;font-size:13px;color:#555;}
        .search-input{padding:11px 14px;border-radius:10px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;}
        .search-input:focus{border-color:#ff4fa3;}
        .count-badge{padding:8px 18px;background:white;border-radius:20px;font-weight:600;color:#555;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
        .records-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;}
        .record-card{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 14px rgba(0,0,0,0.08);transition:transform 0.2s;display:flex;flex-direction:column;gap:10px;}
        .record-card:hover{transform:translateY(-4px);}
        .rec-top{display:flex;justify-content:space-between;align-items:flex-start;}
        .rec-student{font-size:16px;font-weight:700;color:#333;margin-bottom:3px;}
        .rec-student-id{font-size:11px;color:#aaa;margin-bottom:6px;}
        .class-tag{display:inline-block;padding:2px 10px;border-radius:20px;color:white;font-size:11px;font-weight:700;margin-bottom:6px;margin-right:6px;}
        .subj-tag{display:inline-block;padding:3px 12px;border-radius:20px;color:white;font-size:12px;font-weight:700;}
        .grade-badge{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:16px;flex-shrink:0;}
        .rec-date{font-size:13px;color:#aaa;} .rec-desc{font-size:14px;color:#555;line-height:1.6;flex:1;}
        .action-row{display:flex;gap:10px;margin-top:4px;}
        .btn-edit{padding:7px 16px;border-radius:20px;border:2px solid #ff7eb3;background:white;color:#ff4fa3;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-del{padding:7px 16px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{text-align:center;padding:60px;color:#aaa;font-size:16px;grid-column:1/-1;background:white;border-radius:16px;}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card{background:white;border-radius:20px;padding:36px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
        .modal-card h2{font-size:22px;color:#ff4fa3;margin-bottom:14px;} .modal-card p{color:#666;margin-bottom:24px;line-height:1.6;}
        .modal-actions{display:flex;gap:14px;justify-content:center;}
        @media(max-width:768px){.admin-body{padding:20px;}.grid-form{grid-template-columns:1fr;}.form-group.full{grid-column:1;}}
      `}</style>
    </div>
  );
};
export default TeacherProgress;

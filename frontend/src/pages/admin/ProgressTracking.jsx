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
const classColors = { "Class A":"#4facfe","Class B":"#a78bfa","Class C":"#34d399" };
const blank = { studentId:"", subject:subjects[0], grade:"A", date:today, description:"" };

const ProgressTracking = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [records, setRecords]         = useState([]);
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm]               = useState(blank);
  const [editId, setEditId]           = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [deleteId, setDeleteId]       = useState(null);
  const [filterSubject, setFilterSubject] = useState("All");
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [successMsg, setSuccessMsg]   = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [studs, recs] = await Promise.all([studentAPI.getAll(), progressAPI.getAll()]);
      setAllStudents(studs);
      setRecords(recs);
    } catch (err) {
      setError("Could not load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  // Students in the selected class
  const classStudents = allStudents.filter(s => s.className === selectedClass);

  // Records for the selected student, filtered by subject
  const studentRecords = selectedStudent
    ? records.filter(r => {
        const sid = r.studentId?._id || r.studentId;
        const matchStu = sid === selectedStudent._id;
        const matchSub = filterSubject === "All" || r.subject === filterSubject;
        return matchStu && matchSub;
      })
    : [];

  const handleSelectStudent = (s) => {
    setSelectedStudent(s);
    setShowForm(false);
    setEditId(null);
    setForm({ ...blank, studentId: s._id });
    setFilterSubject("All");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    setSaving(true);
    try {
      if (editId) {
        await progressAPI.update(editId, form);
        flash("✅ Record updated.");
        setEditId(null);
      } else {
        await progressAPI.create(form);
        flash("✅ Progress record saved.");
      }
      setShowForm(false);
      setForm({ ...blank, studentId: selectedStudent?._id || "" });
      const recs = await progressAPI.getAll();
      setRecords(recs);
    } catch (err) {
      setError("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (r) => {
    setForm({
      studentId: selectedStudent._id,
      subject: r.subject,
      grade: r.grade,
      date: r.date ? r.date.split("T")[0] : today,
      description: r.description,
    });
    setEditId(r._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await progressAPI.delete(id);
      flash("✅ Record deleted.");
      setDeleteId(null);
      const recs = await progressAPI.getAll();
      setRecords(recs);
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  const fmtDate = (d) => d ? new Date(d.includes("T") ? d : d + "T12:00:00").toLocaleDateString("en-LK") : "—";

  return (
    <div className="admin-page">
      <Navbar currentPage="Progress" mode="admin" />
      <div className="admin-body">

        <div className="page-header">
          <div><h1>📈 Progress Tracking</h1><p>Select a class, pick a student, then record or view their progress</p></div>
          <PrintButton printAreaId="print-area" title="Student Progress Report" />
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        {loading ? <div className="loading-box">⏳ Loading data...</div> : (
          <div className="main-layout">

            {/* ── LEFT PANEL: Class selector + student list ── */}
            <div className="left-panel">
              <div className="class-tabs">
                {["Class A","Class B","Class C"].map(cls => (
                  <button key={cls}
                    className={`class-tab ${selectedClass === cls ? "active" : ""}`}
                    style={selectedClass === cls ? {background: classColors[cls], borderColor: classColors[cls]} : {}}
                    onClick={() => { setSelectedClass(cls); setSelectedStudent(null); setShowForm(false); }}>
                    {cls}
                    <span className="tab-count">
                      {allStudents.filter(s => s.className === cls).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="student-list">
                {classStudents.length === 0 ? (
                  <div className="no-students">No students in {selectedClass}.<br/>Add students in Student Management first.</div>
                ) : classStudents.map(s => {
                  const recCount = records.filter(r => (r.studentId?._id || r.studentId) === s._id).length;
                  return (
                    <div key={s._id}
                      className={`student-card ${selectedStudent?._id === s._id ? "selected" : ""}`}
                      onClick={() => handleSelectStudent(s)}>
                      <div className="stu-avatar">{s.name.charAt(0).toUpperCase()}</div>
                      <div className="stu-info">
                        <p className="stu-name">{s.name}</p>
                        <p className="stu-id">{s.studentId}</p>
                      </div>
                      <span className="rec-count">{recCount}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT PANEL: Student progress ── */}
            <div className="right-panel">
              {!selectedStudent ? (
                <div className="select-prompt">
                  <span style={{fontSize:48}}>👆</span>
                  <p>Select a student from the left to view or add their progress records</p>
                </div>
              ) : (
                <>
                  {/* Student header */}
                  <div className="stu-header">
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div className="stu-avatar-lg">{selectedStudent.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <h2>{selectedStudent.name}</h2>
                        <p style={{color:"#888",fontSize:14}}>{selectedStudent.studentId} &nbsp;|&nbsp;
                          <span className="class-pill" style={{background:classColors[selectedStudent.className]||"#aaa"}}>{selectedStudent.className}</span>
                        </p>
                      </div>
                    </div>
                    <button className="add-btn"
                      onClick={() => { setShowForm(!showForm); setEditId(null); setForm({...blank, studentId: selectedStudent._id}); }}>
                      {showForm ? "✕ Cancel" : "+ Add Progress"}
                    </button>
                  </div>

                  {/* Add / Edit form */}
                  {showForm && (
                    <div className="form-card" id="print-area">
                      <h3>{editId ? "✏️ Edit Record" : `➕ Add Progress for ${selectedStudent.name}`}</h3>
                      <form onSubmit={handleSubmit} className="grid-form">
                        <div className="form-group">
                          <label>Subject *</label>
                          <select value={form.subject} onChange={e => setForm({...form,subject:e.target.value})}>
                            {subjects.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Grade *</label>
                          <select value={form.grade} onChange={e => setForm({...form,grade:e.target.value})}>
                            {grades.map(g => <option key={g}>{g}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Date *</label>
                          <input type="date" required max={today} value={form.date} onChange={e => setForm({...form,date:e.target.value})} />
                        </div>
                        <div className="form-group full">
                          <label>Description / Notes *</label>
                          <textarea required rows="3" value={form.description}
                            onChange={e => setForm({...form,description:e.target.value})}
                            placeholder="Describe the student's performance..." />
                        </div>
                        <div className="form-actions full">
                          <button type="submit" className="submit-btn" disabled={saving}>
                            {saving ? "⏳ Saving..." : editId ? "Update Record" : "Save Record"}
                          </button>
                          <button type="button" className="cancel-btn"
                            onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Subject filter */}
                  <div className="subj-filter no-print">
                    <span style={{fontWeight:600,color:"#555",fontSize:13}}>Filter:</span>
                    {["All",...subjects].map(s => (
                      <button key={s}
                        className={`subj-pill ${filterSubject === s ? "active" : ""}`}
                        style={filterSubject === s && s !== "All" ? {background:subjectColors[s]||"#4facfe",borderColor:"transparent",color:"white"} : {}}
                        onClick={() => setFilterSubject(s)}>
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Records */}
                  <div className="records-grid" id={!showForm ? "print-area" : undefined}>
                    {studentRecords.length === 0 ? (
                      <div className="no-data">
                        {filterSubject === "All"
                          ? `No progress records yet for ${selectedStudent.name}. Click "+ Add Progress" to add one.`
                          : `No ${filterSubject} records for ${selectedStudent.name}.`}
                      </div>
                    ) : studentRecords.map(r => (
                      <div key={r._id} className="record-card">
                        <div className="rec-top">
                          <div>
                            <div className="subj-tag" style={{background:subjectColors[r.subject]||"#aaa"}}>{r.subject}</div>
                          </div>
                          <div className="grade-badge" style={{background:gradeColors[r.grade]||"#aaa"}}>{r.grade}</div>
                        </div>
                        <p className="rec-date">📅 {fmtDate(r.date)}</p>
                        <p className="rec-desc">{r.description}</p>
                        <div className="action-row no-print">
                          <button className="btn-edit" onClick={() => handleEdit(r)}>✏️ Edit</button>
                          <button className="btn-del"  onClick={() => setDeleteId(r._id)}>🗑 Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2>⚠️ Delete Record?</h2>
              <p>This will permanently remove this progress record.</p>
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
        .admin-page{background:#f4f6f9;min-height:100vh;}
        .admin-body{padding:40px;max-width:1400px;margin:auto;}
        .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap;gap:16px;}
        .page-header h1{font-size:30px;color:#ff4fa3;margin-bottom:5px;}
        .page-header p{color:#888;font-size:15px;}
        .banner{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600;font-size:15px;}
        .success-banner{background:#dcfce7;border:1px solid #86efac;color:#15803d;}
        .error-banner{background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;}
        .loading-box{text-align:center;padding:60px;color:#888;font-size:18px;background:white;border-radius:16px;}

        .main-layout{display:flex;gap:24px;align-items:flex-start;}
        .left-panel{width:260px;flex-shrink:0;}
        .right-panel{flex:1;min-width:0;}

        .class-tabs{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
        .class-tab{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-radius:12px;border:2px solid #eee;background:white;font-weight:600;font-size:14px;color:#555;cursor:pointer;transition:all 0.2s;}
        .class-tab.active{color:white;}
        .tab-count{font-size:12px;background:rgba(255,255,255,0.25);padding:2px 8px;border-radius:10px;}
        .class-tab:not(.active) .tab-count{background:#f0f0f0;color:#888;}

        .student-list{display:flex;flex-direction:column;gap:8px;}
        .no-students{background:white;border-radius:12px;padding:24px;text-align:center;color:#aaa;font-size:13px;line-height:1.6;}
        .student-card{background:white;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;border:2px solid #eee;transition:all 0.2s;}
        .student-card:hover{border-color:#ff4fa3;}
        .student-card.selected{border-color:#ff4fa3;background:#fff0f8;}
        .stu-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#4facfe,#ff7eb3);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0;}
        .stu-info{flex:1;min-width:0;}
        .stu-name{font-weight:600;font-size:14px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .stu-id{font-size:11px;color:#aaa;margin-top:2px;}
        .rec-count{background:#f0f4ff;color:#4facfe;font-size:12px;font-weight:700;padding:3px 9px;border-radius:10px;flex-shrink:0;}

        .select-prompt{background:white;border-radius:18px;padding:60px;text-align:center;color:#aaa;box-shadow:0 4px 14px rgba(0,0,0,0.06);}
        .select-prompt p{font-size:15px;margin-top:16px;line-height:1.6;}

        .stu-header{background:white;border-radius:16px;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;box-shadow:0 4px 14px rgba(0,0,0,0.06);flex-wrap:wrap;gap:14px;}
        .stu-avatar-lg{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#4facfe,#ff7eb3);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;flex-shrink:0;}
        .stu-header h2{font-size:20px;color:#333;font-weight:700;margin-bottom:4px;}
        .class-pill{display:inline-block;padding:2px 10px;border-radius:20px;color:white;font-size:12px;font-weight:700;}
        .add-btn{padding:11px 22px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;white-space:nowrap;}
        .add-btn:hover{transform:translateY(-2px);}

        .form-card{background:white;border-radius:16px;padding:24px;margin-bottom:20px;box-shadow:0 4px 14px rgba(0,0,0,0.08);}
        .form-card h3{font-size:17px;color:#ff4fa3;font-weight:700;margin-bottom:18px;}
        .grid-form{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .form-group{display:flex;flex-direction:column;gap:6px;}
        .form-group.full{grid-column:1/-1;}
        .form-group label{font-weight:600;font-size:13px;color:#555;}
        .form-group input,.form-group select,.form-group textarea{padding:11px 14px;border-radius:10px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;font-family:"Segoe UI",sans-serif;resize:vertical;}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#ff4fa3;}
        .form-actions{display:flex;gap:12px;}
        .submit-btn{padding:11px 24px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;}
        .submit-btn:hover:not(:disabled){opacity:0.9;}
        .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .cancel-btn{padding:11px 24px;border-radius:25px;border:2px solid #ddd;background:white;color:#666;font-weight:600;cursor:pointer;font-size:14px;}

        .subj-filter{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:18px;}
        .subj-pill{padding:6px 14px;border-radius:20px;border:2px solid #eee;background:white;color:#666;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
        .subj-pill.active{border-color:#4facfe;color:#4facfe;}

        .records-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
        .record-card{background:white;border-radius:14px;padding:20px;box-shadow:0 4px 12px rgba(0,0,0,0.07);display:flex;flex-direction:column;gap:10px;transition:transform 0.2s;}
        .record-card:hover{transform:translateY(-3px);}
        .rec-top{display:flex;justify-content:space-between;align-items:flex-start;}
        .subj-tag{display:inline-block;padding:3px 12px;border-radius:20px;color:white;font-size:12px;font-weight:700;}
        .grade-badge{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:15px;flex-shrink:0;}
        .rec-date{font-size:12px;color:#aaa;}
        .rec-desc{font-size:13px;color:#555;line-height:1.6;flex:1;}
        .action-row{display:flex;gap:8px;margin-top:4px;}
        .btn-edit{padding:6px 14px;border-radius:20px;border:2px solid #ff7eb3;background:white;color:#ff4fa3;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-del{padding:6px 14px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{grid-column:1/-1;text-align:center;padding:48px;color:#aaa;font-size:15px;background:white;border-radius:14px;line-height:1.7;}

        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card{background:white;border-radius:20px;padding:36px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
        .modal-card h2{font-size:22px;color:#ff4fa3;margin-bottom:14px;}
        .modal-card p{color:#666;margin-bottom:24px;line-height:1.6;}
        .modal-actions{display:flex;gap:14px;justify-content:center;}

        @media(max-width:768px){.admin-body{padding:20px;}.main-layout{flex-direction:column;}.left-panel{width:100%;}.class-tabs{flex-direction:row;}.grid-form{grid-template-columns:1fr;}.form-group.full{grid-column:1;}}
      `}</style>
    </div>
  );
};
export default ProgressTracking;

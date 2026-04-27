import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PrintButton from "../../components/PrintButton";
import { attendanceAPI, studentAPI } from "../../services/api";

const today = new Date().toISOString().split("T")[0];

const TeacherAttendance = () => {
  const [students, setStudents]         = useState([]);
  const [allStudents, setAllStudents]   = useState([]);
  const [attendance, setAttendance]     = useState({});
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState("All");
  const [pastRecords, setPastRecords]   = useState([]);
  const [viewRecord, setViewRecord]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => { fetchStudents(); fetchPastRecords(); }, []);

  // Filter displayed students by class
  useEffect(() => {
    if (selectedClass === "All") setStudents(allStudents);
    else setStudents(allStudents.filter(s => s.className === selectedClass));
  }, [selectedClass, allStudents]);

  useEffect(() => { if (allStudents.length > 0) loadAttendanceForDate(selectedDate); }, [selectedDate, allStudents]);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getAll();
      setAllStudents(data);
      setStudents(data);
      // Default all to "Present"
      const init = {};
      data.forEach(s => { init[s._id] = "Present"; });
      setAttendance(init);
    } catch (err) { setError("Could not load students: " + err.message); }
    finally { setLoading(false); }
  };

  const fetchPastRecords = async () => {
    try { const data = await attendanceAPI.getAll(); setPastRecords(data); } catch {}
  };

  const loadAttendanceForDate = async (date) => {
    if (allStudents.length === 0) return;
    try {
      const data = await attendanceAPI.getByDate(date);
      const mapped = {};
      allStudents.forEach(s => { mapped[s._id] = "Present"; });
      data.records.forEach(r => { const sid = r.studentId?._id || r.studentId; mapped[sid] = r.status; });
      setAttendance(mapped);
    } catch {
      const init = {};
      allStudents.forEach(s => { init[s._id] = "Present"; });
      setAttendance(init);
    }
  };

  const setAll = (status) => {
    const u = {};
    students.forEach(s => { u[s._id] = status; });
    setAttendance(prev => ({ ...prev, ...u }));
  };

  const handleSave = async () => {
    try {
      setSaving(true); setError("");
      // Save all students (not just filtered)
      const records = allStudents.map(s => ({ studentId: s._id, status: attendance[s._id] || "Present" }));
      await attendanceAPI.save(selectedDate, records);
      setSaved(true); setTimeout(() => setSaved(false), 3000); fetchPastRecords();
    } catch (err) { setError("Failed to save: " + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try { await attendanceAPI.delete(id); fetchPastRecords(); setViewRecord(null); }
    catch (err) { setError("Delete failed: " + err.message); }
  };

  const visiblePresent = students.filter(s => attendance[s._id] === "Present").length;
  const visibleAbsent  = students.filter(s => attendance[s._id] === "Absent").length;
  const visibleLate    = students.filter(s => attendance[s._id] === "Late").length;

  return (
    <div className="admin-page">
      <Navbar currentPage="Attendance" mode="teacher" />
      <div className="admin-body">
        <div className="page-header">
          <div><h1>✅ Attendance Management</h1><p>Mark and review daily student attendance</p></div>
          <div className="header-btns">
            <PrintButton printAreaId="print-area" title={`Attendance Report — ${selectedDate}`} />
            <input type="date" className="date-picker" value={selectedDate} max={today}
              onChange={e => { setSelectedDate(e.target.value); setSaved(false); }} />
          </div>
        </div>

        {error && <div className="banner error-banner">❌ {error}</div>}
        {saved && <div className="banner success-banner">✅ Attendance saved for {selectedDate}!</div>}

        {/* Class selector */}
        <div className="class-select-row no-print">
          <span style={{fontWeight:600,color:"#555"}}>Filter by Class:</span>
          {["All","Class A","Class B","Class C"].map(cls => (
            <button key={cls}
              className={`class-tab ${selectedClass === cls ? "active" : ""}`}
              onClick={() => setSelectedClass(cls)}>
              {cls}
            </button>
          ))}
        </div>

        {loading ? <div className="loading-box">⏳ Loading students...</div> : (
          <>
            <div className="att-summary">
              <div className="sum-card green"><span className="sum-num">{visiblePresent}</span><span>Present</span></div>
              <div className="sum-card red"><span className="sum-num">{visibleAbsent}</span><span>Absent</span></div>
              <div className="sum-card amber"><span className="sum-num">{visibleLate}</span><span>Late</span></div>
              <div className="sum-card blue"><span className="sum-num">{students.length}</span><span>Showing</span></div>
              <div className="sum-card purple"><span className="sum-num">{allStudents.length}</span><span>Total</span></div>
            </div>

            <div className="bulk-row no-print">
              <span style={{fontWeight:600,color:"#555"}}>Mark All ({selectedClass}):</span>
              <button className="bulk-btn green" onClick={() => setAll("Present")}>✅ Present</button>
              <button className="bulk-btn red"   onClick={() => setAll("Absent")}>❌ Absent</button>
              <button className="bulk-btn amber" onClick={() => setAll("Late")}>⏰ Late</button>
            </div>

            <div id="print-area">
              <p style={{marginBottom:12,color:"#888",fontSize:13}}>
                Date: <strong>{selectedDate}</strong> &nbsp;|&nbsp;
                Class: <strong>{selectedClass}</strong> &nbsp;|&nbsp;
                Present: <strong style={{color:"#16a34a"}}>{visiblePresent}</strong> &nbsp;|&nbsp;
                Absent: <strong style={{color:"#dc2626"}}>{visibleAbsent}</strong> &nbsp;|&nbsp;
                Late: <strong style={{color:"#b45309"}}>{visibleLate}</strong>
              </p>
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Student ID</th><th>Name</th><th>Class</th><th>Status</th><th className="no-print">Quick Mark</th></tr></thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan="5" className="no-data">No students in {selectedClass === "All" ? "any class" : selectedClass}.</td></tr>
                    ) : students.map(s => (
                      <tr key={s._id}>
                        <td><span className="id-badge">{s.studentId}</span></td>
                        <td><strong>{s.name}</strong></td>
                        <td><span className="class-badge" style={{background: s.className==="Class A"?"#4facfe":s.className==="Class B"?"#a78bfa":"#34d399"}}>{s.className || "—"}</span></td>
                        <td><span className={`status-pill ${attendance[s._id]==="Present"?"active":attendance[s._id]==="Late"?"late":"inactive"}`}>{attendance[s._id]||"Present"}</span></td>
                        <td className="no-print">
                          <div className="att-btn-row">
                            {["Present","Absent","Late"].map(opt => (
                              <button key={opt} className={`att-opt ${attendance[s._id]===opt?"selected-"+opt.toLowerCase():""}`}
                                onClick={() => setAttendance(prev => ({...prev,[s._id]:opt}))}>
                                {opt==="Present"?"✅":opt==="Absent"?"❌":"⏰"} {opt}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="save-row no-print">
              <button className="submit-btn" onClick={handleSave} disabled={saving}>
                {saving ? "⏳ Saving..." : `💾 Save Attendance for ${selectedDate}`}
              </button>
            </div>
          </>
        )}

        <div className="past-section">
          <h2>📋 Saved Attendance Records ({pastRecords.length})</h2>
          {pastRecords.length === 0 ? <p style={{color:"#aaa",marginTop:12}}>No records saved yet.</p> : (
            <div className="past-dates">
              {pastRecords.map(rec => {
                const dateStr = new Date(rec.date).toISOString().split("T")[0];
                const presentCount = rec.records.filter(r => r.status === "Present").length;
                return (
                  <div key={rec._id} className={`past-date-card ${viewRecord?._id===rec._id?"active":""}`}
                    onClick={() => setViewRecord(viewRecord?._id===rec._id?null:rec)}>
                    <p className="past-date-label">{dateStr}</p>
                    <p className="past-date-sub">{presentCount}/{rec.records.length} present</p>
                  </div>
                );
              })}
            </div>
          )}

          {viewRecord && (
            <div className="table-wrap" style={{marginTop:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 16px 0"}}>
                <h3 style={{color:"#ff4fa3"}}>Record: {new Date(viewRecord.date).toISOString().split("T")[0]}</h3>
                <button className="btn-del" onClick={() => handleDelete(viewRecord._id)}>🗑 Delete</button>
              </div>
              <table className="data-table">
                <thead><tr><th>Student ID</th><th>Name</th><th>Class</th><th>Status</th></tr></thead>
                <tbody>
                  {viewRecord.records.map((r,i) => (
                    <tr key={i}>
                      <td><span className="id-badge">{r.studentId?.studentId||"—"}</span></td>
                      <td>{r.studentId?.name||"—"}</td>
                      <td>{r.studentId?.className || "—"}</td>
                      <td><span className={`status-pill ${r.status==="Present"?"active":r.status==="Late"?"late":"inactive"}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        .admin-page{background:#f4f6f9;min-height:100vh;} .admin-body{padding:40px;max-width:1200px;margin:auto;}
        .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap;gap:16px;}
        .page-header h1{font-size:30px;color:#ff4fa3;margin-bottom:5px;} .page-header p{color:#888;font-size:15px;}
        .header-btns{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
        .date-picker{padding:11px 16px;border-radius:12px;border:2px solid #eee;font-size:15px;outline:none;background:white;box-shadow:0 2px 8px rgba(0,0,0,0.08);cursor:pointer;}
        .date-picker:focus{border-color:#ff4fa3;}
        .banner{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600;font-size:15px;}
        .success-banner{background:#dcfce7;border:1px solid #86efac;color:#15803d;} .error-banner{background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;}
        .loading-box{text-align:center;padding:60px;color:#888;font-size:18px;background:white;border-radius:16px;}
        .class-select-row{display:flex;align-items:center;gap:10px;margin-bottom:22px;flex-wrap:wrap;}
        .class-tab{padding:8px 20px;border-radius:20px;border:2px solid #eee;background:white;color:#666;font-weight:600;font-size:13px;cursor:pointer;transition:all 0.2s;}
        .class-tab.active{background:linear-gradient(90deg,#4facfe,#ff7eb3);border-color:transparent;color:white;}
        .att-summary{display:flex;gap:18px;margin-bottom:24px;flex-wrap:wrap;}
        .sum-card{background:white;border-radius:14px;padding:20px 28px;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(0,0,0,0.08);flex:1;min-width:100px;font-size:14px;font-weight:600;color:#666;}
        .sum-card.green{border-top:4px solid #34d399;} .sum-card.red{border-top:4px solid #f87171;} .sum-card.amber{border-top:4px solid #f59e0b;} .sum-card.blue{border-top:4px solid #4facfe;} .sum-card.purple{border-top:4px solid #a78bfa;}
        .sum-num{font-size:32px;font-weight:800;color:#333;}
        .bulk-row{display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;}
        .bulk-btn{padding:8px 18px;border-radius:20px;border:none;font-weight:600;font-size:13px;cursor:pointer;transition:transform 0.15s;}
        .bulk-btn.green{background:#dcfce7;color:#15803d;} .bulk-btn.red{background:#fee2e2;color:#dc2626;} .bulk-btn.amber{background:#fef9c3;color:#854d0e;}
        .table-wrap{background:white;border-radius:18px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;} .data-table thead{background:linear-gradient(90deg,#4facfe,#ff7eb3);}
        .data-table th{padding:14px 16px;color:white;font-size:13px;text-align:left;}
        .data-table td{padding:13px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#444;}
        .data-table tr:last-child td{border-bottom:none;} .data-table tr:hover td{background:#fdf4f9;}
        .id-badge{background:#f0f4ff;color:#4facfe;padding:3px 10px;border-radius:8px;font-weight:700;font-size:12px;}
        .class-badge{padding:3px 10px;border-radius:20px;color:white;font-size:11px;font-weight:700;}
        .status-pill{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
        .status-pill.active{background:#dcfce7;color:#16a34a;} .status-pill.inactive{background:#fee2e2;color:#dc2626;} .status-pill.late{background:#fef9c3;color:#854d0e;}
        .att-btn-row{display:flex;gap:8px;flex-wrap:wrap;}
        .att-opt{padding:6px 14px;border-radius:20px;border:2px solid #eee;background:white;color:#666;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
        .att-opt.selected-present{background:#dcfce7;border-color:#34d399;color:#15803d;}
        .att-opt.selected-absent{background:#fee2e2;border-color:#f87171;color:#dc2626;}
        .att-opt.selected-late{background:#fef9c3;border-color:#f59e0b;color:#854d0e;}
        .no-data{text-align:center;padding:40px;color:#aaa;font-size:16px;}
        .save-row{margin:24px 0;}
        .submit-btn{padding:14px 32px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:15px;transition:transform 0.2s;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);} .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .past-section{margin-top:40px;} .past-section h2{font-size:22px;color:#ff4fa3;margin-bottom:16px;}
        .past-dates{display:flex;gap:14px;flex-wrap:wrap;}
        .past-date-card{padding:14px 20px;background:white;border-radius:14px;border:2px solid #eee;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.06);min-width:130px;text-align:center;}
        .past-date-card:hover,.past-date-card.active{border-color:#ff4fa3;box-shadow:0 4px 16px rgba(255,79,163,0.15);}
        .past-date-label{font-weight:700;color:#333;font-size:14px;} .past-date-sub{font-size:12px;color:#888;margin-top:4px;}
        .btn-del{padding:8px 16px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:13px;font-weight:600;cursor:pointer;}
        @media(max-width:768px){.admin-body{padding:20px;}}
      `}</style>
    </div>
  );
};
export default TeacherAttendance;

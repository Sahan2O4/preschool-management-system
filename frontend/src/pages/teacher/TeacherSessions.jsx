import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PrintButton from "../../components/PrintButton";
import { sessionAPI } from "../../services/api";

const subjects = ["English","Mathematics","Science","Arts & Crafts","Music","Physical Education"];
const teachers = ["Mrs. Sumithra Sajeewanee","Mrs. Rasika Dulmini","Miss Nirusha Subhashinie","Mrs. Lasanthi Lakmali","Mrs. Diana Lakmali","Mrs. Thushari Samanthika"];
const levels   = ["Beginner","Intermediate","Advanced","All Levels"];
const subjectColors = { English:"#4facfe",Mathematics:"#ff7eb3",Science:"#34d399","Arts & Crafts":"#f59e0b",Music:"#a78bfa","Physical Education":"#f87171" };
const blank = { title:"",subject:subjects[0],teacher:teachers[0],date:"",time:"",duration:"45",level:"All Levels",description:"",spots:"15" };

const TeacherSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [form, setForm]         = useState(blank);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewSess, setViewSess] = useState(null);
  const [filterSubj, setFilterSubj] = useState("All");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchSessions(); }, []);
  const fetchSessions = async () => { try { setLoading(true); const d = await sessionAPI.getAll(); setSessions(d); } catch { setError("Could not load sessions."); } finally { setLoading(false); } };
  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const payload = {...form,spots:Number(form.spots),duration:Number(form.duration)};
      if (editId) { await sessionAPI.update(editId,payload); flash("✅ Session updated."); setEditId(null); }
      else { await sessionAPI.create(payload); flash("✅ Session created."); }
      setForm(blank); setShowForm(false); fetchSessions();
    } catch (err) { setError("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (s) => {
    setForm({ title:s.title,subject:s.subject,teacher:s.teacher,date:s.date?.split("T")[0]||s.date,time:s.time,duration:String(s.duration),level:s.level,description:s.description,spots:String(s.spots) });
    setEditId(s._id); setShowForm(true); setViewSess(null);
  };

  const handleDelete = async (id) => {
    try { await sessionAPI.delete(id); flash("✅ Session deleted."); setDeleteId(null); setViewSess(null); fetchSessions(); }
    catch { setError("Delete failed."); }
  };

  const filtered = filterSubj==="All" ? sessions : sessions.filter(s => s.subject===filterSubj);

  return (
    <div className="admin-page">
      <Navbar currentPage="Sessions" mode="teacher" />
      <div className="admin-body">
        <div className="page-header">
          <div><h1>🎓 Session Management</h1><p>Create and manage interactive learning sessions</p></div>
          <div className="header-btns">
            <PrintButton printAreaId="print-area" title="Learning Sessions Report" />
            <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(blank); }}>{showForm?"✕ Cancel":"+ Add Session"}</button>
          </div>
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        {showForm && (
          <div className="form-card">
            <h2>{editId?"Edit Session":"Add New Session"}</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <div className="form-group full"><label>Session Title *</label><input required type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Session title" /></div>
              <div className="form-group"><label>Subject *</label><select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>{subjects.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label>Teacher *</label><select value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})}>{teachers.map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="form-group"><label>Date *</label><input required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
              <div className="form-group"><label>Time *</label><input required type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} /></div>
              <div className="form-group"><label>Duration (min) *</label><input required type="number" min="15" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} /></div>
              <div className="form-group"><label>Level</label><select value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>{levels.map(l=><option key={l}>{l}</option>)}</select></div>
              <div className="form-group"><label>Total Spots *</label><input required type="number" min="1" value={form.spots} onChange={e=>setForm({...form,spots:e.target.value})} /></div>
              <div className="form-group full"><label>Description *</label><textarea required rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Session details..." /></div>
              <div className="form-actions full">
                <button type="submit" className="submit-btn" disabled={saving}>{saving?"Saving...":editId?"Update Session":"Create Session"}</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="filter-row no-print">
          {["All",...subjects].map(s => <button key={s} className={`filter-btn ${filterSubj===s?"active":""}`} onClick={() => setFilterSubj(s)}>{s}</button>)}
        </div>

        {loading ? <div className="loading-box">⏳ Loading sessions...</div> : (
          <div id="print-area">
            <p style={{marginBottom:14,color:"#888",fontSize:13}}>Total sessions: <strong>{filtered.length}</strong> &nbsp;|&nbsp; Printed: <strong>{new Date().toLocaleDateString("en-LK")}</strong></p>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Title</th><th>Subject</th><th>Teacher</th><th>Date</th><th>Time</th><th>Duration</th><th>Level</th><th>Spots</th><th className="no-print">Actions</th></tr></thead>
                <tbody>
                  {filtered.length===0 ? <tr><td colSpan="9" className="no-data">{sessions.length===0?"No sessions yet.":"No sessions in this subject."}</td></tr>
                  : filtered.map(s => (
                    <tr key={s._id}>
                      <td><strong>{s.title}</strong></td>
                      <td><span className="subj-tag" style={{background:subjectColors[s.subject]||"#aaa",color:"white"}}>{s.subject}</span></td>
                      <td>{s.teacher}</td>
                      <td>{new Date(s.date).toLocaleDateString("en-LK",{day:"numeric",month:"short",year:"numeric"})}</td>
                      <td>{s.time}</td>
                      <td>{s.duration} min</td>
                      <td>{s.level}</td>
                      <td>{s.enrolled}/{s.spots}</td>
                      <td className="no-print">
                        <div className="action-row">
                          <button className="btn-view" onClick={() => { setViewSess(s); setShowForm(false); }}>View</button>
                          <button className="btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                          <button className="btn-del"  onClick={() => setDeleteId(s._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewSess && (
          <div className="modal-overlay" onClick={() => setViewSess(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setViewSess(null)}>✕</button>
              <div className="subj-tag" style={{background:subjectColors[viewSess.subject]||"#aaa",color:"white",marginBottom:12}}>{viewSess.subject}</div>
              <h2>{viewSess.title}</h2>
              <div className="modal-grid">
                <div><strong>Teacher</strong><p>{viewSess.teacher}</p></div>
                <div><strong>Level</strong><p>{viewSess.level}</p></div>
                <div><strong>Date</strong><p>{new Date(viewSess.date).toLocaleDateString("en-LK")}</p></div>
                <div><strong>Time</strong><p>{viewSess.time}</p></div>
                <div><strong>Duration</strong><p>{viewSess.duration} minutes</p></div>
                <div><strong>Enrolment</strong><p>{viewSess.enrolled}/{viewSess.spots} spots</p></div>
                <div className="full"><strong>Description</strong><p>{viewSess.description}</p></div>
              </div>
              <div className="modal-actions">
                <button className="btn-edit" onClick={() => handleEdit(viewSess)}>Edit</button>
                <button className="btn-del"  onClick={() => setDeleteId(viewSess._id)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card small" onClick={e => e.stopPropagation()}>
              <h2>⚠️ Delete Session?</h2><p>This cannot be undone.</p>
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
        .add-btn{padding:12px 26px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:15px;transition:transform 0.2s;} .add-btn:hover{transform:translateY(-2px);}
        .banner{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600;font-size:15px;}
        .success-banner{background:#dcfce7;border:1px solid #86efac;color:#15803d;} .error-banner{background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;}
        .loading-box{text-align:center;padding:60px;color:#888;font-size:18px;background:white;border-radius:16px;}
        .form-card{background:white;border-radius:18px;padding:28px;margin-bottom:26px;box-shadow:0 6px 20px rgba(0,0,0,0.1);}
        .form-card h2{font-size:20px;color:#ff4fa3;margin-bottom:18px;}
        .grid-form{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .form-group{display:flex;flex-direction:column;gap:6px;} .form-group.full{grid-column:1/-1;}
        .form-group label{font-weight:600;font-size:13px;color:#555;}
        .form-group input,.form-group select,.form-group textarea{padding:11px 14px;border-radius:10px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;font-family:"Segoe UI",sans-serif;resize:vertical;}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#ff4fa3;}
        .form-actions{display:flex;gap:14px;}
        .submit-btn{padding:12px 28px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;} .submit-btn:hover:not(:disabled){transform:translateY(-2px);} .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .cancel-btn{padding:12px 28px;border-radius:25px;border:2px solid #ddd;background:white;color:#666;font-weight:600;cursor:pointer;font-size:14px;}
        .filter-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;}
        .filter-btn{padding:9px 18px;border-radius:25px;border:2px solid #ff4fa3;background:white;color:#ff4fa3;font-weight:600;cursor:pointer;transition:all 0.2s;font-size:13px;}
        .filter-btn.active,.filter-btn:hover{background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;border-color:transparent;}
        .table-wrap{background:white;border-radius:18px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;} .data-table thead{background:linear-gradient(90deg,#4facfe,#ff7eb3);}
        .data-table th{padding:13px 16px;color:white;font-size:13px;text-align:left;white-space:nowrap;}
        .data-table td{padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#444;}
        .data-table tr:last-child td{border-bottom:none;} .data-table tr:hover td{background:#fdf4f9;}
        .subj-tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
        .action-row{display:flex;gap:8px;}
        .btn-view{padding:6px 12px;border-radius:20px;border:2px solid #4facfe;background:white;color:#4facfe;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-edit{padding:6px 12px;border-radius:20px;border:2px solid #ff7eb3;background:white;color:#ff4fa3;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-del{padding:6px 12px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{text-align:center;padding:40px;color:#aaa;font-size:16px;}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card{background:white;border-radius:20px;padding:36px;max-width:580px;width:100%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:90vh;overflow-y:auto;}
        .modal-card.small{max-width:360px;text-align:center;} .modal-card.small p{color:#666;margin:14px 0 24px;line-height:1.6;}
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
export default TeacherSessions;

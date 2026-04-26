import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PrintButton from "../../components/PrintButton";
import { eventAPI } from "../../services/api";

const today = new Date().toISOString().split("T")[0];


const categories = ["Sports","Arts","Academic","Cultural","Other"];
const categoryColors = { Sports:"#4facfe",Arts:"#ff7eb3",Academic:"#a78bfa",Cultural:"#34d399",Other:"#f59e0b" };
const blank = { title:"",date:"",time:"",location:"",category:"Sports",description:"",organizer:"" };

const EventManagement = () => {
  const [events, setEvents]   = useState([]);
  const [form, setForm]       = useState(blank);
  const [editId, setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewEvent, setViewEvent] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchEvents(); }, []);
  const fetchEvents = async () => { try { setLoading(true); const d = await eventAPI.getAll(); setEvents(d); } catch { setError("Could not load events."); } finally { setLoading(false); } };
  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      if (editId) { await eventAPI.update(editId,form); flash("✅ Event updated."); setEditId(null); }
      else { await eventAPI.create(form); flash("✅ Event created."); }
      setForm(blank); setShowForm(false); fetchEvents();
    } catch (err) { setError("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (ev) => {
    setForm({ title:ev.title, date:ev.date?.split("T")[0]||ev.date, time:ev.time, location:ev.location, category:ev.category, description:ev.description, organizer:ev.organizer });
    setEditId(ev._id); setShowForm(true); setViewEvent(null);
  };

  const handleDelete = async (id) => {
    try { await eventAPI.delete(id); flash("✅ Event deleted."); setDeleteId(null); setViewEvent(null); fetchEvents(); }
    catch (err) { setError("Delete failed: " + err.message); }
  };

  const filtered = filterCat==="All" ? events : events.filter(e => e.category===filterCat);

  return (
    <div className="admin-page">
      <Navbar currentPage="Events" mode="admin" />
      <div className="admin-body">
        <div className="page-header">
          <div><h1>📅 Event Management</h1><p>Create and manage all school events</p></div>
          <div className="header-btns">
            <PrintButton printAreaId="print-area" title="School Events Report" />
            <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(blank); }}>{showForm?"✕ Cancel":"+ Add Event"}</button>
          </div>
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        {showForm && (
          <div className="form-card">
            <h2>{editId?"Edit Event":"Add New Event"}</h2>
            <form onSubmit={handleSubmit} className="grid-form">
              <div className="form-group full"><label>Event Title *</label><input required type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Event name" /></div>
              <div className="form-group"><label>Date *</label><input required type="date" min={today} value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
              <div className="form-group"><label>Time *</label><input required type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} /></div>
              <div className="form-group"><label>Location *</label><input required type="text" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Venue" /></div>
              <div className="form-group"><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="form-group"><label>Organizer *</label><input required type="text" value={form.organizer} onChange={e=>setForm({...form,organizer:e.target.value})} placeholder="Organizer name" /></div>
              <div className="form-group full"><label>Description *</label><textarea required rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Event details..." /></div>
              <div className="form-actions full">
                <button type="submit" className="submit-btn" disabled={saving}>{saving?"Saving...":editId?"Update Event":"Create Event"}</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="filter-row no-print">
          {["All",...categories].map(c => <button key={c} className={`filter-btn ${filterCat===c?"active":""}`} onClick={() => setFilterCat(c)}>{c}</button>)}
        </div>

        {loading ? <div className="loading-box">⏳ Loading events...</div> : (
          <div id="print-area">
            <p style={{marginBottom:14,color:"#888",fontSize:13}}>Total events: <strong>{filtered.length}</strong> &nbsp;|&nbsp; Printed: <strong>{new Date().toLocaleDateString("en-LK")}</strong></p>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Time</th><th>Location</th><th>Organizer</th><th className="no-print">Actions</th></tr></thead>
                <tbody>
                  {filtered.length===0 ? <tr><td colSpan="7" className="no-data">{events.length===0?"No events yet.":"No events in this category."}</td></tr>
                  : filtered.map(ev => (
                    <tr key={ev._id}>
                      <td><strong>{ev.title}</strong></td>
                      <td><span className="cat-tag" style={{background:categoryColors[ev.category]||"#aaa",color:"white"}}>{ev.category}</span></td>
                      <td>{new Date(ev.date).toLocaleDateString("en-LK",{day:"numeric",month:"short",year:"numeric"})}</td>
                      <td>{ev.time}</td>
                      <td>{ev.location}</td>
                      <td>{ev.organizer}</td>
                      <td className="no-print">
                        <div className="action-row">
                          <button className="btn-view" onClick={() => { setViewEvent(ev); setShowForm(false); }}>View</button>
                          <button className="btn-edit" onClick={() => handleEdit(ev)}>Edit</button>
                          <button className="btn-del"  onClick={() => setDeleteId(ev._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewEvent && (
          <div className="modal-overlay" onClick={() => setViewEvent(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setViewEvent(null)}>✕</button>
              <div className="cat-tag" style={{background:categoryColors[viewEvent.category]||"#aaa",color:"white",marginBottom:12}}>{viewEvent.category}</div>
              <h2>{viewEvent.title}</h2>
              <div className="modal-grid">
                <div><strong>Date</strong><p>{new Date(viewEvent.date).toLocaleDateString("en-LK",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p></div>
                <div><strong>Time</strong><p>{viewEvent.time}</p></div>
                <div><strong>Location</strong><p>{viewEvent.location}</p></div>
                <div><strong>Organizer</strong><p>{viewEvent.organizer}</p></div>
                <div className="full"><strong>Description</strong><p>{viewEvent.description}</p></div>
              </div>
              <div className="modal-actions">
                <button className="btn-edit" onClick={() => handleEdit(viewEvent)}>Edit</button>
                <button className="btn-del"  onClick={() => setDeleteId(viewEvent._id)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card small" onClick={e => e.stopPropagation()}>
              <h2>⚠️ Delete Event?</h2><p>This cannot be undone.</p>
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
        .form-card{background:white;border-radius:18px;padding:30px;margin-bottom:28px;box-shadow:0 6px 20px rgba(0,0,0,0.1);}
        .form-card h2{font-size:20px;color:#ff4fa3;margin-bottom:20px;}
        .grid-form{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .form-group{display:flex;flex-direction:column;gap:6px;} .form-group.full{grid-column:1/-1;}
        .form-group label{font-weight:600;font-size:13px;color:#555;}
        .form-group input,.form-group select,.form-group textarea{padding:11px 14px;border-radius:10px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;font-family:"Segoe UI",sans-serif;resize:vertical;}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#ff4fa3;}
        .form-actions{display:flex;gap:14px;}
        .submit-btn{padding:12px 28px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;} .submit-btn:hover:not(:disabled){transform:translateY(-2px);} .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .cancel-btn{padding:12px 28px;border-radius:25px;border:2px solid #ddd;background:white;color:#666;font-weight:600;cursor:pointer;font-size:14px;}
        .filter-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;}
        .filter-btn{padding:9px 20px;border-radius:25px;border:2px solid #ff4fa3;background:white;color:#ff4fa3;font-weight:600;cursor:pointer;transition:all 0.2s;font-size:13px;}
        .filter-btn.active,.filter-btn:hover{background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;border-color:transparent;}
        .table-wrap{background:white;border-radius:18px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;} .data-table thead{background:linear-gradient(90deg,#4facfe,#ff7eb3);}
        .data-table th{padding:13px 16px;color:white;font-size:13px;text-align:left;white-space:nowrap;}
        .data-table td{padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#444;}
        .data-table tr:last-child td{border-bottom:none;} .data-table tr:hover td{background:#fdf4f9;}
        .cat-tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
        .action-row{display:flex;gap:8px;}
        .btn-view{padding:6px 12px;border-radius:20px;border:2px solid #4facfe;background:white;color:#4facfe;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-edit{padding:6px 12px;border-radius:20px;border:2px solid #ff7eb3;background:white;color:#ff4fa3;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-del{padding:6px 12px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{text-align:center;padding:40px;color:#aaa;font-size:16px;}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card{background:white;border-radius:20px;padding:36px;max-width:600px;width:100%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:90vh;overflow-y:auto;}
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
export default EventManagement;

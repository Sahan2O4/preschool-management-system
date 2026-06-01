import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PrintButton from "../../components/PrintButton";
import { feedbackAPI } from "../../services/api";

const typeColors = { "General Inquiry":"#4facfe","Feedback":"#34d399","Admission Inquiry":"#a78bfa","Complaint":"#f87171","Suggestion":"#f59e0b" };

const TeacherFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter]       = useState("All");
  const [viewItem, setViewItem]   = useState(null);
  const [replyText, setReplyText] = useState("");
  const [deleteId, setDeleteId]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchFeedbacks(); }, []);
  const fetchFeedbacks = async () => { try { setLoading(true); const d = await feedbackAPI.getAll(); setFeedbacks(d); } catch { setError("Could not load feedback."); } finally { setLoading(false); } };
  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  const handleRespond = async (id) => {
    if (!replyText.trim()) return; setSaving(true);
    try {
      const updated = await feedbackAPI.update(id,{status:"Responded",response:replyText});
      setFeedbacks(prev => prev.map(f => f._id===id?updated:f));
      setViewItem(updated); setReplyText(""); flash("✅ Response saved.");
    } catch { setError("Could not save response."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await feedbackAPI.delete(id); setFeedbacks(prev => prev.filter(f => f._id!==id)); setDeleteId(null); setViewItem(null); flash("✅ Deleted."); }
    catch { setError("Delete failed."); }
  };

  const filtered = filter==="All" ? feedbacks : feedbacks.filter(f => f.status===filter);
  const pendingCount = feedbacks.filter(f => f.status==="Pending").length;
  const respondedCount = feedbacks.filter(f => f.status==="Responded").length;

  return (
    <div className="admin-page">
      <Navbar currentPage="Feedback" mode="teacher" />
      <div className="admin-body">
        <div className="page-header">
          <div><h1>💬 Feedback & Inquiries</h1><p>Review and respond to all parent messages</p></div>
          <div className="header-btns">
            <PrintButton
              printAreaId="print-area"
              title="Feedback & Inquiries Report"
              metaLines={[
                `Current filter: ${filter}`,
                `Visible records: ${filtered.length}`,
                `Pending: ${pendingCount}`,
                `Responded: ${respondedCount}`,
              ]}
            />
            {pendingCount>0 && <div className="pending-badge">⚠️ {pendingCount} pending</div>}
          </div>
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        <div className="filter-row no-print">
          {["All","Pending","Responded"].map(f => (
            <button key={f} className={`filter-btn ${filter===f?"active":""}`} onClick={() => setFilter(f)}>
              {f} {f!=="All"&&`(${feedbacks.filter(fb=>fb.status===f).length})`}
            </button>
          ))}
        </div>

        {loading ? <div className="loading-box">⏳ Loading feedback...</div> : (
          <div id="print-area">
            <p style={{marginBottom:14,color:"#888",fontSize:13}}>Total: <strong>{filtered.length}</strong> &nbsp;|&nbsp; Pending: <strong style={{color:"#b45309"}}>{pendingCount}</strong> &nbsp;|&nbsp; Printed: <strong>{new Date().toLocaleDateString("en-LK")}</strong></p>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Type</th><th>Message</th><th>Student</th><th>Date</th><th>Status</th><th className="no-print">Actions</th></tr></thead>
                <tbody>
                  {filtered.length===0 ? <tr><td colSpan="7" className="no-data">{feedbacks.length===0?"No feedback yet.":"No feedback in this category."}</td></tr>
                  : filtered.map(fb => (
                    <tr key={fb._id}>
                      <td><strong>{fb.name}</strong><br/><small style={{color:"#888"}}>{fb.email}</small></td>
                      <td><span className="cat-tag" style={{background:typeColors[fb.type]||"#aaa",color:"white"}}>{fb.type}</span></td>
                      <td style={{maxWidth:220}}><span style={{fontSize:13,color:"#555"}}>{fb.message.substring(0,80)}{fb.message.length>80?"...":""}</span></td>
                      <td>{fb.studentName||"—"}</td>
                      <td>{new Date(fb.createdAt).toLocaleDateString("en-LK")}</td>
                      <td><span className={`status-pill ${fb.status==="Pending"?"inactive":"active"}`}>{fb.status}</span></td>
                      <td className="no-print">
                        <div className="action-row">
                          <button className="btn-view" onClick={() => { setViewItem(fb); setReplyText(fb.response||""); }}>Reply</button>
                          <button className="btn-del"  onClick={() => setDeleteId(fb._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewItem && (
          <div className="modal-overlay" onClick={() => setViewItem(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setViewItem(null)}>✕</button>
              <div className="cat-tag" style={{background:typeColors[viewItem.type]||"#aaa",color:"white",marginBottom:14}}>{viewItem.type}</div>
              <h2>{viewItem.name}</h2>
              <div className="modal-meta"><span>📧 {viewItem.email}</span><span>📞 {viewItem.phone}</span>{viewItem.studentName&&<span>👦 {viewItem.studentName}</span>}</div>
              <div className="msg-box-display"><strong>Message:</strong><p>{viewItem.message}</p></div>
              {viewItem.status==="Responded" ? (
                <div className="resp-box"><strong>✅ Response:</strong><p>{viewItem.response}</p></div>
              ) : (
                <div className="reply-area">
                  <label><strong>Write a Response:</strong></label>
                  <textarea rows="4" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your response..." />
                  <button className="submit-btn" onClick={() => handleRespond(viewItem._id)} disabled={saving}>{saving?"Saving...":"Send Response"}</button>
                </div>
              )}
              <div className="modal-actions" style={{marginTop:20}}>
                <button className="btn-del" onClick={() => setDeleteId(viewItem._id)}>Delete</button>
                <button className="cancel-btn" onClick={() => setViewItem(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card small" onClick={e => e.stopPropagation()}>
              <h2>⚠️ Delete?</h2><p>This will permanently remove this feedback.</p>
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
        .admin-page{background:#f4f6f9;min-height:100vh;} .admin-body{padding:40px;max-width:1200px;margin:auto;}
        .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap;gap:16px;}
        .page-header h1{font-size:30px;color:#ff4fa3;margin-bottom:5px;} .page-header p{color:#888;font-size:15px;}
        .header-btns{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
        .pending-badge{padding:10px 18px;background:#fff7ed;border:2px solid #f59e0b;border-radius:12px;color:#b45309;font-weight:700;font-size:13px;}
        .banner{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600;font-size:15px;}
        .success-banner{background:#dcfce7;border:1px solid #86efac;color:#15803d;} .error-banner{background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;}
        .loading-box{text-align:center;padding:60px;color:#888;font-size:18px;background:white;border-radius:16px;}
        .filter-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;}
        .filter-btn{padding:9px 20px;border-radius:25px;border:2px solid #ff4fa3;background:white;color:#ff4fa3;font-weight:600;cursor:pointer;transition:all 0.2s;font-size:13px;}
        .filter-btn.active,.filter-btn:hover{background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;border-color:transparent;}
        .table-wrap{background:white;border-radius:18px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;} .data-table thead{background:linear-gradient(90deg,#4facfe,#ff7eb3);}
        .data-table th{padding:13px 16px;color:white;font-size:13px;text-align:left;white-space:nowrap;}
        .data-table td{padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#444;vertical-align:top;}
        .data-table tr:last-child td{border-bottom:none;} .data-table tr:hover td{background:#fdf4f9;}
        .cat-tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
        .status-pill{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
        .status-pill.active{background:#dcfce7;color:#16a34a;} .status-pill.inactive{background:#fff7ed;color:#b45309;}
        .action-row{display:flex;gap:8px;}
        .btn-view{padding:6px 12px;border-radius:20px;border:2px solid #4facfe;background:white;color:#4facfe;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-del{padding:6px 12px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{text-align:center;padding:40px;color:#aaa;font-size:16px;}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card{background:white;border-radius:20px;padding:36px;max-width:600px;width:100%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:90vh;overflow-y:auto;}
        .modal-card.small{max-width:360px;text-align:center;} .modal-card.small p{color:#666;margin:14px 0 24px;line-height:1.6;}
        .modal-close{position:absolute;top:16px;right:20px;border:none;background:none;font-size:20px;cursor:pointer;color:#aaa;}
        .modal-card h2{font-size:22px;color:#ff4fa3;margin-bottom:16px;}
        .modal-meta{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:#888;margin-bottom:18px;}
        .msg-box-display{background:#f8f8f8;border-radius:12px;padding:16px;margin-bottom:18px;}
        .msg-box-display strong{font-size:13px;color:#aaa;} .msg-box-display p{font-size:15px;color:#333;line-height:1.7;margin-top:6px;}
        .resp-box{background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;}
        .resp-box strong{font-size:13px;color:#15803d;} .resp-box p{font-size:15px;color:#333;margin-top:6px;line-height:1.7;}
        .reply-area{display:flex;flex-direction:column;gap:10px;}
        .reply-area label{font-weight:600;font-size:14px;color:#444;}
        .reply-area textarea{padding:14px;border-radius:12px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;font-family:"Segoe UI",sans-serif;resize:vertical;}
        .reply-area textarea:focus{border-color:#ff4fa3;}
        .submit-btn{padding:12px 28px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);} .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .cancel-btn{padding:12px 28px;border-radius:25px;border:2px solid #ddd;background:white;color:#666;font-weight:600;cursor:pointer;font-size:14px;}
        .modal-actions{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;}
        @media(max-width:768px){.admin-body{padding:20px;}}
      `}</style>
    </div>
  );
};
export default TeacherFeedback;

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { feedbackAPI } from "../../services/api";

const typeColors = { "General Inquiry":"#4facfe","Feedback":"#34d399","Admission Inquiry":"#a78bfa","Complaint":"#f87171","Suggestion":"#f59e0b" };

const FeedbackManagement = () => {
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

  const fetchFeedbacks = async () => {
    try { setLoading(true); const data = await feedbackAPI.getAll(); setFeedbacks(data); }
    catch (err) { setError("Could not load feedback."); }
    finally { setLoading(false); }
  };

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  const handleRespond = async (id) => {
    if (!replyText.trim()) return;
    setSaving(true);
    try {
      const updated = await feedbackAPI.update(id, { status:"Responded", response: replyText });
      setFeedbacks(prev => prev.map(f => f._id === id ? updated : f));
      setViewItem(updated);
      setReplyText("");
      flash("✅ Response saved to database.");
    } catch (err) { setError("Could not save response."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await feedbackAPI.delete(id);
      setFeedbacks(prev => prev.filter(f => f._id !== id));
      setDeleteId(null); setViewItem(null);
      flash("✅ Feedback deleted from database.");
    } catch (err) { setError("Delete failed."); }
  };

  const filtered = filter === "All" ? feedbacks : feedbacks.filter(f => f.status === filter);
  const pendingCount = feedbacks.filter(f => f.status === "Pending").length;

  return (
    <div className="admin-page">
      <Navbar currentPage="Feedback" mode="admin" />
      <div className="admin-body">
        <div className="page-header">
          <div><h1>💬 Feedback & Inquiries</h1><p>Review and respond to all parent messages</p></div>
          {pendingCount > 0 && <div className="pending-badge">⚠️ {pendingCount} pending response{pendingCount !== 1 ? "s" : ""}</div>}
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        <div className="filter-row">
          {["All","Pending","Responded"].map(f => (
            <button key={f} className={`filter-btn ${filter===f?"active":""}`} onClick={() => setFilter(f)}>
              {f} {f !== "All" && `(${feedbacks.filter(fb=>fb.status===f).length})`}
            </button>
          ))}
        </div>

        {loading ? <div className="loading-box">⏳ Loading feedback from database...</div> : (
          <div className="fb-list">
            {filtered.length === 0 ? (
              <p className="no-data">{feedbacks.length === 0 ? "No feedback submitted yet." : "No feedback in this category."}</p>
            ) : filtered.map(fb => (
              <div key={fb._id} className={`fb-card ${fb.status==="Pending"?"pending-border":""}`}>
                <div className="fb-card-top">
                  <div className="fb-left">
                    <div className="fb-type-badge" style={{ background:typeColors[fb.type]||"#aaa" }}>{fb.type}</div>
                    <h3>{fb.name}</h3>
                    <p className="fb-meta">{fb.email} &nbsp;|&nbsp; {fb.phone}</p>
                    {fb.studentName && <p className="fb-meta">👦 Student: <strong>{fb.studentName}</strong></p>}
                    <p className="fb-meta">📅 {new Date(fb.createdAt).toLocaleDateString("en-LK")}</p>
                  </div>
                  <div className="fb-right">
                    <span className={`status-pill ${fb.status==="Pending"?"inactive":"active"}`}>{fb.status}</span>
                    <div className="action-row" style={{marginTop:10}}>
                      <button className="btn-view" onClick={() => { setViewItem(fb); setReplyText(fb.response||""); }}>View & Reply</button>
                      <button className="btn-del"  onClick={() => setDeleteId(fb._id)}>Delete</button>
                    </div>
                  </div>
                </div>
                <p className="fb-message">"{fb.message}"</p>
                {fb.status === "Responded" && fb.response && (
                  <div className="fb-response"><strong>✅ Response:</strong> {fb.response}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View / Reply modal */}
        {viewItem && (
          <div className="modal-overlay" onClick={() => setViewItem(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setViewItem(null)}>✕</button>
              <div className="fb-type-badge" style={{ background:typeColors[viewItem.type]||"#aaa", marginBottom:14 }}>{viewItem.type}</div>
              <h2>{viewItem.name}</h2>
              <div className="modal-meta">
                <span>📧 {viewItem.email}</span>
                <span>📞 {viewItem.phone}</span>
                {viewItem.studentName && <span>👦 {viewItem.studentName}</span>}
              </div>
              <div className="msg-box-display"><strong>Message:</strong><p>{viewItem.message}</p></div>
              {viewItem.status === "Responded" ? (
                <div className="resp-box"><strong>✅ Response sent:</strong><p>{viewItem.response}</p></div>
              ) : (
                <div className="reply-area">
                  <label><strong>Write a Response:</strong></label>
                  <textarea rows="4" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your response..." />
                  <button className="submit-btn" onClick={() => handleRespond(viewItem._id)} disabled={saving}>
                    {saving ? "Saving..." : "Send Response"}
                  </button>
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
              <h2>⚠️ Delete Feedback?</h2><p>This will permanently remove this record from MongoDB.</p>
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
        .pending-badge{padding:12px 20px;background:#fff7ed;border:2px solid #f59e0b;border-radius:12px;color:#b45309;font-weight:700;font-size:14px;}
        .banner{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600;font-size:15px;}
        .success-banner{background:#dcfce7;border:1px solid #86efac;color:#15803d;} .error-banner{background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;}
        .loading-box{text-align:center;padding:60px;color:#888;font-size:18px;background:white;border-radius:16px;}
        .filter-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;}
        .filter-btn{padding:9px 20px;border-radius:25px;border:2px solid #ff4fa3;background:white;color:#ff4fa3;font-weight:600;cursor:pointer;transition:all 0.2s;font-size:13px;}
        .filter-btn.active,.filter-btn:hover{background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;border-color:transparent;}
        .fb-list{display:flex;flex-direction:column;gap:18px;}
        .fb-card{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 14px rgba(0,0,0,0.08);border-left:4px solid transparent;}
        .fb-card.pending-border{border-left-color:#f59e0b;}
        .fb-card-top{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:14px;}
        .fb-left{flex:1;} .fb-right{display:flex;flex-direction:column;align-items:flex-end;}
        .fb-type-badge{display:inline-block;padding:4px 14px;border-radius:20px;color:white;font-size:12px;font-weight:700;margin-bottom:8px;}
        .fb-card h3{font-size:17px;color:#333;margin-bottom:5px;} .fb-meta{font-size:13px;color:#888;margin-bottom:4px;}
        .fb-message{font-size:14px;color:#555;font-style:italic;line-height:1.6;border-left:3px solid #eee;padding-left:12px;}
        .fb-response{margin-top:12px;background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:12px;font-size:14px;color:#15803d;line-height:1.6;}
        .status-pill{padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;}
        .status-pill.active{background:#dcfce7;color:#16a34a;} .status-pill.inactive{background:#fff7ed;color:#b45309;}
        .action-row{display:flex;gap:8px;}
        .btn-view{padding:7px 14px;border-radius:20px;border:2px solid #4facfe;background:white;color:#4facfe;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-edit{padding:7px 14px;border-radius:20px;border:2px solid #ff7eb3;background:white;color:#ff4fa3;font-size:12px;font-weight:600;cursor:pointer;}
        .btn-del{padding:7px 14px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{text-align:center;padding:60px;color:#aaa;font-size:16px;}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card{background:white;border-radius:20px;padding:36px;max-width:600px;width:100%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:90vh;overflow-y:auto;}
        .modal-card.small{max-width:360px;text-align:center;}
        .modal-card.small p{color:#666;margin:14px 0 24px;line-height:1.6;}
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
        @media(max-width:768px){.admin-body{padding:20px;}.fb-card-top{flex-direction:column;}.fb-right{align-items:flex-start;}}
      `}</style>
    </div>
  );
};
export default FeedbackManagement;

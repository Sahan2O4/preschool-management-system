import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { financialAPI } from "../../services/api";

const incomeCategories  = ["Tuition Fees","Transport","Events","Other"];
const expenseCategories = ["Supplies","Utilities","Maintenance","Salaries","Events","Other"];
const fmt = (n) => `LKR ${Number(n).toLocaleString("en-LK")}`;
const blankIncome  = { type:"income",  description:"", amount:"", date:new Date().toISOString().split("T")[0], category:"Tuition Fees" };
const blankExpense = { type:"expense", description:"", amount:"", date:new Date().toISOString().split("T")[0], category:"Supplies" };

const FinancialManagement = () => {
  const [records, setRecords]   = useState([]);
  const [tab, setTab]           = useState("overview");
  const [showIncForm, setShowIncForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [incForm, setIncForm]   = useState(blankIncome);
  const [expForm, setExpForm]   = useState(blankExpense);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError]       = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try { setLoading(true); const data = await financialAPI.getAll(); setRecords(data); }
    catch (err) { setError("Could not load financial records."); }
    finally { setLoading(false); }
  };

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  const handleAdd = async (e, form, reset) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await financialAPI.create({ ...form, amount: Number(form.amount) });
      flash("✅ Record saved to database.");
      reset(); fetchRecords();
    } catch (err) { setError("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await financialAPI.delete(id); flash("✅ Record deleted."); setDeleteId(null); fetchRecords(); }
    catch (err) { setError("Delete failed."); }
  };

  const income   = records.filter(r => r.type === "income");
  const expenses = records.filter(r => r.type === "expense");
  const totalIncome   = income.reduce((s,r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s,r) => s + r.amount, 0);
  const net = totalIncome - totalExpenses;

  return (
    <div className="admin-page">
      <Navbar currentPage="Financial" mode="admin" />
      <div className="admin-body">
        <div className="page-header">
          <div><h1>💰 Financial Management</h1><p>Track income and expenses</p></div>
        </div>

        {error      && <div className="banner error-banner">❌ {error}</div>}
        {successMsg && <div className="banner success-banner">{successMsg}</div>}

        {/* Tabs */}
        <div className="tab-row">
          {["overview","income","expenses"].map(t => (
            <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>
              {t==="overview"?"📊 Overview":t==="income"?"💚 Income":"🔴 Expenses"}
            </button>
          ))}
        </div>

        {loading ? <div className="loading-box">⏳ Loading from database...</div> : (
          <>
            {/* OVERVIEW */}
            {tab === "overview" && (
              <div>
                <div className="fin-stats">
                  <div className="fin-stat green"><p className="fin-label">Total Income</p><p className="fin-value">{fmt(totalIncome)}</p></div>
                  <div className="fin-stat red"><p className="fin-label">Total Expenses</p><p className="fin-value">{fmt(totalExpenses)}</p></div>
                  <div className={`fin-stat ${net>=0?"blue":"orange"}`}><p className="fin-label">Net Balance</p><p className="fin-value">{fmt(Math.abs(net))} {net<0?"(Deficit)":"(Surplus)"}</p></div>
                </div>
                <div className="overview-tables">
                  <div className="ov-section">
                    <h2>Recent Income</h2>
                    <div className="table-wrap">
                      <table className="data-table">
                        <thead><tr><th>Description</th><th>Category</th><th>Date</th><th>Amount</th></tr></thead>
                        <tbody>{income.slice(-5).map(r => (
                          <tr key={r._id}><td>{r.description}</td><td><span className="cat-tag green-tag">{r.category}</span></td><td>{new Date(r.date).toLocaleDateString("en-LK")}</td><td className="amount green-amount">{fmt(r.amount)}</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                  <div className="ov-section">
                    <h2>Recent Expenses</h2>
                    <div className="table-wrap">
                      <table className="data-table">
                        <thead><tr><th>Description</th><th>Category</th><th>Date</th><th>Amount</th></tr></thead>
                        <tbody>{expenses.slice(-5).map(r => (
                          <tr key={r._id}><td>{r.description}</td><td><span className="cat-tag red-tag">{r.category}</span></td><td>{new Date(r.date).toLocaleDateString("en-LK")}</td><td className="amount red-amount">{fmt(r.amount)}</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INCOME */}
            {tab === "income" && (
              <div>
                <div className="section-header">
                  <p className="section-total green-amount">Total: {fmt(totalIncome)}</p>
                  <button className="add-btn" onClick={() => setShowIncForm(!showIncForm)}>{showIncForm?"✕ Cancel":"+ Add Income"}</button>
                </div>
                {showIncForm && (
                  <div className="form-card">
                    <h2>Add Income Record</h2>
                    <form onSubmit={e => handleAdd(e, incForm, () => { setIncForm(blankIncome); setShowIncForm(false); })} className="grid-form">
                      <div className="form-group full"><label>Description *</label><input required type="text" value={incForm.description} onChange={e => setIncForm({...incForm,description:e.target.value})} placeholder="Income description" /></div>
                      <div className="form-group"><label>Amount (LKR) *</label><input required type="number" min="0" value={incForm.amount} onChange={e => setIncForm({...incForm,amount:e.target.value})} /></div>
                      <div className="form-group"><label>Date *</label><input required type="date" value={incForm.date} onChange={e => setIncForm({...incForm,date:e.target.value})} /></div>
                      <div className="form-group"><label>Category</label><select value={incForm.category} onChange={e => setIncForm({...incForm,category:e.target.value})}>{incomeCategories.map(c=><option key={c}>{c}</option>)}</select></div>
                      <div className="form-actions full">
                        <button type="submit" className="submit-btn" disabled={saving}>{saving?"Saving...":"Add Income"}</button>
                        <button type="button" className="cancel-btn" onClick={() => setShowIncForm(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Description</th><th>Category</th><th>Date</th><th>Amount</th><th>Actions</th></tr></thead>
                    <tbody>{income.length === 0 ? <tr><td colSpan="5" className="no-data">No income records yet.</td></tr> : income.map(r => (
                      <tr key={r._id}><td>{r.description}</td><td><span className="cat-tag green-tag">{r.category}</span></td><td>{new Date(r.date).toLocaleDateString("en-LK")}</td><td className="amount green-amount">{fmt(r.amount)}</td><td><button className="btn-del" onClick={() => setDeleteId(r._id)}>Delete</button></td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EXPENSES */}
            {tab === "expenses" && (
              <div>
                <div className="section-header">
                  <p className="section-total red-amount">Total: {fmt(totalExpenses)}</p>
                  <button className="add-btn" onClick={() => setShowExpForm(!showExpForm)}>{showExpForm?"✕ Cancel":"+ Add Expense"}</button>
                </div>
                {showExpForm && (
                  <div className="form-card">
                    <h2>Add Expense Record</h2>
                    <form onSubmit={e => handleAdd(e, expForm, () => { setExpForm(blankExpense); setShowExpForm(false); })} className="grid-form">
                      <div className="form-group full"><label>Description *</label><input required type="text" value={expForm.description} onChange={e => setExpForm({...expForm,description:e.target.value})} placeholder="Expense description" /></div>
                      <div className="form-group"><label>Amount (LKR) *</label><input required type="number" min="0" value={expForm.amount} onChange={e => setExpForm({...expForm,amount:e.target.value})} /></div>
                      <div className="form-group"><label>Date *</label><input required type="date" value={expForm.date} onChange={e => setExpForm({...expForm,date:e.target.value})} /></div>
                      <div className="form-group"><label>Category</label><select value={expForm.category} onChange={e => setExpForm({...expForm,category:e.target.value})}>{expenseCategories.map(c=><option key={c}>{c}</option>)}</select></div>
                      <div className="form-actions full">
                        <button type="submit" className="submit-btn" disabled={saving}>{saving?"Saving...":"Add Expense"}</button>
                        <button type="button" className="cancel-btn" onClick={() => setShowExpForm(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Description</th><th>Category</th><th>Date</th><th>Amount</th><th>Actions</th></tr></thead>
                    <tbody>{expenses.length === 0 ? <tr><td colSpan="5" className="no-data">No expense records yet.</td></tr> : expenses.map(r => (
                      <tr key={r._id}><td>{r.description}</td><td><span className="cat-tag red-tag">{r.category}</span></td><td>{new Date(r.date).toLocaleDateString("en-LK")}</td><td className="amount red-amount">{fmt(r.amount)}</td><td><button className="btn-del" onClick={() => setDeleteId(r._id)}>Delete</button></td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-card small" onClick={e => e.stopPropagation()}>
              <h2>⚠️ Delete Record?</h2><p>This will permanently remove this financial record.</p>
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
        .banner{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600;font-size:15px;}
        .success-banner{background:#dcfce7;border:1px solid #86efac;color:#15803d;} .error-banner{background:#fee2e2;border:1px solid #fca5a5;color:#dc2626;}
        .loading-box{text-align:center;padding:60px;color:#888;font-size:18px;background:white;border-radius:16px;}
        .tab-row{display:flex;gap:10px;margin-bottom:28px;flex-wrap:wrap;}
        .tab-btn{padding:11px 22px;border-radius:25px;border:2px solid #ff4fa3;background:white;color:#ff4fa3;font-weight:600;cursor:pointer;transition:all 0.2s;font-size:14px;}
        .tab-btn.active,.tab-btn:hover{background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;border-color:transparent;}
        .fin-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;margin-bottom:28px;}
        .fin-stat{background:white;border-radius:16px;padding:22px 26px;box-shadow:0 4px 14px rgba(0,0,0,0.08);border-left:5px solid;}
        .fin-stat.green{border-color:#34d399;} .fin-stat.red{border-color:#f87171;} .fin-stat.blue{border-color:#4facfe;} .fin-stat.orange{border-color:#f59e0b;}
        .fin-label{font-size:13px;color:#888;margin-bottom:8px;font-weight:600;} .fin-value{font-size:20px;font-weight:800;color:#333;}
        .overview-tables{display:flex;gap:24px;flex-wrap:wrap;}
        .ov-section{flex:1;min-width:300px;} .ov-section h2{font-size:18px;color:#ff4fa3;margin-bottom:14px;}
        .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;}
        .section-total{font-size:18px;font-weight:700;}
        .form-card{background:white;border-radius:18px;padding:26px;margin-bottom:22px;box-shadow:0 6px 20px rgba(0,0,0,0.1);}
        .form-card h2{font-size:18px;color:#ff4fa3;margin-bottom:18px;}
        .grid-form{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .form-group{display:flex;flex-direction:column;gap:6px;} .form-group.full{grid-column:1/-1;}
        .form-group label{font-weight:600;font-size:13px;color:#555;}
        .form-group input,.form-group select{padding:11px 14px;border-radius:10px;border:2px solid #eee;font-size:14px;outline:none;transition:border 0.2s;font-family:"Segoe UI",sans-serif;}
        .form-group input:focus,.form-group select:focus{border-color:#ff4fa3;}
        .form-actions{display:flex;gap:12px;}
        .submit-btn{padding:11px 24px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);} .submit-btn:disabled{opacity:0.7;cursor:not-allowed;}
        .cancel-btn{padding:11px 24px;border-radius:25px;border:2px solid #ddd;background:white;color:#666;font-weight:600;cursor:pointer;font-size:14px;}
        .add-btn{padding:11px 22px;border-radius:25px;border:none;background:linear-gradient(90deg,#4facfe,#ff7eb3);color:white;font-weight:700;cursor:pointer;font-size:14px;transition:transform 0.2s;}
        .add-btn:hover{transform:translateY(-2px);}
        .table-wrap{background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.08);overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;} .data-table thead{background:linear-gradient(90deg,#4facfe,#ff7eb3);}
        .data-table th{padding:13px 16px;color:white;font-size:13px;text-align:left;white-space:nowrap;}
        .data-table td{padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#444;}
        .data-table tr:last-child td{border-bottom:none;} .data-table tr:hover td{background:#fdf4f9;}
        .cat-tag{padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;}
        .green-tag{background:#dcfce7;color:#15803d;} .red-tag{background:#fee2e2;color:#dc2626;}
        .amount{font-weight:700;} .green-amount{color:#16a34a;} .red-amount{color:#dc2626;}
        .btn-del{padding:6px 14px;border-radius:20px;border:2px solid #f87171;background:white;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;}
        .no-data{text-align:center;padding:30px;color:#aaa;font-size:15px;}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal-card.small{background:white;border-radius:20px;padding:36px;max-width:360px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
        .modal-card.small h2{font-size:22px;color:#ff4fa3;margin-bottom:14px;} .modal-card.small p{color:#666;margin-bottom:24px;line-height:1.6;}
        .modal-actions{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;}
        @media(max-width:768px){.admin-body{padding:20px;}.grid-form{grid-template-columns:1fr;}.form-group.full{grid-column:1;}.overview-tables{flex-direction:column;}}
      `}</style>
    </div>
  );
};
export default FinancialManagement;

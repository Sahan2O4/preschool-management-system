import React, { useEffect, useMemo, useState } from "react";
import "./financial.css";

const STORAGE_KEY = "mk_financial_records";

export default function FinancialManagement({ role }) {
  const [form, setForm] = useState({
    type: "Income",
    title: "",
    amount: "",
    date: "",
  });

  const [records, setRecords] = useState([]);

  /* Load saved data */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  /* Save data */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  /* Totals */
  const totals = useMemo(() => {
    const income = records
      .filter((r) => r.type === "Income")
      .reduce((a, b) => a + b.amount, 0);

    const expense = records
      .filter((r) => r.type === "Expense")
      .reduce((a, b) => a + b.amount, 0);

    const salary = records
      .filter((r) => r.type === "Salary")
      .reduce((a, b) => a + b.amount, 0);

    return {
      income,
      expense,
      salary,
      net: income - (expense + salary),
    };
  }, [records]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addRecord(e) {
    e.preventDefault();

    if (!form.title || !form.amount || !form.date) {
      alert("Fill all fields");
      return;
    }

    const newRecord = {
      id: Date.now(),
      type: form.type,
      title: form.title,
      amount: Number(form.amount),
      date: form.date,
    };

    setRecords([newRecord, ...records]);
    setForm({ type: "Income", title: "", amount: "", date: "" });
  }

  function removeRecord(id) {
    setRecords(records.filter((r) => r.id !== id));
  }

  return (
    <div className="financial-page">
      <header className="financial-header">
        <h1>Financial Management</h1>
        <p>Income, Expenses & Salary Overview</p>
      </header>

      {/* SUMMARY */}
      <section className="summary-grid">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p className="big">LKR {totals.income.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="big">LKR {totals.expense.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Total Salary</h3>
          <p className="big">LKR {totals.salary.toLocaleString()}</p>
        </div>

        <div className="summary-card highlight">
          <h3>Net Balance</h3>
          <p className="big">LKR {totals.net.toLocaleString()}</p>
        </div>
      </section>

      <section className="grid-2">
        {/* ADMIN ONLY FORM */}
        {role === "admin" && (
          <div className="panel">
            <h2>Add Record</h2>

            <form className="form" onSubmit={addRecord}>
              <label>
                Type
                <select name="type" value={form.type} onChange={onChange}>
                  <option>Income</option>
                  <option>Expense</option>
                  <option>Salary</option>
                </select>
              </label>

              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Title"
                />
              </label>

              <label>
                Amount
                <input
                  name="amount"
                  value={form.amount}
                  onChange={onChange}
                  type="number"
                  placeholder="Amount"
                />
              </label>

              <label>
                Date
                <input
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  type="date"
                />
              </label>

              <button className="primary-btn">Add</button>
            </form>
          </div>
        )}

        {/* TABLE */}
        <div className="panel">
          <h2>Records</h2>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Amount</th>
                  {role === "admin" && <th></th>}
                </tr>
              </thead>

              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>
                      <span className={`pill ${r.type.toLowerCase()}`}>
                        {r.type}
                      </span>
                    </td>
                    <td>{r.title}</td>
                    <td>LKR {r.amount.toLocaleString()}</td>

                    {role === "admin" && (
                      <td>
                        <button
                          className="danger-btn"
                          onClick={() => removeRecord(r.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

                {records.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                      No records yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="note">
            Admin can edit financial data. Users can only view.
          </p>
        </div>
      </section>
    </div>
  );
}
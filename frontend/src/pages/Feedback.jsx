import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { feedbackAPI } from "../services/api";

const Feedback = () => {
  const [form, setForm]         = useState({ name:"", email:"", phone:"", type:"General Inquiry", studentName:"", message:"" });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await feedbackAPI.submit(form);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ name:"", email:"", phone:"", type:"General Inquiry", studentName:"", message:"" });
  };

  return (
    <div>
      <Navbar currentPage="Feedback" mode="public" />

      <section className="fb-hero">
        <h1>💬 Feedback & Inquiries</h1>
        <p>We value your thoughts. Share your feedback or ask us anything.</p>
      </section>

      <section className="fb-body">
        <div className="fb-layout">

          {/* Contact info */}
          <div className="fb-info">
            <h2>Get in Touch</h2>
            <p>We're here to help! Use the form or contact us directly.</p>
            {[
              { icon:"📍", title:"Address",      text:"Pituwala Road, Elpitiya, Sri Lanka, 80400" },
              { icon:"📞", title:"Phone",        text:"077 739 3040" },
              { icon:"📧", title:"Email",        text:"merrykidsinternational@gmail.com" },
              { icon:"🕐", title:"School Hours", text:"Monday – Friday: 7:30 AM – 1:00 PM" },
            ].map((c,i) => (
              <div key={i} className="contact-card">
                <span>{c.icon}</span>
                <div><strong>{c.title}</strong><p>{c.text}</p></div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="fb-form-wrap">
            {submitted ? (
              <div className="success-box">
                <h2>✅ Message Sent!</h2>
                <p>Your message has been saved to our system. We'll get back to you within 1–2 business days.</p>
                <button className="submit-btn" onClick={reset}>Send Another Message</button>
              </div>
            ) : (
              <form className="fb-form" onSubmit={handleSubmit}>
                <h2>Send a Message</h2>
                {error && <div className="msg-box error">{error}</div>}

                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input required type="text" placeholder="Full name"
                      value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input required type="email" placeholder="your@email.com"
                      value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" placeholder="07X XXX XXXX"
                      value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Type *</label>
                    <select value={form.type} onChange={e => setForm({...form, type:e.target.value})}>
                      <option>General Inquiry</option>
                      <option>Admission Inquiry</option>
                      <option>Feedback</option>
                      <option>Complaint</option>
                      <option>Suggestion</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Student Name (if applicable)</label>
                  <input type="text" placeholder="Child's name"
                    value={form.studentName} onChange={e => setForm({...form, studentName:e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea required rows="5" placeholder="Write your message here..."
                    value={form.message} onChange={e => setForm({...form, message:e.target.value})} />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Sending..." : "Send Message 🚀"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .fb-hero { padding:80px 20px; text-align:center; background:linear-gradient(135deg,#f4f9ff,#ffe0f0); }
        .fb-hero h1 { font-size:44px; color:#ff4fa3; margin-bottom:14px; }
        .fb-hero p  { font-size:18px; color:#555; }
        .fb-body    { padding:60px 40px; background:#f8f8f8; }
        .fb-layout  { display:flex; gap:40px; justify-content:center; flex-wrap:wrap; }

        .fb-info    { max-width:320px; }
        .fb-info h2 { font-size:24px; color:#ff4fa3; margin-bottom:14px; }
        .fb-info > p { font-size:15px; color:#555; line-height:1.6; margin-bottom:24px; }
        .contact-card { display:flex; gap:14px; align-items:flex-start; margin-bottom:18px; background:white; padding:16px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.07); }
        .contact-card span { font-size:22px; }
        .contact-card strong { display:block; color:#333; margin-bottom:3px; font-size:14px; }
        .contact-card p { font-size:13px; color:#777; margin:0; }

        .fb-form-wrap { background:white; border-radius:20px; padding:36px; width:100%; max-width:600px; box-shadow:0 8px 30px rgba(0,0,0,0.09); }
        .fb-form h2  { font-size:22px; color:#ff4fa3; margin-bottom:22px; }
        .fb-form     { display:flex; flex-direction:column; gap:14px; }
        .form-row    { display:flex; gap:14px; }
        .form-group  { display:flex; flex-direction:column; gap:6px; flex:1; }
        .form-group label { font-weight:600; font-size:13px; color:#444; }
        .form-group input, .form-group select, .form-group textarea { padding:12px 14px; border-radius:10px; border:2px solid #eee; font-size:14px; outline:none; transition:border 0.2s; resize:vertical; font-family:"Segoe UI",sans-serif; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color:#ff4fa3; }

        .msg-box.error { background:#fff0f0; border:1px solid #fca5a5; color:#dc2626; padding:12px; border-radius:10px; font-weight:600; font-size:14px; }

        .submit-btn { padding:14px; border-radius:25px; border:none; background:linear-gradient(90deg,#4facfe,#ff7eb3); color:white; font-size:16px; font-weight:700; cursor:pointer; transition:all 0.2s; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); }
        .submit-btn:disabled { opacity:0.7; cursor:not-allowed; }

        .success-box { text-align:center; padding:40px 20px; }
        .success-box h2 { font-size:30px; color:#34d399; margin-bottom:14px; }
        .success-box p  { color:#555; font-size:16px; margin-bottom:28px; line-height:1.6; }

        @media(max-width:768px){ .fb-body{padding:40px 20px;} .form-row{flex-direction:column;} .fb-info{max-width:100%;} }
      `}</style>
    </div>
  );
};

export default Feedback;

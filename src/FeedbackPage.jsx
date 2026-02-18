import React, { useState } from "react";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    email: "",
    rating: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("feedbacks")) || [];

    localStorage.setItem("feedbacks", JSON.stringify([...existing, formData]));

    setSubmitted(true);
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h2 className="title">Parent Feedback</h2>

        {submitted ? (
          <div className="success-box">Thank you for your feedback 💖</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              name="parentName"
              placeholder="Parent Name"
              onChange={handleChange}
            />
            <input
              name="childName"
              placeholder="Child Name"
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <select name="rating" onChange={handleChange}>
              <option value="">Select Rating</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>

            <textarea
              name="message"
              placeholder="Your Feedback..."
              onChange={handleChange}
            />

            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}

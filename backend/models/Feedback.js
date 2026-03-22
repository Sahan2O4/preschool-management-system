const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    email:       { type: String, required: true },
    phone:       { type: String, default: "" },
    type:        { type: String, enum: ["General Inquiry", "Admission Inquiry", "Feedback", "Complaint", "Suggestion"], default: "General Inquiry" },
    studentName: { type: String, default: "" },
    message:     { type: String, required: true },
    status:      { type: String, enum: ["Pending", "Responded"], default: "Pending" },
    response:    { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);

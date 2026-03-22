const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    studentId:   { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject:     { type: String, required: true },
    grade:       { type: String, required: true },
    description: { type: String, required: true },
    date:        { type: Date, required: true },
    recordedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);

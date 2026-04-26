const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId:    { type: String, required: true, unique: true },
    name:         { type: String, required: true, trim: true },
    dateOfBirth:  { type: Date, required: true },
    address:      { type: String, required: true },
    enrolledDate: { type: Date, required: true },
    status:       { type: String, enum: ["Active", "Inactive"], default: "Active" },
    className:    { type: String, enum: ["Class A", "Class B", "Class C"], default: "Class A" },
    parentName:   { type: String, required: true },
    parentPhone:  { type: String, required: true },
    parentEmail:  { type: String, default: "" },
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);

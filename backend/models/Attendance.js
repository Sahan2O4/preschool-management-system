const mongoose = require("mongoose");

const attendanceEntrySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status:    { type: String, enum: ["Present", "Absent", "Late"], required: true },
});

const attendanceSchema = new mongoose.Schema(
  {
    date:    { type: Date, required: true },
    records: [attendanceEntrySchema],
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Ensure one attendance document per date
attendanceSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

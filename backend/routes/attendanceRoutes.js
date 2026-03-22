const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── GET all attendance records ─────────────────────────────────────────────
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("records.studentId", "name studentId")
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET attendance by date ─────────────────────────────────────────────────
router.get("/date/:date", protect, adminOnly, async (req, res) => {
  try {
    const record = await Attendance.findOne({ date: new Date(req.params.date) })
      .populate("records.studentId", "name studentId");
    if (!record) return res.status(404).json({ message: "No attendance record for this date" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST create/save attendance for a date ─────────────────────────────────
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { date, records } = req.body;

    // Upsert: if attendance for this date already exists, update it
    const attendance = await Attendance.findOneAndUpdate(
      { date: new Date(date) },
      { date: new Date(date), records, markedBy: req.user.id },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT update a single student's attendance status ────────────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE attendance record by ID ─────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Attendance record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");
const { protect, adminOnly, staffOnly } = require("../middleware/authMiddleware");

// ── GET all progress records ───────────────────────────────────────────────
router.get("/", protect, staffOnly, async (req, res) => {
  try {
    const records = await Progress.find()
      .populate("studentId", "name studentId")
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET progress by student ID ─────────────────────────────────────────────
router.get("/student/:studentId", protect, async (req, res) => {
  try {
    const records = await Progress.find({ studentId: req.params.studentId })
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET single record ──────────────────────────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const record = await Progress.findById(req.params.id).populate("studentId", "name studentId");
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST create progress record ────────────────────────────────────────────
router.post("/", protect, staffOnly, async (req, res) => {
  try {
    const { studentId, subject, grade, description, date } = req.body;
    const record = await Progress.create({
      studentId, subject, grade, description, date,
      recordedBy: req.user.id,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT update progress record ─────────────────────────────────────────────
router.put("/:id", protect, staffOnly, async (req, res) => {
  try {
    const record = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE progress record ─────────────────────────────────────────────────
router.delete("/:id", protect, staffOnly, async (req, res) => {
  try {
    const record = await Progress.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Progress record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

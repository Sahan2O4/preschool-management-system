const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { protect, adminOnly, staffOnly } = require("../middleware/authMiddleware");

// ── GET all students (admin only) ─────────────────────────────────────────
router.get("/", protect, staffOnly, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET student by parent email (used by StudentProfile page) ─────────────
// Must be BEFORE /:id route so "by-parent" isn't treated as an id
router.get("/by-parent/:email", protect, async (req, res) => {
  try {
    const student = await Student.findOne({
      parentEmail: req.params.email.toLowerCase(),
    });
    if (!student) {
      return res.status(404).json({ message: "No student linked to this account yet." });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET single student by MongoDB _id ─────────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST create new student (admin only) ──────────────────────────────────
router.post("/", protect, staffOnly, async (req, res) => {
  try {
    const {
      name, dateOfBirth, address, enrolledDate, className,
      status, parentName, parentPhone, parentEmail,
    } = req.body;

    // Auto-generate studentId: S001, S002, ...
    const count = await Student.countDocuments();
    const studentId = `S${String(count + 1).padStart(3, "0")}`;

    const student = await Student.create({
      studentId, name, dateOfBirth, address,
      enrolledDate, status, className: className || "Class A",
      parentName, parentPhone,
      parentEmail: parentEmail?.toLowerCase(),
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT update student (admin only) ───────────────────────────────────────
router.put("/:id", protect, staffOnly, async (req, res) => {
  try {
    // Normalise email to lowercase if provided
    if (req.body.parentEmail) {
      req.body.parentEmail = req.body.parentEmail.toLowerCase();
    }
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE student (admin only) ───────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

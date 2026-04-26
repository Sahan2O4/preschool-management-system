const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { protect, adminOnly, staffOnly } = require("../middleware/authMiddleware");

// ── GET all feedback (admin only) ──────────────────────────────────────────
router.get("/", protect, staffOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET single feedback ────────────────────────────────────────────────────
router.get("/:id", protect, staffOnly, async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });
    res.json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST submit new feedback (public — no auth required) ───────────────────
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, type, studentName, message } = req.body;
    const feedback = await Feedback.create({ name, email, phone, type, studentName, message });
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT respond to feedback (admin only) ───────────────────────────────────
router.put("/:id", protect, staffOnly, async (req, res) => {
  try {
    const fb = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!fb) return res.status(404).json({ message: "Feedback not found" });
    res.json(fb);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE feedback ────────────────────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const fb = await Feedback.findByIdAndDelete(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

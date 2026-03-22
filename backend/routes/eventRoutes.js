const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── GET all events (public) ────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET single event ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST create event (admin only) ────────────────────────────────────────
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, date, time, location, category, description, organizer } = req.body;
    const event = await Event.create({
      title, date, time, location, category, description, organizer,
      createdBy: req.user.id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT update event ───────────────────────────────────────────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE event ───────────────────────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

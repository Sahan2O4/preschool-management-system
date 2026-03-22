const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET all sessions (public)
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1 });
    res.json(sessions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create session
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const session = await Session.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(session);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update session
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE session
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ message: "Session deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

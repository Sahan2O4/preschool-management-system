const express = require("express");
const router = express.Router();
const Financial = require("../models/Financial");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET all records
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const records = await Financial.find().sort({ date: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create record
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const record = await Financial.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(record);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update record
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const record = await Financial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE record
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const record = await Financial.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

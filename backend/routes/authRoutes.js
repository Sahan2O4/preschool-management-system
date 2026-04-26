const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: generate JWT
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ── POST /api/auth/register ────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, phone, role });
    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login ───────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── GET /api/auth/teachers (admin only) ───────────────────────────────────
router.get("/teachers", protect, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password").sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/auth/teachers/:id (admin only) ────────────────────────────
router.delete("/teachers/:id", protect, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  try {
    const teacher = await User.findOneAndDelete({ _id: req.params.id, role: "teacher" });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database Connection ────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/students",   require("./routes/studentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/progress",   require("./routes/progressRoutes"));
app.use("/api/events",     require("./routes/eventRoutes"));
app.use("/api/feedback",   require("./routes/feedbackRoutes"));
app.use("/api/financial",  require("./routes/financialRoutes"));
app.use("/api/sessions",   require("./routes/sessionRoutes"));

// ── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Merry Kids API is running 🎉" });
});

// ── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    subject:     { type: String, required: true },
    teacher:     { type: String, required: true },
    date:        { type: Date, required: true },
    time:        { type: String, required: true },
    duration:    { type: Number, required: true },
    level:       { type: String, default: "All Levels" },
    description: { type: String, required: true },
    spots:       { type: Number, required: true },
    enrolled:    { type: Number, default: 0 },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);

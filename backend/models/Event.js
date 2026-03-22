const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    date:        { type: Date, required: true },
    time:        { type: String, required: true },
    location:    { type: String, required: true },
    category:    { type: String, enum: ["Sports", "Arts", "Academic", "Cultural", "Other"], default: "Other" },
    description: { type: String, required: true },
    organizer:   { type: String, required: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);

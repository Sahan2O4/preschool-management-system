const mongoose = require("mongoose");

const financialSchema = new mongoose.Schema(
  {
    type:        { type: String, enum: ["income", "expense"], required: true },
    description: { type: String, required: true },
    amount:      { type: Number, required: true },
    date:        { type: Date, required: true },
    category:    { type: String, required: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Financial", financialSchema);

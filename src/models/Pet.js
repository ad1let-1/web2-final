const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    species: { type: String, required: true, enum: ["dog", "cat", "other"] },
    breed: { type: String, required: true, trim: true, maxlength: 100 },
    age: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["available", "adopted"], default: "available" },
    imageUrl: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);

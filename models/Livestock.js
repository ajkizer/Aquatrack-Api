const mongoose = require("mongoose");

const LivestockSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please add a name"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  isSaltwater: {
    type: Boolean,
    default: false,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    default: 1.99,
  },
  quarantine: {
    type: Boolean,
    default: false,
  },
  breeding: {
    type: Boolean,
    default: false,
  },
  aquarium: {
    type: mongoose.Schema.ObjectId,
    ref: "Aquarium",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    req: "User",
    required: true,
  },
});

module.exports = mongoose.model("Livestock", LivestockSchema);

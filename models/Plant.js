const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please add a name"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    default: 1.99,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
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

module.exports = mongoose.model("Plant", PlantSchema);

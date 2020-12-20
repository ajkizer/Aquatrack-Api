const mongoose = require("mongoose");

const AquariumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    size: {
      type: Number,
      required: [true, "Please add size"],
    },
    isPlanted: {
      type: Boolean,
      default: true,
    },
    waterchangeReminder: {
      type: Number,
      default: 7,
      min: 1,
      max: 30,
    },
    parameterCheckReminder: {
      type: Number,
      default: 7,
      min: 1,
      max: 30,
    },
    plantTrimReminder: {
      type: Number,
      default: 7,
      min: 1,
      max: 30,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Aquarium", AquariumSchema);

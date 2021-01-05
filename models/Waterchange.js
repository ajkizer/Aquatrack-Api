const mongoose = require("mongoose");

const WaterchangeSchema = new mongoose.Schema({
  percentChange: {
    type: Number,
    min: 5,
    max: 100,
    enum: [5, 10, 20, 25, 30, 40, 50, 75, 90],
    required: [true, "Please provide the percent of water changed"],
  },
  aquarium: {
    type: mongoose.Schema.ObjectId,
    ref: "Aquarium",
    required: [true, "Please specify aquarium"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Waterchange",
    required: [true, "Please specify user"],
  },
  notes: {
    type: String,
    max: [500, "Notes must contain no more than 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

WaterchangeSchema.statics.getLastWaterchange = async function (aquariumId) {
  const wc = await this.find({ aquarium: aquariumId }).sort("-createdAt");
  try {
    console.log(wc);
    await this.model("Aquarium").findByIdAndUpdate(aquariumId, {
      lastWaterchange: wc[0].createdAt,
    });
  } catch (error) {
    console.error(error);
  }
};

WaterchangeSchema.post("save", function () {
  this.constructor.getLastWaterchange(this.aquarium);
});

module.exports = mongoose.model("Waterchange", WaterchangeSchema);

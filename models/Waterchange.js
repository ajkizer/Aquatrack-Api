const mongoose = require("mongoose");

const WaterchangeSchema = new mongoose.Schema({
  percentChange: {
    type: Number,
    min: 5,
    max: 100,
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
      lastWaterchange: {
        date: wc[0].createdAt,
        percentChange: wc[0].percentChange,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

WaterchangeSchema.post("save", function () {
  this.constructor.getLastWaterchange(this.aquarium);
});

module.exports = mongoose.model("Waterchange", WaterchangeSchema);

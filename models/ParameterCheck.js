const mongoose = require("mongoose");

const ParameterCheckSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  ammonia: {
    type: Number,
    enum: [0, 0.25, 0.5, 1.0, 2.0, 4.0, 8.0],
    required: true,
  },
  nitrate: {
    type: Number,
    enum: [0, 5, 10, 20, 40, 80, 160],
    required: true,
  },
  nitrite: {
    type: Number,
    enum: [0, 0.25, 0.5, 1.0, 2.0, 5.0],
    required: true,
  },
  pH: {
    type: Number,
    enum: [6.0, 6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4, 8.8],
    required: true,
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

ParameterCheckSchema.statics.getLastParamaterCheck = async function (
  aquariumId
) {
  const pc = await this.find({ aquarium: aquariumId }).sort("-createdAt");
  try {
    await this.model("Aquarium").findByIdAndUpdate(aquariumId, {
      lastParameterCheck: {
        date: pc[0].createdAt,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

ParameterCheckSchema.post("save", function () {
  this.constructor.getLastParamaterCheck(this.aquarium);
});

module.exports = mongoose.model("ParameterCheck", ParameterCheckSchema);

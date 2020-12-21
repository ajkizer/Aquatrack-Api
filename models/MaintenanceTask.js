const mongoose = require("mongoose");

const MaintenanceTaskSchema = new mongoose.Schema({
  description: {
    type: String,
    maxlength: [500, "Description must be less than 500 characters"],
    required: [true, "Please provide a description of the actions taken"],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

MaintenanceTaskSchema.statics.getLastMaintenance = async function (aquariumId) {
  const lm = await this.find({ aquarium: aquariumId }).sort("-createdAt");
  try {
    await this.model("Aquarium").findByIdAndUpdate(aquariumId, {
      lastMaintenance: {
        date: lm[0].createdAt,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

MaintenanceTaskSchema.post("save", function () {
  this.constructor.getLastMaintenance(this.aquarium);
});

module.exports = mongoose.model("MaintenanceTask", MaintenanceTaskSchema);

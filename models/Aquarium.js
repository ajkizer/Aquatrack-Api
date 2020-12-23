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
    isSaltwater: {
      type: Boolean,
      default: false,
    },
    waterchangeReminder: {
      type: Number,
      default: 7,
      min: 1,
      max: 30,
    },
    averagepH: {
      type: Number,
    },
    averageNitrates: {
      type: Number,
    },
    parameterCheckReminder: {
      type: Number,
      default: 7,
      min: 1,
      max: 30,
    },
    lastWaterchange: {
      date: {
        type: Date,
      },
      percentChange: {
        type: Number,
      },
    },
    lastParameterCheck: {
      type: Date,
    },
    lastMaintenance: {
      type: Date,
    },
    generalMaintenanceReminder: {
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

AquariumSchema.pre("remove", async function (next) {
  const models = [
    "Livestock",
    "Plant",
    "MaintenanceTask",
    "Waterchange",
    "ParameterCheck",
  ];

  console.log("Removing all data associated with aquarium...");
  models.forEach(async (item) => {
    console.log(`${item} Items Deleted`);
    await this.model(item).deleteMany({ aquarium: this._id });
  });
});

AquariumSchema.virtual("livestock", {
  ref: "Livestock",
  localField: "_id",
  foreignField: "aquarium",
  justOne: false,
});

AquariumSchema.virtual("plants", {
  ref: "Plant",
  localField: "_id",
  foreignField: "aquarium",
  justOne: false,
});

module.exports = mongoose.model("Aquarium", AquariumSchema);

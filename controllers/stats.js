const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const Livestock = require("../models/Livestock");
const Aquarium = require("../models/Aquarium");
const MaintenanceTask = require("../models/MaintenanceTask");
const ParameterCheck = require("../models/ParameterCheck");
const Plant = require("../models/Plant");
const Waterchange = require("../models/Waterchange");
const ObjectID = require("mongodb").ObjectID;

const inventoryCalculators = {
  inventoryTypeTotalSingleAq: async (model, aquariumId) => {
    const inventoryItems = await model.aggregate([
      {
        $match: { aquarium: new ObjectID(aquariumId) },
      },
      {
        $group: { _id: "$price", quantity: { $sum: "$quantity" } },
      },
    ]);

    const inventoryItemsTotal = inventoryItems
      .map((item) => item._id * item.quantity)
      .reduce((a, b) => a + b, 0);

    return inventoryItemsTotal;
  },
};

//@desc     Get Inventory Total for aquarium
//@route    GET /api/v1/stats/:aquariumId/inventoryTotal
//@access   Private

exports.getAquariumInventoryTotal = asyncHandler(async (req, res, next) => {
  const livestock = await inventoryCalculators.inventoryTypeTotalSingleAq(
    Livestock,
    req.params.aquariumId
  );

  const plants = await inventoryCalculators.inventoryTypeTotalSingleAq(
    Plant,
    req.params.aquariumId
  );

  const totalInventory = livestock + plants;

  res.json({ success: true, data: { livestock, plants, totalInventory } });
});

//@desc     Get Inventory Total for account
//@route    GET /api/v1/stats/totalInventory
//@access   Private

exports.getTotalInventory = asyncHandler(async (req, res, next) => {
  const livestock = await Livestock.aggregate([
    {
      $match: {},
    },
    {
      $group: { _id: "$price", quantity: { $sum: "$quantity" } },
    },
  ]);

  const plants = await Plant.aggregate([
    {
      $match: {},
    },
    {
      $group: { _id: "$price", quantity: { $sum: "$quantity" } },
    },
  ]);

  const livestockTotal = livestock
    .map((item) => item._id * item.quantity)
    .reduce((a, b) => a + b, 0);

  const plantTotal = plants
    .map((item) => item._id * item.quantity)
    .reduce((a, b) => a + b, 0);

  const totalInventory = plantTotal + livestockTotal;

  res.json({ livestockTotal, plantTotal, totalInventory });
});

//@desc     Get Average pH for aquarium
//@route    GET /api/v1/stats/:aquariumId/avgpH
//@access   Private

exports.getAvgpH = asyncHandler(async (req, res, next) => {
  const ph = await ParameterCheck.aggregate([
    {
      $match: { aquarium: new ObjectID(req.params.aquariumId) },
    },
    {
      $group: { _id: "$_id", avgpH: { $avg: "$pH" } },
    },
  ]);

  res.json(ph);
});

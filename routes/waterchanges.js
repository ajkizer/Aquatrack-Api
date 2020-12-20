const express = require("express");
const {
  getWaterchanges,
  addWaterchange,
  getSingleWaterchange,
  updateWaterchange,
  deleteWaterchange,
} = require("../controllers/waterchanges");

const { protect } = require("../middleware/auth");

const Waterchange = require("../models/Waterchanges");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    protect,
    advancedResults(Waterchange, { path: "aquarium", select: "name size" }),
    getWaterchanges
  )
  .post(protect, addWaterchange);

router
  .route("/:id")
  .get(protect, getSingleWaterchange)
  .put(protect, updateWaterchange)
  .delete(protect, deleteWaterchange);

module.exports = router;

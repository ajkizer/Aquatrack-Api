const express = require("express");
const {
  getLivestock,
  getSingleLivestock,
  addLivestock,
  updateLivestock,
  deleteLivestock,
} = require("../controllers/livestock");

const { protect } = require("../middleware/auth");
const Livestock = require("../models/Livestock");

const router = express.Router({ mergeParams: true });
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    protect,
    advancedResults(Livestock, { path: "aquarium", select: "name size" }),
    getLivestock
  )
  .post(protect, addLivestock);
router
  .route("/:id")
  .get(protect, getSingleLivestock)
  .put(protect, updateLivestock)
  .delete(protect, deleteLivestock);

module.exports = router;

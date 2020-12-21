const express = require("express");
const {
  getPlants,
  getSinglePlant,
  addPlant,
  updatePlant,
  deletePlant,
} = require("../controllers/plants");

const { protect } = require("../middleware/auth");
const Plant = require("../models/Plant");

const router = express.Router({ mergeParams: true });
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    protect,
    advancedResults(Plant, { path: "aquarium", select: "name size" }),
    getPlants
  )
  .post(protect, addPlant);
router
  .route("/:id")
  .get(protect, getSinglePlant)
  .put(protect, updatePlant)
  .delete(protect, deletePlant);

module.exports = router;

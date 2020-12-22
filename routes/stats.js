const express = require("express");
const {
  getAquariumInventoryTotal,
  getTotalInventory,
} = require("../controllers/stats");

const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(getTotalInventory);
router
  .route("/:aquariumId/inventoryTotal")
  .get(protect, getAquariumInventoryTotal);

module.exports = router;

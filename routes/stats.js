const express = require("express");
const {
  getAquariumInventoryTotal,
  getTotalInventory,
} = require("../controllers/stats");

const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/inventoryTotal").get(getTotalInventory);
router
  .route("/inventoryTotal/:aquariumId")
  .get(protect, getAquariumInventoryTotal);

module.exports = router;

const express = require("express");
const {
  getLivestock,
  getSingleLivestock,
  addLivestock,
  updateLivestock,
  deleteLivestock,
} = require("../controllers/livestock");

const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, getLivestock).post(protect, addLivestock);
router
  .route("/:id")
  .get(protect, getSingleLivestock)
  .put(protect, updateLivestock)
  .delete(protect, deleteLivestock);

module.exports = router;

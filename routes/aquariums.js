const express = require("express");

const {
  getAquariums,
  getSingleAquarium,
  createAquarium,
  updateAquarium,
} = require("../controllers/aquariums");

const Aquarium = require("../models/Aquarium");
const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getAquariums).post(protect, createAquarium);
router
  .route("/:id")
  .get(protect, getSingleAquarium)
  .put(protect, updateAquarium);

module.exports = router;

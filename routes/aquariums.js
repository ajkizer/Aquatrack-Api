const express = require("express");

const {
  getAquariums,
  getSingleAquarium,
  createAquarium,
  updateAquarium,
  deleteAquarium,
} = require("../controllers/aquariums");

const Aquarium = require("../models/Aquarium");
const router = express.Router();

const livestockRouter = require("./livestock");

const { protect } = require("../middleware/auth");

router.use("/:aquariumId/livestock", livestockRouter);

router.route("/").get(protect, getAquariums).post(protect, createAquarium);
router
  .route("/:id")
  .get(protect, getSingleAquarium)
  .put(protect, updateAquarium)
  .delete(protect, deleteAquarium);

module.exports = router;

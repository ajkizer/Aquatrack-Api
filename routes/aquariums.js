const express = require("express");

const {
  getAquariums,
  getSingleAquarium,
  createAquarium,
  updateAquarium,
  deleteAquarium,
} = require("../controllers/aquariums");

const advancedResults = require("../middleware/advancedResults");

const Aquarium = require("../models/Aquarium");
const router = express.Router();

const livestockRouter = require("./livestock");
const waterchangesRouter = require("./waterchanges");
const plantsRouter = require("./plants");
const parameterChecksRouter = require("./parameterChecks");
const maintenanceTasksRouter = require("./maintenanceTasks");

const { protect } = require("../middleware/auth");

router.use("/:aquariumId/livestock", livestockRouter);
router.use("/:aquariumId/waterchanges", waterchangesRouter);
router.use("/:aquariumId/plants", plantsRouter);
router.use("/:aquariumId/parameters", parameterChecksRouter);
router.use("/:aquariumId/maintenanceTasks", maintenanceTasksRouter);

router
  .route("/")
  .get(protect, advancedResults(Aquarium, "livestock plants"), getAquariums)
  .post(protect, createAquarium);
router
  .route("/:id")
  .get(protect, getSingleAquarium)
  .put(protect, updateAquarium)
  .delete(protect, deleteAquarium);

module.exports = router;
